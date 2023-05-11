import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocessReact from "svelte-preprocess-react/preprocessReact";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocessReact({
    preprocess: vitePreprocess(),
  }),

	kit: {
		adapter: adapter(),
		paths: {
			base: '/dan-harris'
		}
	}
};

export default config;
