import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import type { User, Project, Review } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
    const username = params.username;

    try {
        // 1. Fetch User Details
        const userProfile = await db
            .collection<User>('users')
            .findOne(
                { username },
                { projection: { _id: 0, id: 1, username: 1, displayName: 1, avatarUrl: 1, bio: 1, githubUsername: 1, createdAt: 1 } }
            );

        if (!userProfile) {
            throw error(404, 'User not found');
        }

        // 2. Fetch User's Projects
        const projectsList = await db
            .collection<Project>('projects')
            .find({ userId: userProfile.id })
            .sort({ createdAt: -1 })
            .toArray();

        const userProjects = await Promise.all(
            projectsList.map(async (project) => {
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
                    techStack: project.techStack || [],
                    category: project.category || 'other',
                    viewCount: project.viewCount || 0,
                    createdAt: project.createdAt,
                    averageRating: Number(averageRating.toFixed(1)),
                    reviewCount
                };
            })
        );

        // 3. Calculate Overall Stats
        const totalProjects = userProjects.length;
        const totalReviewsReceived = userProjects.reduce((sum, p) => sum + p.reviewCount, 0);

        // Calculate average rating across all projects
        const totalRatingSum = userProjects.reduce((sum, p) => sum + (p.averageRating * p.reviewCount), 0);
        const overallAverageRating = totalReviewsReceived > 0
            ? totalRatingSum / totalReviewsReceived
            : 0;

        return {
            profile: userProfile,
            projects: userProjects,
            stats: {
                totalProjects,
                totalReviewsReceived,
                overallAverageRating: Number(overallAverageRating.toFixed(1))
            }
        };

    } catch (err) {
        if ((err as any)?.status === 404) throw err;
        console.error('Error loading user profile:', err);
        throw error(500, 'Failed to load user profile');
    }
};

