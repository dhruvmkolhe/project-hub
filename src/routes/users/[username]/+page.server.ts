import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects, reviews } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
    const username = params.username;

    try {
        // 1. Fetch User Details
        const [userProfile] = await db
            .select({
                id: users.id,
                username: users.username,
                displayName: users.displayName,
                avatarUrl: users.avatarUrl,
                bio: users.bio,
                githubUsername: users.githubUsername,
                createdAt: users.createdAt
            })
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        if (!userProfile) {
            throw error(404, 'User not found');
        }

        // 2. Fetch User's Projects
        const userProjects = await db
            .select({
                id: projects.id,
                title: projects.title,
                shortDescription: projects.shortDescription,
                thumbnailUrl: projects.thumbnailUrl,
                techStack: projects.techStack,
                category: projects.category,
                viewCount: projects.viewCount,
                createdAt: projects.createdAt,
                // Aggregated stats for the project
                avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
                reviewCount: sql<number>`COUNT(${reviews.id})`
            })
            .from(projects)
            .leftJoin(reviews, eq(projects.id, reviews.projectId))
            .where(eq(projects.userId, userProfile.id))
            .groupBy(projects.id)
            .orderBy(desc(projects.createdAt));

        // 3. Calculate Overall Stats
        const totalProjects = userProjects.length;
        const totalReviewsReceived = userProjects.reduce((sum, p) => sum + Number(p.reviewCount), 0);

        // Calculate average rating across all projects
        const totalRatingSum = userProjects.reduce((sum, p) => sum + (Number(p.avgRating) * Number(p.reviewCount)), 0);
        const overallAverageRating = totalReviewsReceived > 0
            ? totalRatingSum / totalReviewsReceived
            : 0;

        return {
            profile: userProfile,
            projects: userProjects.map(p => ({
                ...p,
                averageRating: Number(p.avgRating),
                reviewCount: Number(p.reviewCount)
            })),
            stats: {
                totalProjects,
                totalReviewsReceived,
                overallAverageRating
            }
        };

    } catch (err) {
        if ((err as any)?.status === 404) throw err;
        console.error('Error loading user profile:', err);
        throw error(500, 'Failed to load user profile');
    }
};
