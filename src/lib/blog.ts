import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export const getPublishedPosts = async (): Promise<BlogPost[]> => {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => {
		const dateDiff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
		if (dateDiff !== 0) return dateDiff;
		return b.id.localeCompare(a.id, 'en');
	});
};

export const getAllCategories = (posts: BlogPost[]) => {
	const categories = posts.flatMap((post) => post.data.category ?? []);
	return [...new Set(categories)].sort((a, b) => a.localeCompare(b, 'en'));
};

export const getAllTags = (posts: BlogPost[]) => {
	const tags = posts.flatMap((post) => post.data.tags ?? []);
	return [...new Set(tags)].sort((a, b) => a.localeCompare(b, 'en'));
};

export const getPostsByCategory = (posts: BlogPost[], category: string) =>
	posts.filter((post) => post.data.category?.includes(category));

export const getPostsByTag = (posts: BlogPost[], tag: string) =>
	posts.filter((post) => post.data.tags?.includes(tag));
