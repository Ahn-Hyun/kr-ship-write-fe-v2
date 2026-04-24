import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			author: z.string().optional().default('Shipwrite.kr Editorial Team'),
			category: z.array(z.enum(['stocks', 'real-estate'])).length(1),
			tags: z.array(z.string()).default([]),
			references: z.array(z.string().url()).default([]),
			draft: z.boolean().optional().default(false),
			heroImage: z
				.object({
					src: z.string(),
					alt: z.string().optional(),
				})
				.optional(),
			seo: z
				.object({
					canonical: z.string().url().optional(),
					ogTitle: z.string().optional(),
					ogDescription: z.string().optional(),
				})
				.optional(),
		}),
});

export const collections = { blog };
