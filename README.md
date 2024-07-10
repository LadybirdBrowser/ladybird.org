# ladybird.org

## Setup

### Required Tools

- Bun, see [bun.sh](https://bun.sh) for install instructions

### Setup

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

To test:

```bash
bun test
```

To preview production builds:

```bash
bun run build && bun preview
```

To format

To run:

```bash
bun format
```

## Adding Content

All content is parsed througha zod type validator during the build step to ensure all necessary frontmatter fields like `Title`, `Author`, or `Date` are filled out and compliant, if you get an error with validation it should explain what rule you broke such as missing a field or crossing the maximum length.

### Posts

The six most recent posts will be displayed on the site at `/#news`

A new content post can be added by going to `src/content/posts/[route].mdx` and configuring an mdx file like so:

```mdx
---
title: Ladybird Forks from SerenityOS!
author: Andreas Kling
description: Independent from SereintyOS, and what this will bring.
image: /assets/img/fork.webp
type: Announcement
date: 2024-06-03
---

Regular MD content here, but note you can embed HTML if you want to with tailwind, you can also import custom Astro components if you want to
```

> Types available are, Announcement, Thoughts, Hidden; posts under Hidden will not appear in the news list, this is for pages to link to but not meant to be seen when just looking through such as the Thanks for sponsoring page.

> Alt parsing for accessibility on the images is done by taking the image filename and stripping the extension, please make sure to take this into account when naming images.

### Newsletter

The newsletters while not currently being displayed render out to `/newsletter/YYYY-MM-DD` and can be added by creating a new one in `src/content/newsletter/[date].mdx`.

```mdx
---
description: Ladybird browser initiative launched
date: 2024-07-09
---

Regular MD content here, but note you can embed HTML if you want to with tailwind, you can also import custom Astro components if you want to
```

## Notes

> Styling is currently coming from a mix of standard css in `src/styles/global.css` and tailwind; but we are moving to be fully tailwind driven in the future with the exception of some gradients.
