import { type SchemaContext, z as zod } from 'astro:content';

export const blogSchema = ({ image }: SchemaContext) => zod.object({
	title: zod.string().describe('The post title that will be displayed as the top of the post page or as the heading on lists.'),
	summary: zod.string().describe('A summary for the post that will show in list pages.'),
	createdAt: zod.date().describe('The post creation date.'),
	updatedAt: zod.date().optional().describe('The post last update date.'),
	draft: zod.boolean().optional().describe('Whether the post is a draft or not.'),

	image: image().optional().describe('The post main "hero" image path, relative to the blog root.'),
	imageAlt: zod.string().optional().describe('The post main image alt text.'),

	tags: zod.array(zod.string()).optional().describe('The post tags.'),
	updates: zod.array(zod.string()).optional().describe('The post updates.')
});
