const os = require("os");

module.exports = {
 config: {
 name: "chkrun",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Check where your bot is running from"
 },
 description: {
 en: "Shows host, runtime, platform, and deployment name if available"
 },
 category: "system",
 guide: {
 en: "{p}chkrun"
 }
 },

 onStart: async function ({ api, event }) {
 const hostname = os.hostname();
 const platform = os.platform();
 const uptime = os.uptime();
 const cpuModel = os.cpus()[0].model;
 const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0) + " MB";
 const arch = os.arch();

 // Detect host environment
 let deployName = "🖥️ Localhost";
 if (process.env.RENDER === "true") deployName = "🚀 Render";
 else if (process.env.REPL_ID) deployName = "⚙️ Replit";
 else if (process.env.PROJECT_DOMAIN) deployName = `🌐 Glitch (${process.env.PROJECT_DOMAIN})`;
 else if (hostname.includes("railway")) deployName = "🚄 Railway";
 else if (hostname.includes("fly")) deployName = "🪰 Fly.io";

 const msg = `
╔══════════════╗
 🧠 𝙱𝙾𝚃 𝚁𝚄𝙽 𝙲𝙷𝙴𝙲𝙺 
╚══════════════╝
📦 Hostname: ${hostname}
🛠️ Platform: ${platform} (${arch})
📈 CPU: ${cpuModel}
💾 RAM: ${totalMem}
⏱️ Uptime: ${Math.floor(uptime / 60)} min
📍 Deployment: ${deployName}
`;

 api.sendMessage(msg, event.threadID, event.messageID);
 }
};