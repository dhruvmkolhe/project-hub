import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, users, reviews } from '$lib/server/db/schema';
import { eq, desc, sql, like, or, ilike } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 12;
    const offset = (page - 1) * limit;

    try {
        // Build query
        let query = db
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
                createdAt: projects.createdAt,
                userId: projects.userId,
                username: users.username,
                avatarUrl: users.avatarUrl
            })
            .from(projects)
            .leftJoin(users, eq(projects.userId, users.id))
            .where(eq(projects.status, 'approved'))
            .orderBy(desc(projects.createdAt))
            .limit(limit)
            .offset(offset);

        const projectList = await query;

        // Get review stats for each project
        const projectsWithStats = await Promise.all(
            projectList.map(async (project) => {
                const stats = await db
                    .select({
                        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
                        reviewCount: sql<number>`COUNT(${reviews.id})`
                    })
                    .from(reviews)
                    .where(eq(reviews.projectId, project.id));

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
                        username: project.username || 'Unknown',
                        avatarUrl: project.avatarUrl
                    },
                    averageRating: Number(stats[0]?.avgRating || 0),
                    reviewCount: Number(stats[0]?.reviewCount || 0)
                };
            })
        );

        // Get total count for pagination
        const totalResult = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(projects)
            .where(eq(projects.status, 'approved'));

        const total = Number(totalResult[0]?.count || 0);

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
