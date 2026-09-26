import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { Project } from '$lib/server/db/schema';
import { projectSchema } from '$lib/validation';
import { checkRateLimit, sanitizeText, validateUploadedFile } from '$lib/server/security';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/auth/login');
    }

    return {
        user: locals.user
    };
};

export const actions: Actions = {
    default: async ({ request, locals, getClientAddress }) => {
        if (!locals.user) {
            throw redirect(303, '/auth/login');
        }

        const clientIp = getClientAddress() || 'unknown';
        const rateCheck = checkRateLimit(`submit_project:${locals.user.id}:${clientIp}`, 10, 60 * 1000);

        if (!rateCheck.success) {
            return fail(429, { error: 'Too many submission requests. Please wait a minute.' });
        }

        const formData = await request.formData();

        // Handle File Upload Validation & Sanitization
        let thumbnailUrl: string | null = null;
        const thumbnailFile = formData.get('thumbnail') as File;

        if (thumbnailFile && thumbnailFile.size > 0 && thumbnailFile.name) {
            const validation = validateUploadedFile(thumbnailFile);
            if (!validation.valid) {
                return fail(400, { error: validation.error || 'Invalid upload file' });
            }

            try {
                const fileName = `${randomUUID()}${validation.extension}`;
                const uploadDir = 'static/uploads/projects';

                await mkdir(uploadDir, { recursive: true });

                const arrayBuffer = await thumbnailFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await writeFile(path.join(uploadDir, fileName), buffer);

                thumbnailUrl = `/uploads/projects/${fileName}`;
            } catch (err) {
                console.error('File upload save error:', err);
                return fail(500, { error: 'Failed to process file upload. Please try again.' });
            }
        }

        const rawTitle = formData.get('title');
        const rawDescription = formData.get('description');
        const rawShortDescription = formData.get('shortDescription');
        const rawGithubUrl = formData.get('githubUrl');
        const rawLiveUrl = formData.get('liveUrl');
        const rawTechStack = formData.get('techStack');
        const rawCategory = formData.get('category');

        const data = {
            title: sanitizeText(rawTitle as string),
            description: sanitizeText(rawDescription as string),
            shortDescription: sanitizeText(rawShortDescription as string),
            githubUrl: (rawGithubUrl as string)?.trim() || '',
            liveUrl: (rawLiveUrl as string)?.trim() || '',
            techStack: (rawTechStack as string || '')
                .split(',')
                .map((t) => sanitizeText(t.trim()))
                .filter(Boolean),
            category: rawCategory as any
        };

        // Validate Schema
        const result = projectSchema.safeParse(data);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0] as string] = err.message;
                }
            });
            return fail(400, { errors, ...data });
        }

        try {
            const projectId = randomUUID();
            const now = new Date();

            await db.collection<Project>('projects').insertOne({
                id: projectId,
                userId: String(locals.user.id),
                title: data.title,
                description: data.description,
                shortDescription: data.shortDescription || null,
                githubUrl: data.githubUrl || null,
                liveUrl: data.liveUrl || null,
                thumbnailUrl: thumbnailUrl,
                techStack: data.techStack,
                category: data.category,
                status: 'approved',
                viewCount: 0,
                createdAt: now,
                updatedAt: now
            });

            throw redirect(303, `/projects/${projectId}`);
        } catch (error) {
            if ((error as any)?.status === 303) throw error;
            console.error('Failed to create project:', error);
            return fail(500, { error: 'Failed to create project. Please try again.', ...data });
        }
    }
};
