import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { Project, Review } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/auth/login');
    }

    try {
        // Get user's projects
        const userProjects = await db
            .collection<Project>('projects')
            .find({ userId: locals.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        // Get review stats for user's projects
        const projectsWithStats = await Promise.all(
            userProjects.map(async (project) => {
                const projectReviews = await db
                    .collection<Review>('reviews')
                    .find({ projectId: project.id })
                    .toArray();

                const reviewCount = projectReviews.length;
                const averageRating = reviewCount > 0 
                    ? projectReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                    : 0;

                return {
                    id: project.id,
                    title: project.title,
                    shortDescription: project.shortDescription,
                    thumbnailUrl: project.thumbnailUrl,
                    category: project.category,
                    status: project.status,
                    viewCount: project.viewCount || 0,
                    createdAt: project.createdAt,
                    averageRating: Number(averageRating.toFixed(1)),
                    reviewCount
                };
            })
        );

        // Get user's reviews with project titles
        const rawUserReviews = await db
            .collection<Review>('reviews')
            .find({ reviewerId: locals.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        const userReviews = await Promise.all(
            rawUserReviews.map(async (review) => {
                const project = await db
                    .collection<Project>('projects')
                    .findOne(
                        { id: review.projectId },
                        { projection: { title: 1 } }
                    );

                return {
                    id: review.id,
                    rating: review.rating,
                    title: review.title,
                    content: review.content,
                    createdAt: review.createdAt,
                    projectId: review.projectId,
                    projectTitle: project?.title || 'Unknown Project'
                };
            })
        );

        // Get overall stats
        const totalProjects = userProjects.length;
        const totalReviews = userReviews.length;
        const totalViews = userProjects.reduce((sum, p) => sum + (p.viewCount || 0), 0);
        const totalReceived = projectsWithStats.reduce((sum, p) => sum + p.reviewCount, 0);

        return {
            user: locals.user,
            projects: projectsWithStats,
            reviews: userReviews,
            stats: {
                totalProjects,
                totalReviews,
                totalViews,
                totalReceived
            }
        };
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        return {
            user: locals.user,
            projects: [],
            reviews: [],
            stats: {
                totalProjects: 0,
                totalReviews: 0,
                totalViews: 0,
                totalReceived: 0
            }
        };
    }
};

