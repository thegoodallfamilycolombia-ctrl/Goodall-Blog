# The Goodall Family — Blog Website

A simple, self-contained website for following the Goodall Family, missionaries in
Santa Marta, Colombia. No internet server or special software is required — it's just
HTML files you can open in any web browser or upload to any web host.

## Pages
- **index.html** — Home & Blog (hero, welcome, the First Entry, a featured video, prayer requests)
- **about.html** — About the family
- **reports.html** — Monthly Mission Reports (PDFs), newest to oldest
- **gallery.html** — Photo & video gallery

## How to view it
Double-click **index.html** to open it in your web browser. Use the menu at the top
to move between pages.

> Tip: A couple of things (embedded videos, the full-size photo pop-ups) work best
> in a normal browser like Chrome or Safari, and when the whole `site` folder is kept
> together.

## How to put it online (optional)
Upload the entire `site` folder to any static web host — for example
**Netlify Drop** (netlify.com/drop), **GitHub Pages**, or your ministry's web host.
Keep the folder structure (the `assets` folder must stay next to the HTML files).

## Folder layout
```
site/
├── index.html, about.html, reports.html, gallery.html
├── styles.css
└── assets/
    ├── photos/    (family photos, .jpg)
    ├── reports/   (monthly report PDFs + preview images)
    └── video/     (video clips, .mp4)
```

## Adding a NEW monthly report
1. Put the new PDF in `assets/reports/` (e.g. `2026-07-report.pdf`).
2. Make a preview image of its first page (on a Mac, right-click the PDF → Quick Look,
   or export the first page as a JPG) and save it as `2026-07-preview.jpg` in the same folder.
3. Open `reports.html` and copy the newest report block, paste it at the **top** of the
   list, and update the file names, month, title, and short description.
4. Move the "Newest" badge to the new one (add `class="report latest"` to it and remove
   `latest` from the old one).

## Adding a NEW blog entry
Open `index.html` and duplicate the `<article class="article"> … </article>` block,
then update the title, date, and text. Newest entries go at the top.

## Notes on the photos & videos
- Photos were resized for the web so pages load quickly. Your originals are untouched
  in the main "Goodall Blog" folder.
- Two vertical iPhone videos were converted to a web-friendly format (H.264 MP4) so they
  play in every browser.

Made with love from the coast of Colombia. 🇨🇴
