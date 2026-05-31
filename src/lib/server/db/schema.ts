export interface User {
    id: string; // Stored as a string UUID
    email: string;
    username: string;
    passwordHash: string;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    githubUsername: string | null;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    id: string; // Stored as a string UUID
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface Project {
    id: string; // Stored as a string UUID
    userId: string;
    title: string;
    description: string;
    shortDescription: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    thumbnailUrl: string | null;
    techStack: string[];
    category: 'web-app' | 'mobile-app' | 'api' | 'cli-tool' | 'game' | 'ai-ml' | 'blockchain' | 'other';
    status: 'pending' | 'approved' | 'rejected';
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Review {
    id: string; // Stored as a string UUID
    projectId: string;
    reviewerId: string;
    rating: number; // 1-5 stars
    functionalityScore: number | null; // 1-5
    uiScore: number | null; // 1-5
    codeQualityScore: number | null; // 1-5
    title: string | null;
    content: string;
    pros: string | null;
    cons: string | null;
    upvotes: number;
    createdAt: Date;
    updatedAt: Date;
}
