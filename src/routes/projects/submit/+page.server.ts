import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { Project } from '$lib/server/db/schema';
import { projectSchema } from '$lib/validation';
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
    default: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(303, '/auth/login');
        }

        const formData = await request.formData();

        // Handle File Upload
        let thumbnailUrl: string | null = null;
        const thumbnailFile = formData.get('thumbnail') as File;

        if (thumbnailFile && thumbnailFile.size > 0 && thumbnailFile.name) {
            try {
                // simple validation
                if (thumbnailFile.size > 5 * 1024 * 1024) { // 5MB
                    return fail(400, { error: 'Thumbnail must be less than 5MB' });
                }

                const ext = path.extname(thumbnailFile.name);
                const fileName = `${randomUUID()}${ext}`;
                const uploadDir = 'static/uploads/projects';

                await mkdir(uploadDir, { recursive: true });

                const arrayBuffer = await thumbnailFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await writeFile(`${uploadDir}/${fileName}`, buffer);

                thumbnailUrl = `/uploads/projects/${fileName}`;
            } catch (err) {
                console.error('Upload failed:', err);
                // continue without thumbnail or fail? Let's continue.
            }
        }

        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            shortDescription: formData.get('shortDescription') as string,
            githubUrl: formData.get('githubUrl') as string,
            liveUrl: formData.get('liveUrl') as string,
            techStack: (formData.get('techStack') as string).split(',').map(t => t.trim()).filter(Boolean),
            category: formData.get('category') as any,
            // thumbnailUrl is handled separately
        };

        // Validate
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
                userId: locals.user.id,
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

