# HE CHENGHAO · Portfolio

An immersive portfolio built with React, Three.js, and Vite. An original MacBook Air sits on a pure black background. Projects, profile, honors, and contact details live inside its monochrome desktop. The entire website is in English.

Live website: [skillbom.com](https://skillbom.com/) ([www.skillbom.com](https://www.skillbom.com/)). Hosted on Vercel; [ho2006-portfolio.vercel.app](https://ho2006-portfolio.vercel.app/) remains available as a backup URL.

CSS3DRenderer projects the live React interface onto the laptop display, keeping text, buttons, search, and scrolling attached to the 3D model.

## Run locally

Requires Node.js 22.12+ or 20.19+.

```powershell
npm ci
npm run dev
```

Drag the background to rotate, use the wheel to zoom, and click the display to enter. Keyboard users can Tab to the laptop and press Enter; arrow keys rotate or zoom, and Home resets the view. Press Escape or the screen's Back menu to return.

The desktop includes Home, About, Projects, Honors, and Contact. Windows can be dragged, maximized, minimized, and restored. Project search and category filters stay available inside the screen.

Phones open directly in a flat version of the same monochrome desktop, with readable text and window scrolling. Desktop browsers retain the 3D laptop. There is no manual mode button or navigation outside the computer. Small viewports up to 680 px, and touch viewports up to 1024 px, use the mobile layout.

```powershell
npm test
npm run build
npm run preview
```

## Edit content

- `src/data/profile.js`: name, biography, school, public email, and English project summaries.
- `profile.honors`: verified honors as `{ year, title, issuer, description, url }`. Currently empty because no awards have been supplied.
- `src/data/github.json`: public original repository snapshot fetched on 2026-10-12. Private, forked, archived, and empty repositories are excluded.

Refresh public data with:

```powershell
npm run sync:github
```

Sync handles pagination, validates data, and retains the previous snapshot on failure. Set `GITHUB_TOKEN` locally only if needed for API rate limits. Never use `VITE_GITHUB_TOKEN` or commit a token. The website reads the snapshot without contacting the GitHub API. Add an English summary for any new repository whose original description is Chinese; until then, it displays a generic English GitHub link description.

## Deploy to Vercel

`vercel.json` is configured. No backend, database, or production environment variables are needed.

```powershell
npx vercel login
npx vercel --prod --yes
```

Alternatively, push to your GitHub repository and import it through Vercel's **Add New → Project**. Choose **Vite**, build command `npm run build`, and output directory `dist`.

## Sources and visual direction

The owner supplied the name and undergraduate status. Project facts and statistics come from [GitHub @ho2006](https://github.com/ho2006) and public READMEs. StableFlow and TradeGraph Lab retain their unfinished research status.

The opening and screen interaction in the [reference video](https://www.bilibili.com/video/BV18U36eQEyU/) informed the black scene, centered computer, zoom into its display, and monochrome windows. The hardware remains the original MacBook Air requested by the owner. The model and interface were implemented here without copying the video's source, assets, or personal content.

The silver wedge and black keyboard reference [Apple's 2008 announcement](https://www.apple.com/hk/en/newsroom/2008/01/15Apple-Introduces-MacBook-Air-The-Worlds-Thinnest-Notebook/). This is a stylized model with a 16:10 display. The interface follows the video's classic monochrome Mac style.

The site uses system monospace fonts and a GitHub avatar. If WebGL is unavailable or its context is lost, a static laptop frame preserves access to the screen content. Keyboard entry, Escape, focus restoration, and reduced motion are supported.

CSS3DRenderer assumes 100% browser zoom. Additional projection calibration for other zoom levels has not been implemented.

## Validation

Five Node.js tests cover public repository filtering, English display content, search, sync validation, model structure, and camera framing in landscape and portrait. The production build passes.

Physical mobile devices still need testing. Three.js is loaded separately on demand, around 135 KB compressed; its uncompressed chunk exceeds Vite's default 500 KB warning threshold.
