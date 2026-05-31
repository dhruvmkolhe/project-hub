import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import type { Project, User, Review } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ url }) => {
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 12;
    const offset = (page - 1) * limit;

    try {
        // Build MongoDB filter
        const filter: any = { status: 'approved' };
        
        if (category) {
            filter.category = category;
        }
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } }
            ];
        }

        // Get matching projects with limit & skip
        const projectList = await db
            .collection<Project>('projects')
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .toArray();

        // Get review stats and user details for each project
        const projectsWithStats = await Promise.all(
            projectList.map(async (project) => {
                const user = await db.collection<User>('users').findOne(
                    { id: project.userId },
                    { projection: { username: 1, avatarUrl: 1 } }
                );

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
                    description: project.description,
                    thumbnailUrl: project.thumbnailUrl,
                    techStack: project.techStack || [],
                    category: project.category || 'other',
                    liveUrl: project.liveUrl,
                    githubUrl: project.githubUrl,
                    viewCount: project.viewCount || 0,
                    createdAt: project.createdAt,
                    user: {
                        username: user?.username || 'Unknown',
                        avatarUrl: user?.avatarUrl || null
                    },
                    averageRating: Number(averageRating.toFixed(1)),
                    reviewCount
                };
            })
        );

        // Get total count for pagination
        const total = await db.collection<Project>('projects').countDocuments(filter);

        return {
            projects: projectsWithStats,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            filters: {
                search,
                category
            }
        };
    } catch (error) {
        console.error('Failed to load projects:', error);
        return {
            projects: [],
            pagination: { page: 1, limit, total: 0, totalPages: 0 },
            filters: { search, category }
        };
    }
};

