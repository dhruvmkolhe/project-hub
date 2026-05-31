import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { Project, User, Review } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async ({ params }) => {
    const projectId = params.id;

    try {
        // Get project
        const project = await db.collection<Project>('projects').findOne({ id: projectId });

        if (!project) {
            throw error(404, 'Project not found');
        }

        // Get project creator details
        const user = await db.collection<User>('users').findOne({ id: project.userId });

        // Get reviews
        const rawReviews = await db
            .collection<Review>('reviews')
            .find({ projectId })
            .sort({ createdAt: -1 })
            .toArray();

        // Get reviewer details for each review
        const projectReviews = await Promise.all(
            rawReviews.map(async (review) => {
                const reviewer = await db.collection<User>('users').findOne(
                    { id: review.reviewerId },
                    { projection: { username: 1, avatarUrl: 1 } }
                );

                return {
                    id: review.id,
                    rating: review.rating,
                    functionalityScore: review.functionalityScore,
                    uiScore: review.uiScore,
                    codeQualityScore: review.codeQualityScore,
                    title: review.title,
                    content: review.content,
                    pros: review.pros,
                    cons: review.cons,
                    upvotes: review.upvotes || 0,
                    createdAt: review.createdAt,
                    reviewerId: review.reviewerId,
                    reviewerUsername: reviewer?.username || 'Unknown',
                    reviewerAvatar: reviewer?.avatarUrl || null
                };
            })
        );

        // Get reviews stats
        const reviewCount = rawReviews.length;
        let totalRating = 0;
        let totalFunc = 0;
        let totalUi = 0;
        let totalCode = 0;
        let funcCount = 0;
        let uiCount = 0;
        let codeCount = 0;

        for (const r of rawReviews) {
            totalRating += r.rating;
            if (r.functionalityScore !== null && r.functionalityScore !== undefined) {
                totalFunc += r.functionalityScore;
                funcCount++;
            }
            if (r.uiScore !== null && r.uiScore !== undefined) {
                totalUi += r.uiScore;
                uiCount++;
            }
            if (r.codeQualityScore !== null && r.codeQualityScore !== undefined) {
                totalCode += r.codeQualityScore;
                codeCount++;
            }
        }

        const stats = {
            averageRating: reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0,
            avgFunctionality: funcCount > 0 ? Number((totalFunc / funcCount).toFixed(1)) : 0,
            avgUi: uiCount > 0 ? Number((totalUi / uiCount).toFixed(1)) : 0,
            avgCodeQuality: codeCount > 0 ? Number((totalCode / codeCount).toFixed(1)) : 0,
            reviewCount
        };

        // Update view count
        const newViewCount = (project.viewCount || 0) + 1;
        await db
            .collection<Project>('projects')
            .updateOne({ id: projectId }, { $set: { viewCount: newViewCount } });

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
                viewCount: newViewCount,
                status: project.status,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                user: {
                    id: project.userId,
                    username: user?.username || 'Unknown',
                    displayName: user?.displayName || null,
                    avatarUrl: user?.avatarUrl || null,
                    bio: user?.bio || null,
                    githubUsername: user?.githubUsername || null
                }
            },
            reviews: projectReviews.map(r => ({
                ...r,
                reviewer: {
                    id: r.reviewerId,
                    username: r.reviewerUsername,
                    avatarUrl: r.reviewerAvatar
                }
            })),
            stats
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
            const reviewId = randomUUID();
            const now = new Date();

            await db.collection<Review>('reviews').insertOne({
                id: reviewId,
                projectId: params.id,
                reviewerId: locals.user.id,
                rating,
                functionalityScore,
                uiScore,
                codeQualityScore,
                title: title || null,
                content,
                pros: pros || null,
                cons: cons || null,
                upvotes: 0,
                createdAt: now,
                updatedAt: now
            });

            return { success: true };
        } catch (err) {
            console.error('Failed to submit review:', err);
            return fail(500, { error: 'Failed to submit review. Please try again.' });
        }
    }
};

