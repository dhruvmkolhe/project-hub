import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required')
});

export const projectSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be at most 100 characters'),
    description: z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(5000, 'Description must be at most 5000 characters'),
    shortDescription: z.string()
        .max(200, 'Short description must be at most 200 characters')
        .optional(),
    githubUrl: z.string()
        .url('Please enter a valid URL')
        .regex(/github\.com/, 'Must be a GitHub URL')
        .optional()
        .or(z.literal('')),
    liveUrl: z.string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    techStack: z.array(z.string()).min(1, 'Please select at least one technology'),
    category: z.enum(['web-app', 'mobile-app', 'api', 'cli-tool', 'game', 'ai-ml', 'blockchain', 'other'])
});

export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    functionalityScore: z.number().min(1).max(5).optional(),
    uiScore: z.number().min(1).max(5).optional(),
    codeQualityScore: z.number().min(1).max(5).optional(),
    title: z.string().max(100).optional(),
    content: z.string()
        .min(20, 'Review must be at least 20 characters')
        .max(3000, 'Review must be at most 3000 characters'),
    pros: z.string().max(500).optional(),
    cons: z.string().max(500).optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
