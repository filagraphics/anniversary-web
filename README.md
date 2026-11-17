# Six Years of Memories

A private, interactive digital memory book, built as **one page that turns horizontally like an album**: no menu, no vertical scrolling page.

**Pages, in order:** Opening → Our Journey (timeline) → for each chapter: a cinematic cover, scrapbook spreads (2–4 taped prints per page, with parallax as you turn), and an optional handwritten note → Moments in Motion (videos) → Do You Remember This? → One More Thing... (letter) → The last page.

**Turning pages:** swipe sideways (or up/down) on touch screens, use the mouse wheel or trackpad, the ← → / Page Up / Page Down / Home / End keys, the arrow buttons, or the progress ticks at the bottom. Pages that hold more than fits on screen (videos on phones, the upload page, the letter) scroll vertically inside the page first. Videos pause automatically when you turn the page.

Pages are generated from `data/`. Add photos to a chapter and new spreads appear automatically (photos are grouped in threes, and a single leftover joins the previous spread).

It's built with Next.js (App Router, static export), TypeScript, Tailwind CSS v4, Framer Motion and Lucide icons. There is no backend, database or upload service. The whole site is static files in `out/`.

---

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Production build (static export):

```bash
pnpm build        # outputs static files to ./out
npx serve out     # or any static file server, to preview the export
```

---

## Where everything lives

```text
data/
├── chapters.ts     # chapter titles, captions, descriptions, placeholder years, covers
├── memories.ts     # every photo: title, date, caption, file paths
├── videos.ts       # video titles, captions, files, posters
├── messages.ts     # hero text, section intros, the letter, closing line, music file
public/
├── images/         # cover.jpg (+ cover-blur.jpg), covers/chapter-0X.jpg
├── memories/chapter-0X/         # full-size photos (lightbox)
├── memories/chapter-0X/thumbs/  # smaller copies (grid)
├── videos/         # .mp4 files + posters/
└── audio/          # background-music.wav
```

You can change all content in `data/` without touching any React components.

### Replace photographs

1. Put your photo in `public/memories/chapter-01/` (or `chapter-02`, `chapter-03`), e.g. `photo-01.jpg`.
2. Optionally add a smaller copy (~800px wide) with the same name in `.../thumbs/`. This speeds up the grid. If you skip it, remove the `thumbnail` line and the full image is used.
3. Update the matching entry in `data/memories.ts`: `title`, `date`, `caption`, `alt` (a short description for screen readers), and `width`/`height` if you know them (these are optional).
4. To add a photo, copy an entry, give it a new `id`, and set its `chapter`.
5. Set `featured: true` to give a photo its own page right after the chapter cover, where it slowly "develops" like an instant photo. "Our Very First Photo" uses this.

Keep files at about 1500–2000px on the long edge and under ~500 KB for fast loading.

### Replace videos

1. Put an `.mp4` (H.264) file in `public/videos/` and a 16:9 still frame in `public/videos/posters/`.
2. Edit `data/videos.ts`.
3. If you don't have the file yet, set `placeholder: true` and the site shows a clearly marked placeholder card.

Videos never autoplay and are only downloaded once someone presses play.

### Update chapter titles and the timeline dates

Edit `data/chapters.ts`. `closingNote` (optional) adds a handwritten note page after the chapter. `theme` (`paper`, `light`, `dark`) sets the spread background and cover composition. The `period` values ("Year One", "Years Two – Four"…) are placeholders. Replace them with real years, e.g. `"2019 – 2020"`. The covers are `public/images/covers/chapter-0X.jpg` (wide, about 2:1).

### Edit the special letter

Edit `letter` in `data/messages.ts`. Each string in `paragraphs` is one paragraph. Also set `greeting`, `signOff` and **`signature`** (currently `"Your Name"`).

The hero text, section intros, the "Do You Remember This?" confirmation and the closing line are in the same file.

### Background music

Replace `public/audio/background-music.wav` (a synthesized placeholder) with your own file, e.g. `song.mp3`, and update `music.src` in `data/messages.ts`. Music only plays when the toggle is pressed, and it pauses automatically when a video starts.

---

## "Do You Remember This?"

Visitors can pick photos or videos from their device, preview them, add a title, description and date, remove them, and download everything as a ZIP (`memories/` + `memories.json` + `memories.txt`). All of this happens in the browser using temporary object URLs. **Nothing is uploaded or saved anywhere**, and the selections disappear on refresh unless they're downloaded.

---

## Privacy

- `<meta name="robots" content="noindex, nofollow">` and `public/robots.txt` (`Disallow: /`) keep search engines away.
- The sample photos and videos are royalty-free stock images (Unsplash/Pexels-style) and stock footage from Pexels. Don't commit private photos to a public repository. Use a private repo, or deploy without pushing media.
- Noindex isn't access control. Anyone with the link can view the site. If you need protection, use your host's password feature (e.g. Vercel Deployment Protection) or HTTP basic auth on Nginx.

---

## Deployment

### Vercel

1. Push the project to a (private) Git repository and import it at vercel.com.
2. Vercel detects Next.js automatically. The default build command `pnpm build` works as is.

Or from the CLI: `pnpm dlx vercel` (then `vercel --prod`).

### GitHub Pages

For a project page (`https://<user>.github.io/<repo>/`), the site needs a base path:

```bash
NEXT_PUBLIC_BASE_PATH=/<repo> pnpm build
touch out/.nojekyll          # lets GitHub serve the _next/ folder
```

Then publish the `out/` folder. Example workflow `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - uses: actions/deploy-pages@v4
```

Enable it under **Settings → Pages → Source: GitHub Actions**. For a user site (`<user>.github.io`) or a custom domain, leave `NEXT_PUBLIC_BASE_PATH` unset.

### Nginx (any static host)

```bash
pnpm build
rsync -av out/ user@server:/var/www/memories/
```

```nginx
server {
    listen 80;
    server_name memories.example.com;
    root /var/www/memories;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location ~* \.(jpg|jpeg|png|webp|mp4|wav|mp3|woff2|js|css)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    add_header X-Robots-Tag "noindex, nofollow" always;
}
```

---

## Accessibility & behaviour notes

- Honours "reduce motion": parallax, floating particles and entrance animations are disabled.
- Off-screen pages are `inert`, so keyboard focus and screen readers stay on the current page. Each page is announced as "N of 16: title".
- Lightbox: arrow keys, Escape, focus trap, swipe on touch devices, and visible previous/next buttons on mobile. While it's open, the arrow keys move between photos, not pages.
- Missing images and videos show a soft "unavailable" card instead of a broken icon.
- Tested at 390px and 1440px: every page, navigation method, the lightbox, video, upload/ZIP and the letter, with no console errors.
