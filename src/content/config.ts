import { z, defineCollection } from "astro:content";

export const postSchema = z.object({
  title: z.string().max(50),
  description: z.string().max(280),
  author: z.string().max(50),
  image: z.string().min(12),
  type: z.enum(["Thoughts", "Announcement", "Hidden"]),
  date: z.date(),
});
export type Post = z.infer<typeof postSchema>;

const posts = defineCollection({
  type: "content",
  schema: postSchema,
});

export const newsletterSchema = z.object({
  description: z.string().max(280),
  date: z.date(),
  draft: z.boolean().optional(),
});
export type Newsletter = z.infer<typeof newsletterSchema>;

const newsletters = defineCollection({
  type: "content",
  schema: newsletterSchema,
});

export const collections = {
  posts,
  newsletters,
};
