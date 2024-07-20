import { z, defineCollection } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().max(50),
    description: z.string().max(280),
    author: z.string().max(50),
    image: z.string().min(12),
    type: z.enum(["Thoughts", "Announcement", "Hidden"]),
    date: z.date(),
  }),
});

const newsletter = defineCollection({
  type: "content",
  schema: z.object({
    description: z.string().max(280),
    date: z.date(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  posts,
  newsletter,
};
