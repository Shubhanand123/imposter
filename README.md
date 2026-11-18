# Imposter

A pass-and-play party game for one phone. Everyone gets the secret word except the imposter. Give one-word clues, vote, and see if the crew catches them.

- **Home:** pick a word pack (7 built-in packs, shuffle, or a mix), set the rules (hint, last-chance guess, clue timer, vote on phones or out loud).
- **Round:** deal secret cards (press and hold to reveal), clue timer, secret voting, reveal, last-chance guess, results with scores.
- **After a round:** Continue (keep scores), New game, or Main menu.

It is a single static page (`index.html`) with no build step. React, Framer Motion and GSAP load from a CDN.

Install it: open the site on your phone and choose "Add to Home Screen" (iPhone: Share menu; Android: the browser menu or the install prompt). It then opens full screen and works offline.

AI-written word packs (type any theme) only work when the page runs inside claude.ai; elsewhere the built-in packs are used.

Illustrations: [Open Peeps](https://www.openpeeps.com/) by Pablo Stanley (MIT). Crowd motion based on Skiper 39 by Skiper UI.

## Playing on several phones

Choose **Host a room** on one phone. Everyone else opens the link, scans the QR, or picks **Join a room** and types the 4-letter code. Phones connect directly, so it works on the same Wi-Fi, on the host's mobile hotspot, or from anywhere online. Each phone shows only its own card and vote.

## AI word packs on the public site

Typing a theme asks Claude Haiku for a pack through `api/pack.js`. Add an `ANTHROPIC_API_KEY` environment variable to the Vercel project (Settings → Environment Variables), then redeploy. Without it, the site says AI packs aren't switched on and the built-in packs still work.
