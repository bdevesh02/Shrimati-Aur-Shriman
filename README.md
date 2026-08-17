# Shrimati & Shriman — digital scrapbook

A production-ready romantic scrapbook for photographs, timeline memories, love notes, important dates, and partner profiles. It is built on [Beautiful Jekyll](https://beautifuljekyll.com/), hosted from GitHub, and designed for free Netlify deployment.

The important part: after the one-time Netlify setup, both partners can publish from `/admin/` in a normal web browser. You do not need to edit code to add a photograph, memory, note, or date.

## What is included

- Responsive home page, chronological story, album gallery, newest-first notes, important dates, profiles, and personal footer
- Fullscreen gallery with zoom, previous/next controls, keyboard navigation, focus management, and mobile swipe
- Light/dark colour modes and reduced-motion support
- Lazy-loaded images, explicit image sizes, useful alternative text fields, accessible focus states, and a skip link
- SEO and Open Graph metadata, sitemap, `robots.txt`, favicon, and custom 404 page
- Decap CMS browser dashboard using GitHub sign-in—no database or paid CMS
- Netlify build settings and security headers
- GitHub Actions build check for every pull request

## Before publishing: replace the examples

Open the browser dashboard and update **Site Settings → Couple & Home Page**. Replace:

1. `Shrimati & Shriman` with your names.
2. `Your Name` and `Her Name` with your real names.
3. The sample relationship date.
4. The main and profile placeholder images.
5. The welcome text and biographies.
6. **Show sample-content notice**: switch this off only after replacing the examples.

The sample entries explain their own purpose and are safe to delete when your real entries are ready.

## Publish from the website (normal day-to-day method)

Visit `https://YOUR-NETLIFY-SITE.netlify.app/admin/` and sign in with GitHub.

### Add a gallery photograph

1. Choose **Photo Gallery → New Photograph**.
2. Enter a caption and date.
3. Enter an album name. Reusing exactly the same name groups photographs into one album.
4. Choose the photograph from your phone or computer.
5. Write a short but specific description for visitors who cannot see it.
6. Select **Publish → Publish now**.

### Add a timeline memory

1. Choose **Our Story → New Memory**.
2. Add a title, date, optional location, photograph, description, caption, and short summary.
3. Write the full story in the large editor.
4. Publish. The date automatically places it correctly in the timeline.

### Publish a love note

1. Choose **Love Notes → New Love Note**.
2. Add the title, date, who it is from, who it is to, and a one-sentence summary.
3. Write the note and publish it. The newest date appears first.

### Update an important date

1. Choose **Important Dates**, then open an existing entry or create one.
2. Set its date, category, description, and whether it repeats yearly.
3. Enable **Show in home-page countdown** for only one entry at a time.
4. Publish.

Each publish creates a normal GitHub commit. Netlify notices it and redeploys automatically, usually within a few minutes.

## Give both partners publishing access

Never share one GitHub password or an access token.

The second partner does not have a GitHub account yet, so complete these steps when she is ready:

1. She creates a free account at [github.com/signup](https://github.com/signup), verifies her email, and ideally enables two-factor authentication.
2. The repository owner opens **GitHub repository → Settings → Collaborators → Add people**.
3. Search for her exact GitHub username and invite her with write access.
4. She accepts the invitation from GitHub.
5. She opens the site's `/admin/` address and signs in with her own GitHub account.

Only repository collaborators can publish through the dashboard. The dashboard login protects editing; it does **not** make the finished scrapbook private.

## Privacy: read this before adding personal content

The repository is currently public, and the Netlify website is intended to be viewable by anyone with its link. Even if the GitHub repository is later made private, the deployed Netlify website is still public unless real access control is configured separately.

Do not publish home addresses, phone numbers, travel booking details, private documents, API keys, passwords, or anything either person would not want copied. “Anyone with the link” is not password protection—the link can be forwarded or indexed.

## Connect the repository to Netlify

The site files and Netlify settings are ready. One GitHub account owner must do this once:

1. Sign in at [app.netlify.com](https://app.netlify.com/) with GitHub.
2. Choose **Add new project → Import an existing project → GitHub**.
3. Authorize Netlify and select `bdevesh02/Shrimati-Aur-Shriman`.
4. Set the production branch to `master`. Netlify should read `netlify.toml` automatically:
   - Build command: `bundle exec jekyll build --trace`
   - Publish directory: `_site`
5. Choose **Deploy** and keep the generated `*.netlify.app` URL (or add a custom domain later).
6. Open the deployed home page and `/admin/`.

### One-time GitHub sign-in setup for the admin page

Decap CMS needs a GitHub OAuth application so it can save a publish as the signed-in collaborator.

1. In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Use a recognisable name such as `Shrimati Aur Shriman CMS`.
3. Set **Homepage URL** to the Netlify site URL.
4. Set **Authorization callback URL** to `https://api.netlify.com/auth/done`.
5. Register the application and generate a client secret. Treat that secret like a password.
6. In Netlify, open the site's **Site configuration → Access & security → OAuth → Authentication providers**.
7. Install the **GitHub** provider and enter the GitHub OAuth client ID and secret there. Do not commit either value to this repository.
8. Reopen `/admin/` in a private/incognito window and test the GitHub sign-in.

If Netlify changes a menu label, search its site configuration for **OAuth provider**; the client ID and secret still belong in Netlify's protected settings, never in a file.

## Photograph preparation

The website lazy-loads non-hero images and reserves their layout space, but the browser still has to download each uploaded file. Before uploading:

- Prefer JPEG or WebP for photographs and PNG only when transparency is required.
- Resize the longest edge to roughly 2,000–2,500 pixels.
- Aim for under 2 MB per image; 300–900 KB is usually enough for the web.
- Remove location metadata if you do not want GPS information stored in the file.
- Use a filename without private information, for example `beach-sunset-2026.webp`.

## Preview in VS Code

This is optional because Netlify supplies a deploy preview on every pull request.

1. Install [VS Code](https://code.visualstudio.com/), Git, and Ruby 3.3.
2. Open this repository's folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:

```bash
gem install bundler
bundle install
bundle exec jekyll serve --livereload
```

5. Open `http://127.0.0.1:4000` in a browser. Stop the preview with `Ctrl+C`.

VS Code's basic “Live Server” extension is not enough by itself because Jekyll must turn the collections and layouts into finished HTML.

## Where the editable content lives

The dashboard manages these organised files behind the scenes:

| Content | Folder/file | Uploaded images |
|---|---|---|
| Names, hero, profiles | `_data/couple.yml` | `assets/uploads/hero/`, `assets/uploads/profiles/` |
| Timeline memories | `_memories/` | `assets/uploads/timeline/` |
| Gallery photographs | `_gallery/` | `assets/uploads/gallery/` |
| Love notes | `_love_notes/` | Not normally needed |
| Important dates | `_important_dates/` | Not normally needed |

The examples in each folder also show the exact file format for people who later want to work in VS Code.

## Commit and push a code change from VS Code

You do not need this for ordinary publishing through `/admin/`. Use it only for design or code changes:

```bash
git switch master
git pull --ff-only
git switch -c update/short-description
git status
git add path/to/the-file-you-changed
git commit -m "Describe the scrapbook update"
git push -u origin update/short-description
```

Open the link Git prints, create a pull request, wait for the build check and Netlify preview, then merge only after reviewing the result.

## Redeploy after future changes

- A browser-dashboard publish commits to `master`, so Netlify redeploys automatically.
- A merged GitHub pull request also redeploys automatically.
- To retry a failed build without changing content, open **Netlify → Deploys**, select the failed deploy, and choose **Retry deploy**.

## Restore an earlier version after a mistake

The safest method is to create a new commit that reverses the mistake:

1. Open the repository on GitHub and choose **Commits**.
2. Find the last good commit and copy its short identifier.
3. In VS Code, update your local `master`, create a repair branch, and revert the bad commit:

```bash
git switch master
git pull --ff-only
git switch -c repair/restore-content
git revert BAD_COMMIT_ID
git push -u origin repair/restore-content
```

4. Open a pull request and review the Netlify preview before merging.

If several later commits are involved, stop and ask someone comfortable with Git to identify the exact range. Avoid `git reset --hard`; reverting keeps a recoverable history.

## Licence and attribution

This adaptation retains Beautiful Jekyll's original MIT `LICENSE` and a visible footer credit. See [NOTICE.md](NOTICE.md). Personal modification is permitted under that licence.
