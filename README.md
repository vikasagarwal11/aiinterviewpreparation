# Athena v2 — Merged Learning Site

This package merges the strongest parts of:

1. The original Athena website prototype.
2. The next-level static site version.
3. The richer private interview-prep version with decision frameworks, system design, story scaffolds, and localStorage notes.

## What is included

- `index.html`
- `assets/styles.css`
- `assets/script.js`
- `README.md`
- `CHANGELOG.md`

## What changed in v2

- Added the Athena Method section.
- Preserved the richer Concept Map / Concept Explorer.
- Preserved decision frameworks.
- Preserved Program / TPM layer.
- Preserved System Design framework.
- Preserved Story Scaffold with saved local browser answers.
- Added Project Lens for MedicalDiary, AetherSignal, and Corporate Safety Intake.
- Added a Next Build Roadmap.
- Added a stronger “Why this matters” block in Episode 1.
- Kept the richer `assets/` structure from the more advanced version.

## How to deploy to GitHub + Render

Replace the files in the root of your GitHub repo with these files:

```text
index.html
assets/styles.css
assets/script.js
README.md
CHANGELOG.md
```

Important: if your current repo has `styles.css` and `script.js` at the root from the old version, you can delete them after moving to this version because this version uses:

```html
<link rel="stylesheet" href="assets/styles.css" />
<script src="assets/script.js"></script>
```

Then commit to `main`. Render should redeploy automatically.

## Recommended next step

After deploying this v2, the next improvement should be splitting the site into multiple lesson pages:

- `/lessons/chatgpt-request-lifecycle.html`
- `/lessons/cursor-codebase-context.html`
- `/lessons/medicaldiary-ai-system.html`
- `/lessons/aethersignal-regulated-ai.html`
- `/interviews/index.html`
- `/frameworks/index.html`

That will make Athena feel like a real learning platform instead of a single-page prototype.
