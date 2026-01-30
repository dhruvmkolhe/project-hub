import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects, users, reviews } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
    const projectId = params.id;

    try {
        // Get project with user info
        const [project] = await db
            .select({
                id: projects.id,
                title: projects.title,
                shortDescription: projects.shortDescription,
                description: projects.description,
                thumbnailUrl: projects.thumbnailUrl,
                techStack: projects.techStack,
                category: projects.category,
                liveUrl: projects.liveUrl,
                githubUrl: projects.githubUrl,
                viewCount: projects.viewCount,
                status: projects.status,
                createdAt: projects.createdAt,
                updatedAt: projects.updatedAt,
                userId: projects.userId,
                username: users.username,
                displayName: users.displayName,
                avatarUrl: users.avatarUrl,
                bio: users.bio,
                githubUsername: users.githubUsername
            })
            .from(projects)
            .leftJoin(users, eq(projects.userId, users.id))
            .where(eq(projects.id, projectId))
            .limit(1);

        if (!project) {
            throw error(404, 'Project not found');
        }

        // Get reviews with reviewer info
        const projectReviews = await db
            .select({
                id: reviews.id,
                rating: reviews.rating,
                functionalityScore: reviews.functionalityScore,
                uiScore: reviews.uiScore,
                codeQualityScore: reviews.codeQualityScore,
                title: reviews.title,
                content: reviews.content,
                pros: reviews.pros,
                cons: reviews.cons,
                upvotes: reviews.upvotes,
                createdAt: reviews.createdAt,
                reviewerId: reviews.reviewerId,
                reviewerUsername: users.username,
                reviewerAvatar: users.avatarUrl
            })
            .from(reviews)
            .leftJoin(users, eq(reviews.reviewerId, users.id))
            .where(eq(reviews.projectId, projectId))
            .orderBy(desc(reviews.createdAt));

        // Get stats
        const stats = await db
            .select({
                avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
                avgFunctionality: sql<number>`COALESCE(AVG(${reviews.functionalityScore}), 0)`,
                avgUi: sql<number>`COALESCE(AVG(${reviews.uiScore}), 0)`,
                avgCodeQuality: sql<number>`COALESCE(AVG(${reviews.codeQualityScore}), 0)`,
                reviewCount: sql<number>`COUNT(${reviews.id})`
            })
            .from(reviews)
            .where(eq(reviews.projectId, projectId));

        // Update view count
        await db
            .update(projects)
            .set({ viewCount: (project.viewCount || 0) + 1 })
            .where(eq(projects.id, projectId));

        return {
            project: {
                id: project.id,
                title: project.title,
                shortDescription: project.shortDescription,
                description: project.description,
                thumbnailUrl: project.thumbnailUrl,
                techStack: project.techStack || [],
                category: project.category || 'other',
                liveUrl: project.liveUrl,
                githubUrl: project.githubUrl,
                viewCount: (project.viewCount || 0) + 1,
                status: project.status,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                user: {
                    id: project.userId,
                    username: project.username || 'Unknown',
                    displayName: project.displayName,
                    avatarUrl: project.avatarUrl,
                    bio: project.bio,
                    githubUsername: project.githubUsername
                }
            },
            reviews: projectReviews.map(r => ({
                ...r,
                reviewer: {
                    id: r.reviewerId,
                    username: r.reviewerUsername || 'Unknown',
                    avatarUrl: r.reviewerAvatar
                }
            })),
            stats: {
                averageRating: Number(stats[0]?.avgRating || 0),
                avgFunctionality: Number(stats[0]?.avgFunctionality || 0),
                avgUi: Number(stats[0]?.avgUi || 0),
                avgCodeQuality: Number(stats[0]?.avgCodeQuality || 0),
                reviewCount: Number(stats[0]?.reviewCount || 0)
            }
        };
    } catch (err) {
        if ((err as any)?.status === 404) throw err;
        console.error('Failed to load project:', err);
        throw error(500, 'Failed to load project');
    }
};

import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
    submitReview: async ({ request, locals, params }) => {
        if (!locals.user) {
            throw redirect(303, '/auth/login');
        }

        const formData = await request.formData();

        const rating = parseInt(formData.get('rating') as string);
        const functionalityScore = parseInt(formData.get('functionalityScore') as string) || null;
        const uiScore = parseInt(formData.get('uiScore') as string) || null;
        const codeQualityScore = parseInt(formData.get('codeQualityScore') as string) || null;
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const pros = formData.get('pros') as string;
        const cons = formData.get('cons') as string;

        if (!rating || rating < 1 || rating > 5) {
            return fail(400, { error: 'Please provide a rating between 1 and 5' });
        }

        if (!content || content.length < 20) {
            return fail(400, { error: 'Review must be at least 20 characters' });
        }

        try {
            await db.insert(reviews).values({
                projectId: params.id,
                reviewerId: locals.user.id,
                rating,
                functionalityScore,
                uiScore,
                codeQualityScore,
                title: title || null,
                content,
                pros: pros || null,
                cons: cons || null
            });

            return { success: true };
        } catch (err) {
            console.error('Failed to submit review:', err);
            return fail(500, { error: 'Failed to submit review. Please try again.' });
        }
    }
};
