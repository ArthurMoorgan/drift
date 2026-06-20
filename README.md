# Drift — a calm, private, beautiful web browser

Drift is a polished, liquid-glass desktop web browser built on **Electron** with a real **Chromium** engine. It pairs a warm, distraction-free design with genuinely useful privacy tools: built-in ad blocking, an encrypted password vault with autofill, and a private AI assistant that uses your own key.

![stack](https://img.shields.io/badge/Electron-Chromium-c2703d) ![style](https://img.shields.io/badge/design-liquid--glass-efe4cf) ![platform](https://img.shields.io/badge/platform-Windows-555) ![license](https://img.shields.io/badge/license-MIT-2faa5a)


# Here are a few screenshots from the browser:
The basic light theme:
<img width="1320" height="840" alt="newtab-light" src="https://github.com/user-attachments/assets/5cf55cb5-823f-48ba-8811-102247f34945" />
Appearance settings:
<img width="1320" height="840" alt="settings-appearance" src="https://github.com/user-attachments/assets/f4372a86-6d47-4d27-b7a5-4a3510fe52a9" />
Password manager:
<img width="1320" height="840" alt="passwords" src="https://github.com/user-attachments/assets/039d3163-fd3b-43c0-b93a-2b34b1af2b74" />
A few more themes (theres more to!):
<img width="1320" height="840" alt="newtab-midnight" src="https://github.com/user-attachments/assets/a3418792-b0c2-432d-a186-6ba0f059f531" />
<img width="1320" height="840" alt="newtab-noir" src="https://github.com/user-attachments/assets/b7e37288-167a-429e-ab1d-2fdd38edd710" />
Lightweight mode:
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/9b806937-c0d4-4014-bc3b-ea79df0544f6" />


---

## Run it from source

> Requires [Node.js](https://nodejs.org) (LTS) on **Windows**.

```powershell
git clone https://github.com/ArthurMoorgan/solace.git
cd solace
npm install      # installs Electron + deps, and fetches uBlock Origin
npm start
```

A frameless window opens with its own animated new-tab page. On first run you'll see a short setup tour.

> **Note on uBlock Origin:** it's GPL-licensed and is *not* stored in this repo. `npm install` downloads it automatically (see [`scripts/fetch-ublock.js`](scripts/fetch-ublock.js)). To fetch it manually at any time: `npm run fetch-ublock`.

---

## Build the Windows app

Packaging uses **electron-builder** (NSIS installer + single-file portable).

```powershell
npm run pack    # quick unpacked build  → dist/win-unpacked/
npm run dist    # installer + portable  → dist/
```

`npm run dist` auto-increments the patch version and ensures uBlock Origin is present, then produces:

- `Drift Setup <version>.exe` — the installer (upgrades in place, keeps user data)
- `Drift-<version>-portable.exe` — a single-file portable build

To rebrand the app icon, replace [`build/icon.svg`](build/icon.svg) and run `npm run make-icon`.

---

## Cream AI / Drift AI — bring your own key

The new-tab page has a built-in **Claude** assistant. Click **Ask Drift AI**, paste your Anthropic API key once, and chat — replies stream in token-by-token.

- **Your key stays private.** It's stored only in the app's user-data folder (`%APPDATA%/Drift`), and every API call runs in Electron's **main process**. The key is never exposed to any web page or renderer; the new-tab AI bridge is URL-locked and the main process re-validates the sender on every call.
- **Default model:** `claude-opus-4-8` (switchable to Sonnet / Haiku in Settings).
- **Get a key:** [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

---

## Keyboard shortcuts

Work even when a web page has focus (forwarded from the main process):

| Shortcut | Action | | Shortcut | Action |
|---|---|---|---|---|
| `Ctrl+T` | New tab | | `Ctrl+D` | Bookmark page |
| `Ctrl+W` | Close tab | | `Ctrl+H` | Toggle history |
| `Ctrl+L` | Focus address bar | | `Ctrl+1…9` | Jump to tab N |
| `Ctrl+R` / `F5` | Reload | | `Ctrl+Tab` | Next tab |
| `Alt+←` / `Alt+→` | Back / Forward | | `Ctrl+J` | Downloads |
| `Ctrl +` / `-` / `0` | Zoom in / out / reset | | | |

---

## How it works

- Each tab is an Electron `<webview>` with a real Chromium renderer; only the active one is shown.
- The chrome (tabs, toolbar, panels, settings) is plain **HTML/CSS/JS** styled as frosted glass — no framework.
- **Security model:** the Anthropic key and all AI calls live in the main process; the password vault is encrypted via `safeStorage`; sessions and windows are hardened (denied permission prompts, no shell navigation, popups routed to tabs); a CSP is applied to the chrome pages.
- Most UI state persists in `localStorage` (`cream.*` keys); the AI key, downloads, and passwords persist in the user-data folder; site logins persist via a named session partition.

## Project layout

```
solace/
├─ main.js              # main process: windows, AI, downloads, vault, autofill, ad-block
├─ preload.js           # secure bridge for the chrome window
├─ build/               # app icon (icon.svg → icon.png)
├─ scripts/             # icon render, version bump, uBlock fetch
└─ src/
   ├─ index.html        # browser chrome structure
   ├─ chrome.css        # the liquid-glass design system + all themes
   ├─ chrome.js         # tabs, omnibox, bookmarks, history, settings, passwords…
   ├─ newtab.html       # animated start page + Drift AI assistant
   ├─ newtab-preload.js # URL-guarded AI bridge + password autofill (isolated world)
   └─ backgrounds/      # flat-design SVG new-tab backgrounds
```

---

## License

[MIT](LICENSE) © Drift. Bundled uBlock Origin is © Raymond Hill and licensed separately under the GPLv3.

Built with the help of [Claude Code](https://claude.com/claude-code).
