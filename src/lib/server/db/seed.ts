import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import * as schema from './schema';

// Read database URL from environment or use default
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres: @localhost:5432/projecthub';
const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

const { users, projects, reviews } = schema;

// Inline password hashing to avoid SvelteKit dependencies
async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

const DEMO_USERS = [
    {
        email: 'john@example.com',
        username: 'johndoe',
        password: 'Password123',
        displayName: 'John Doe',
        bio: 'Full-stack developer passionate about building web applications. Love React and Node.js!',
        githubUsername: 'johndoe'
    },
    {
        email: 'sarah@example.com',
        username: 'sarahdev',
        password: 'Password123',
        displayName: 'Sarah Chen',
        bio: 'Computer Science student. Interested in AI/ML and data science.',
        githubUsername: 'sarahchen'
    },
    {
        email: 'mike@example.com',
        username: 'mikebuilds',
        password: 'Password123',
        displayName: 'Mike Johnson',
        bio: 'Backend developer specializing in Python and Go. Building scalable APIs.',
        githubUsername: 'mikejohnson'
    },
    {
        email: 'emma@example.com',
        username: 'emmacode',
        password: 'Password123',
        displayName: 'Emma Wilson',
        bio: 'UI/UX enthusiast turned frontend developer. Creating beautiful user experiences.',
        githubUsername: 'emmawilson'
    },
    {
        email: 'alex@example.com',
        username: 'alextech',
        password: 'Password123',
        displayName: 'Alex Rivera',
        bio: 'Mobile developer with experience in React Native and Flutter. Gaming enthusiast.',
        githubUsername: 'alexrivera'
    }
];

const DEMO_PROJECTS = [
    {
        title: 'TaskFlow - Project Management App',
        shortDescription: 'A beautiful Kanban-style task manager with real-time collaboration',
        description: `TaskFlow is a modern project management application that helps teams organize their work efficiently.

Features:
- Drag-and-drop Kanban boards
- Real-time collaboration with WebSockets
- Custom workflows and labels
- Team member assignments
- Due date reminders and notifications
- Dark mode support

Built with React, Node.js, and PostgreSQL.`,
        githubUrl: 'https://github.com/johndoe/taskflow',
        liveUrl: 'https://taskflow-demo.vercel.app',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'TailwindCSS'],
        category: 'web-app' as const,
        thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800'
    },
    {
        title: 'ML Image Classifier',
        shortDescription: 'Deep learning model for classifying images into 100+ categories',
        description: `An image classification system built using TensorFlow and Python.

The model can classify images into over 100 categories with 95% accuracy.
Technologies used: Python, TensorFlow, FastAPI, Docker`,
        githubUrl: 'https://github.com/sarahchen/ml-classifier',
        liveUrl: 'https://ml-classifier.herokuapp.com',
        techStack: ['Python', 'TensorFlow', 'FastAPI', 'Docker', 'React'],
        category: 'ai-ml' as const,
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
    },
    {
        title: 'CryptoTracker API',
        shortDescription: 'Real-time cryptocurrency price tracking API with historical data',
        description: `A robust REST API for tracking cryptocurrency prices and market data.

Built with Go for maximum performance. Can handle 10,000+ requests per second.`,
        githubUrl: 'https://github.com/mikejohnson/crypto-api',
        liveUrl: 'https://crypto-api-docs.vercel.app',
        techStack: ['Go', 'PostgreSQL', 'Redis', 'Docker', 'Swagger'],
        category: 'api' as const,
        thumbnailUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800'
    },
    {
        title: 'Designify - UI Component Library',
        shortDescription: 'Modern, accessible React component library with 50+ components',
        description: `Designify is a comprehensive React component library focused on accessibility and beautiful design.

All components are WCAG 2.1 compliant and themeable with CSS variables.`,
        githubUrl: 'https://github.com/emmawilson/designify',
        liveUrl: 'https://designify-ui.vercel.app',
        techStack: ['React', 'TypeScript', 'Storybook', 'Jest', 'CSS'],
        category: 'web-app' as const,
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'
    },
    {
        title: 'RetroQuest - 2D Platformer Game',
        shortDescription: 'A nostalgic pixel-art platformer with 20 challenging levels',
        description: `RetroQuest is a love letter to classic 8-bit platformers!

20 hand-crafted levels, retro pixel art graphics, and chiptune soundtrack.
Built with vanilla JavaScript and HTML5 Canvas.`,
        githubUrl: 'https://github.com/alexrivera/retroquest',
        liveUrl: 'https://retroquest-game.netlify.app',
        techStack: ['JavaScript', 'HTML5 Canvas', 'CSS', 'Web Audio API'],
        category: 'game' as const,
        thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
    },
    {
        title: 'DevCLI - Developer Toolkit',
        shortDescription: 'Command-line tool for common development tasks',
        description: `DevCLI is a Swiss Army knife for developers.

Commands: dev init, dev serve, dev deploy, dev test, dev lint.
Built with Rust for speed and reliability.`,
        githubUrl: 'https://github.com/mikejohnson/devcli',
        liveUrl: '',
        techStack: ['Rust', 'CLI', 'Cross-platform'],
        category: 'cli-tool' as const,
        thumbnailUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800'
    }
];

