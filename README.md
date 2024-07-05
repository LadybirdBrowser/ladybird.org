# ladybird.org

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

A new content post can be added by going to `src/pages/[route].md` and configuring an md file like so:

```md
---
layout: ../layouts/post.astro
title: Simple short title
author: Author names or don't include this to default to "Announcement"
date: Date as a string such as July 1st 2024
---

## MD content goes here

and more below
```

> Styling is currently coming from standard css in `src/styles/global.css` but will be tailwind driven in the future, you can already use tailwind inside any `class=""` block right now if you are making a PR
