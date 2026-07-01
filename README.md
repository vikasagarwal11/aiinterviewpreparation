# Athena — Final Deployable Build

Athena is a privacy-safe AI interview-preparation site for senior TPM / AI product leadership preparation.

## Files in this package

- `index.html`
- `robots.txt`
- `README.md`
- `CHANGELOG.md`
- `assets/styles.css`
- `assets/script.js`

## Deploy to GitHub + Render

1. Unzip this package.
2. In your GitHub repo root, replace:
   - `index.html`
   - `README.md`
   - `CHANGELOG.md`
   - `robots.txt`
3. Replace or create the `assets/` folder with:
   - `assets/styles.css`
   - `assets/script.js`
4. Delete old root-level files if present:
   - `styles.css`
   - `script.js`
5. Commit and push to `main`.
6. Render should redeploy automatically.
7. After deploy, open the Render URL and test:
   - Click a concept button.
   - Open F12 console.
   - Confirm there are no red JavaScript errors.

## Privacy warning

This build includes `noindex` and `robots.txt`, but that is not true access control.
If the content is genuinely private, use Render auth/password protection, a private repo, or take the service offline.