const DEMO_REVIEWS = [
    { projectIndex: 0, reviewerIndex: 1, rating: 5, functionalityScore: 5, uiScore: 5, codeQualityScore: 4, title: 'Amazing project management tool!', content: 'I absolutely love this app! The drag-and-drop interface is super smooth and the real-time collaboration feature works flawlessly.', pros: 'Beautiful UI, smooth drag-and-drop', cons: 'Could use more keyboard shortcuts' },
    { projectIndex: 0, reviewerIndex: 3, rating: 4, functionalityScore: 4, uiScore: 5, codeQualityScore: 4, title: 'Great UI/UX design', content: 'As a UI enthusiast, I really appreciate the attention to detail in this project. The animations are subtle but effective.', pros: 'Excellent visual design, responsive layout', cons: 'Loading states need work' },
    { projectIndex: 1, reviewerIndex: 2, rating: 5, functionalityScore: 5, uiScore: 4, codeQualityScore: 5, title: 'Impressive ML implementation', content: 'The model accuracy is impressive! I tested it with various images and the predictions were spot-on.', pros: 'High accuracy, clean API design', cons: 'Frontend could use some polish' },
    { projectIndex: 2, reviewerIndex: 0, rating: 5, functionalityScore: 5, uiScore: 5, codeQualityScore: 5, title: 'Best crypto API I\'ve seen!', content: 'This API is incredibly fast and reliable. The Go implementation is top-notch.', pros: 'Lightning fast, comprehensive docs', cons: 'More exchanges would be nice' },
    { projectIndex: 3, reviewerIndex: 1, rating: 5, functionalityScore: 5, uiScore: 5, codeQualityScore: 5, title: 'Production-ready component library', content: 'Every component is accessible, well-designed, and easy to customize.', pros: 'Accessibility-first, beautiful design', cons: 'Would love more chart components' },
    { projectIndex: 4, reviewerIndex: 0, rating: 5, functionalityScore: 5, uiScore: 5, codeQualityScore: 4, title: 'Super fun game!', content: 'I spent way too much time playing this! The pixel art is gorgeous and the music is so catchy.', pros: 'Addictive gameplay, beautiful pixel art', cons: 'Want more levels!' },
    { projectIndex: 5, reviewerIndex: 1, rating: 4, functionalityScore: 4, uiScore: 4, codeQualityScore: 5, title: 'Useful CLI tool', content: 'DevCLI has become part of my daily workflow. The Rust implementation is blazing fast.', pros: 'Fast execution, helpful commands', cons: 'Need more project templates' }
];

async function seedDatabase() {
    console.log('🌱 Starting database seed...\n');

    try {
        console.log('👤 Creating demo users...');
        const createdUsers: { id: string; username: string }[] = [];

        for (const userData of DEMO_USERS) {
            const passwordHash = await hashPassword(userData.password);
            const [user] = await db.insert(users)
                .values({
                    email: userData.email,
                    username: userData.username,
                    passwordHash,
                    displayName: userData.displayName,
                    bio: userData.bio,
                    githubUsername: userData.githubUsername
                })
                .returning({ id: users.id, username: users.username });

            createdUsers.push(user);
            console.log(`  ✓ Created user: ${userData.username} (${userData.email})`);
        }

        console.log('\n📂 Creating demo projects...');
        const createdProjects: { id: string; title: string }[] = [];

        for (let i = 0; i < DEMO_PROJECTS.length; i++) {
            const projectData = DEMO_PROJECTS[i];
            const userIndex = i % createdUsers.length;

            const [project] = await db.insert(projects)
                .values({
                    userId: createdUsers[userIndex].id,
                    title: projectData.title,
                    shortDescription: projectData.shortDescription,
                    description: projectData.description,
                    githubUrl: projectData.githubUrl,
                    liveUrl: projectData.liveUrl || null,
                    techStack: projectData.techStack,
                    category: projectData.category,
                    thumbnailUrl: projectData.thumbnailUrl,
                    status: 'approved',
                    viewCount: Math.floor(Math.random() * 500) + 50
                })
                .returning({ id: projects.id, title: projects.title });

            createdProjects.push(project);
            console.log(`  ✓ Created project: ${projectData.title}`);
        }

        console.log('\n⭐ Creating demo reviews...');

        for (const reviewData of DEMO_REVIEWS) {
            await db.insert(reviews).values({
                projectId: createdProjects[reviewData.projectIndex].id,
                reviewerId: createdUsers[reviewData.reviewerIndex].id,
                rating: reviewData.rating,
                functionalityScore: reviewData.functionalityScore,
                uiScore: reviewData.uiScore,
                codeQualityScore: reviewData.codeQualityScore,
                title: reviewData.title,
                content: reviewData.content,
                pros: reviewData.pros,
                cons: reviewData.cons
            });
            console.log(`  ✓ Added review for: ${createdProjects[reviewData.projectIndex].title}`);
        }

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📋 Demo Accounts (all passwords: Password123):');
        for (const user of DEMO_USERS) {
            console.log(`   • ${user.email}`);
        }

        await client.end();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        await client.end();
        throw error;
    }
}

seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
