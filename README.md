
<h1 align="center">
  🧠✨ ShiPu AI — Cyberpunk Messenger Bot
</h1>

<p align="center">
  <img src="https://media.tenor.com/VWl-ZPKT0LQAAAAC/cyberpunk-robot.gif" width="100%" alt="ShiPu AI Banner" />
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/brandchitron/shipuaibot?color=blue" /></a>
  <img src="https://img.shields.io/badge/Node.js-v18+-green" />
  <img src="https://img.shields.io/badge/MongoDB-Supported-brightgreen" />
  <img src="https://img.shields.io/badge/Built%20By-Chitron%20Bhattacharjee-blueviolet" />
</p>

---

> 🧩 **ShiPu AI** is a futuristic, modular, and highly customized Messenger automation + chatbot system based on NTkhang's GoatBot V2 — but **rewritten**, **refactored**, and **reborn** with AI brains, cyberpunk visuals, and MongoDB support.

---

## ⚠️ Disclaimer

> This is **not the official version** of GoatBot by NTkhang.  
> It is a **heavily modified** fork maintained independently by **Chitron Bhattacharjee**, with deep changes to command logic, memory system, UI/UX, and AI functionality.  
> All credits to the original GoatBot base go to [NTkhang](https://github.com/ntkhang03/goatbot-v2).

---

## 💡 Features at a Glance

<table>
<tr>
<td align="center">
<img src="https://media.tenor.com/xGJzOtgytvQAAAAd/robot-brain-ai.gif" width="100%" />
<h3>🧠 AI Brain</h3>
<p>Natural memory & conversation via OpenAI, Cohere, DeepSeek, and more.</p>
</td>
<td align="center">
<img src="https://media.tenor.com/64MzKwNcdXkAAAAd/robot-cyberpunk.gif" width="100%" />
<h3>🛠️ Modular System</h3>
<p>Over 100 commands in clean, separate files for max customization.</p>
</td>
<td align="center">
<img src="https://media.tenor.com/KU2I__HvJf0AAAAd/cyberpunk.gif" width="100%" />
<h3>📈 Group Analytics</h3>
<p>Live ranks, balances, user stats, session memory, and admin logs.</p>
</td>
</tr>
</table>

---

## 🚀 Quick Start

```bash
git clone https://github.com/brandchitron/shipuaibot.git
cd shipuaibot
npm install
```

### 🔧 Setup

1. Add your **Facebook cookies** to `account.dev.txt` (JSON format)
2. Update `.env` with:
   - `MONGO_URI` for memory
   - API keys (optional for AI commands)
3. Start the bot:

```bash
node index.js
```

---

## 🧠 Core Features

<details>
<summary>✨ Open List</summary>

- 🤖 AI Chatbot (with permanent memory + fallback logic)
- 🗣️ Bothprefix/no-prefix command detection
- 🧩 120+ modular commands (rank, giftall, shipu2, spy, post, setrank, job, etc.)
- 🧍 Session-based AI Chat (`shipu2`)
- 📁 MongoDB integration (for memory, sessions, balance, etc.)
- 📸 Canvas, avatar, fakechat, sticker, image generation
- 💸 Currency system (bal, giftall, setexp, etc.)
- 📊 Activity stats, ranks, reaction logs, profile analytics
- 📜 Powerful admin commands: approve, rules, set, ban
- 🎨 Stylish ASCII, emoji, and cyberpunk formatting in all messages
- 🖼️ Image preview, thumbnails, and media handling (TTS, Video, etc.)

</details>

---

## 🧬 Advanced Tech Stack

| Feature | Tech |
|--------|------|
| Runtime | `Node.js` 18+ |
| Database | `MongoDB` |
| APIs Used | OpenAI, Cohere, TTSMP3, DeepSeek |
| Messenger | Facebook (cookie-based session) |
| Hosting Ready | ✅ Render, Railway, VPS |

---

## 📦 Deploy on Render

> 1-Click to deploy on Render.com (supports free tier)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/brandchitron/shipuaibot)

---

## 👨‍💻 Maintainer

**👤 Chitron Bhattacharjee**  
🔗 [Facebook Profile](https://facebook.com/adirexcb)  
📧 chitronbhattacharjee@gmail.com  
🌐 [My Dev Commands Collection (coming soon)](https://github.com/brandchitron)

---

## 🧾 Credits

| Source | Credit |
|--------|--------|
| 🐐 Base Bot | [GoatBot by NTkhang](https://github.com/ntkhang03/goatbot-v2) |
| ✨ Fork + Refactor | Chitron Bhattacharjee |
| 🎨 Style + Canvas | Custom rewritten by Chitron |
| 🤖 AI Brain | OpenAI, Cohere, Shipu APIs |

---

## 📄 License

MIT License © 2025  
See [LICENSE](./LICENSE)

---

## 🤝 Contribute

Pull requests, bug reports, and ideas are welcome!

- Fork this repo
- Add your module to `/scripts/cmds/`
- Test and PR
- Let's build the ultimate AI bot together 💪

---

> 💖 **ShiPu AI: More than a bot. A stylish, cyberpunk AI friend.**  
> — _Chitron Bhattacharjee_
