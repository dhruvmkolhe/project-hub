import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // If authenticated, redirect to their public profile
    if (locals.user) {
        throw redirect(302, `/users/${locals.user.username}`);
    }

    // If not authenticated, send to login
    throw redirect(302, '/auth/login');
};
