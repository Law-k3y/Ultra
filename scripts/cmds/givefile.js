const fs = require('fs');

module.exports = {
 config: {
 name: "givefile",
 aliases: ["file"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 description: "extract file",
 category: "owner",
 guide: "{pn} Write a file name"
 },

 onStart: async function ({ message, args, api, event }) {
 const permission = ["100081330372098"];
 if (!permission.includes(event.senderID)) {
 return api.sendMessage("⩸__ ✨🦋 𝒀𝒐𝒖 𝒅𝒂𝒓𝒆 𝒕𝒐 𝒖𝒔𝒆 𝒕𝒉𝒊𝒔 𝒔𝒂𝒄𝒓𝒆𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅!? 💥\n\n⚠️ 𝒪𝓃𝓁𝓎 𝒕𝒉𝒆 𝒎𝒚𝒕𝒉, 𝒕𝒉𝒆 𝒍𝒆𝒈𝒆𝒏𝒅 — 🧧 𝓒𝓱𝓲𝓽𝓻𝓸𝓷 𝓑𝓱𝓪𝓽𝓽𝓪𝓬𝓱𝓪𝓻𝓳𝓮𝓮 🧧 — 𝒉𝒐𝒍𝒅𝒔 𝒕𝒉𝒆 𝒌𝒆𝒚 𝒕𝒐 𝒖𝒏𝒍𝒆𝒂𝒔𝒉 𝒕𝒉𝒊𝒔 𝒑𝒐𝒘𝒆𝒓~! 🗝️\n\n💢 𝒔𝒕𝒂𝒏𝒅 𝒅𝒐𝒘𝒏, 𝒎𝒐𝒓𝒕𝒂𝒍... 𝒐𝒓 𝒇𝒂𝒄𝒆 𝒕𝒉𝒆 𝒄𝒖𝒓𝒔𝒆 𝒐𝒇 𝒕𝒉𝒆 𝒇𝒐𝒓𝒃𝒊𝒅𝒅𝒆𝒏 𝒇𝒊𝒍𝒆 💀", event.threadID, event.messageID);

 }

 const fileName = args[0];
 if (!fileName) {
 return api.sendMessage("🔰 provide a file name!", event.threadID, event.messageID);
 }

 const filePath = __dirname + `/${fileName}.js`;
 if (!fs.existsSync(filePath)) {
 return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
 }

 const fileContent = fs.readFileSync(filePath, 'utf8');
 api.sendMessage({ body: fileContent }, event.threadID);
 }
};
