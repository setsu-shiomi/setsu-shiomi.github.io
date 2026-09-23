# setsu.sh

Personal site of 汐見セツ (Setsu Shiomi) - Linux and local AI, measured.

Built with [Astro](https://astro.build). Deployed to GitHub Pages with a custom
domain (`public/CNAME`).

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
```

## Content

- Site metadata: `src/config.ts`
- Works: `src/data/works.ts`
- Blog posts: `src/content/blog/*.md` (frontmatter: `title`, `date`, `description`)

## Notes

- `public/CNAME` pins the custom domain.
- `npm` blocks postinstall scripts by default (npm 12); approve `esbuild` with
  `npm install-scripts approve esbuild` if install fails.
