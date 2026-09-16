# 🎮 RankPulse — Valorant Live Rank Tracker \& Stream Overlay

RankPulse is a highly polished, interactive stream overlay and local dashboard built specifically for Valorant streamers, content creators, and competitive players. It allows you to display your live rank, Rank Rating (RR), and real-time MMR progression directly on stream using custom HUD themes, smooth motion animations, and premium visual feedback.

The application connects to the official-grade **HenrikDEV Valorant API** to retrieve exact, live matchmaking statistics and is fully responsive, optimized, and ready for integration directly into OBS Studio, Streamlabs, or any web browser!

\---

## ✨ Features

* **🏆 7 Premium OBS Themes \& Skins**:

  * **Champions (Official Style)**: The legendary black-and-gold aesthetic inspired by Valorant Champions, featuring rotating geometric shapes.
  * **VCT 2021**: An upgraded tribute to the Champions 2021 art style with an interactive HTML Canvas rendering solid, floating gold-shard particles.
  * **Radiant Glass**: A modern, glossy glassmorphic design featuring glowing accents and smooth visual backdrops.
  * **Compact Pill**: A minimalist, low-profile pill design that takes up minimal stream real estate.
  * **Esports HUD**: A clean, sharp, broadcast-style visual bar inspired by official VCT tournament match streams.
  * **Minimalist Strip**: A ultra-clean layout highlighting only the core rank icon, rank title, and rating.
  * **Classic Box**: The classic, trusted card layout featuring full stat displays.
* **⚡ Interactive Stream HUD Controls**:

  * Live preview with toggleable backgrounds (Transparent, Dark, Green Screen, and In-Game Mockup).
  * Customizable presentation toggles (Show Player Name, Show Total RR, Show Rank Icon, and custom Scale controls).
  * Adjustable **Backdrop Darkness** slider which dynamically scales alpha transparency on themes like *VCT 2021* or *Radiant Glass*.
* **⚡ Real-time HenrikDEV API Synchronization**:

  * Effortless setup using Player Name, Tag, and Region selection.
  * Graceful error reporting to prevent truncation and ellipsis overflows.
  * Automatic API rate-limiting handling and fallback caching mechanisms.
* **🚀 One-Click OBS Integration**:

  * Features an intuitive, interactive installation guide specifically designed for OBS Studio browser sources.
  * Ready-to-copy browser-source links.
* **💎 Dynamic Celebrations**:

  * Dynamic in-HUD overlays and smooth keyframe animations that react seamlessly to rank updates.

\---

## 🛠️ Tech Stack

* **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (High-performance Client-Side Single Page Application)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Motion / Framer Motion](https://motion.dev/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Canvas Rendering**: HTML5 Canvas API for real-time metallic gold crystal shards in the VCT 2021 theme.
* **Hosting-Ready**: Pre-configured configuration profiles for modern static CDN providers.

\---

## ⚡ Local Development

Get the application up and running locally in seconds:

1. **Clone the repository and install dependencies**:

```bash
   npm install
   ```

2. **Launch the development server**:

```bash
   npm run dev
   ```

   *The application will boot and bind to `http://localhost:3000`.*

3. **Production build and compilation**:

```bash
   npm run build
   ```

   *Compiles a fully-optimized, static SPA bundle inside the `/dist` directory.*

\---

## 🚀 Easy Hosting \& Cloud Deployment

RankPulse is configured to run flawlessly on static hosting providers like **Netlify**, **Vercel**, or **Cloudflare Pages** right out of the box!

### Netlify Compatibility Included:

* **`public/\_redirects`**: Embedded fallback rule prevents broken URLs or 404 errors when deep pages are refreshed.
* **`netlify.toml`**: Standardized Netlify build pipeline instructions, path routing, and advanced `Cache-Control` header settings to ensure ultra-fast load times.



