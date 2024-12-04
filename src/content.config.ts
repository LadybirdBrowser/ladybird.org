import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string().max(50),
    description: z.string().max(280),
    author: z.string().max(50),
    image: z.string().min(12),
    type: z.enum(["Thoughts", "Announcement", "Hidden"]),
    date: z.date(),
  }),
});

const newsletterSchema = z.object({
  description: z.string().max(280),
  date: z.date(),
  draft: z.boolean().optional(),
  title: z.string().optional(),
}).strict();

const newsletters = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/newsletters" }),
  schema: newsletterSchema,
});

export const collections = {
  posts,
  newsletters,
};

export type Newsletter = z.infer<typeof newsletterSchema>;
