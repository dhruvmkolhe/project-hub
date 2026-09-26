import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		// Production optimization: disable source maps to protect source code and shrink bundle size
		sourcemap: false
	}
});
