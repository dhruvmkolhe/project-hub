import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { projects, reviews, users } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/auth/login');
    }

    try {
        // Get user's projects
        const userProjects = await db
            .select({
                id: projects.id,
                title: projects.title,
                shortDescription: projects.shortDescription,
                thumbnailUrl: projects.thumbnailUrl,
                category: projects.category,
                status: projects.status,
                viewCount: projects.viewCount,
                createdAt: projects.createdAt
            })
            .from(projects)
            .where(eq(projects.userId, locals.user.id))
            .orderBy(desc(projects.createdAt));

        // Get review stats for user's projects
        const projectsWithStats = await Promise.all(
            userProjects.map(async (project) => {
                const stats = await db
                    .select({
                        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
                        reviewCount: sql<number>`COUNT(${reviews.id})`
                    })
                    .from(reviews)
                    .where(eq(reviews.projectId, project.id));

                return {
                    ...project,
                    averageRating: Number(stats[0]?.avgRating || 0),
                    reviewCount: Number(stats[0]?.reviewCount || 0)
                };
            })
        );

        // Get user's reviews
        const userReviews = await db
            .select({
                id: reviews.id,
                rating: reviews.rating,
                title: reviews.title,
                content: reviews.content,
                createdAt: reviews.createdAt,
                projectId: reviews.projectId,
                projectTitle: projects.title
            })
            .from(reviews)
            .leftJoin(projects, eq(reviews.projectId, projects.id))
            .where(eq(reviews.reviewerId, locals.user.id))
            .orderBy(desc(reviews.createdAt));

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
