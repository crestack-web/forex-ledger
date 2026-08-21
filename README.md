# Ledger — Forex Trading Journal

A clean, production-ready personal forex trading journal.  
One line per trade, the reason it was taken, and the proof. No noise — just the record.

**Live app:** open `index.html` locally, or enable [GitHub Pages](https://pages.github.com/) on this repo (Settings → Pages → Deploy from branch `main` / root).

## Features

- **Trade log** — pair, long/short, entry/exit, SL/TP, lots, pips, P&L
- **Auto-calc** — pips and dollar P&L from entry/exit (editable)
- **Context** — strategy, session, timeframe, emotion, risk %
- **Reason + notes** — thesis and lessons for future-you
- **Screenshots** — attach chart / execution images
- **List & calendar** views with win/loss filters
- **Account stats** — net P&L, growth %, win rate, best/worst, avg R
- **Dark / light** theme
- **100% client-side** — data stays in your browser (localStorage)

## Quick start

1. Open [index.html](./index.html) in Chrome, Firefox, or Edge  
2. Click **Set balance** (stats strip) to enter your starting equity  
3. Hit **+ Log trade** and start recording

No install, no account, no server.

## Data & privacy

All trades and settings are stored in **browser localStorage** only.  
Nothing is sent to a server. Export is not built-in yet — for backup, use browser DevTools → Application → Local Storage, or ask for an export feature.

## Tech

- Single HTML file (CSS + JS inlined)
- Fonts: Fraunces, Inter, IBM Plex Mono (Google Fonts)
- No build step, no dependencies beyond fonts

## License

Personal use. Do what you want with it.

## Alpha Vantage (optional quotes)

1. Get a free key at https://www.alphavantage.co/support/#api-key
2. **Local / GitHub Pages:** Sessions → paste key (stored in browser only)
3. **Vercel (recommended):**  
   - Deploy this repo to Vercel  
   - Project → Settings → Environment Variables → `ALPHA_VANTAGE_API` = your key  
   - Quotes go through `/api/fx` so the key never ships to the browser  

Free tier is rate-limited (~25 requests/day). Prefer 1–2 watchlist pairs.
