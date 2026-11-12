# The Goodall Family — Blog Website

A simple, self-contained website for following the Goodall Family, missionaries in
Santa Marta, Colombia. No internet server or special software is required — it's just
HTML files you can open in any web browser or upload to any web host.

## Pages
- **index.html** — Home & Blog (hero, welcome, the First Entry, prayer requests)
- **about.html** — About the family
- **reports.html** — Monthly Mission Reports (PDFs), newest to oldest
- **gallery.html** — Photo gallery

## How to view it
Double-click **index.html** to open it in your web browser. Use the menu at the top
to move between pages.

> Tip: The full-size photo pop-ups work best in a normal browser like Chrome or
> Safari, and when the whole `site` folder is kept together.

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
    └── reports/   (monthly report PDFs + preview images)
```

> Video clips are not in the deployed site right now — IONOS Deploy Now's
> hosting quota is too small for self-hosted video. The clips are saved
> locally in `videos-for-youtube-later/` (next to `site/`, not inside it)
> until they're uploaded to YouTube and embedded instead.

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

## Notes on the photos
- Photos were resized and compressed for the web (max 1280px, quality 65) to fit IONOS
  Deploy Now's hosting quota. Your originals are untouched in the main "Goodall Blog" folder.

Made with love from the coast of Colombia. 🇨🇴
