import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto automatically selects @sveltejs/adapter-vercel on Vercel
		adapter: adapter()
	}
};

export default config;
