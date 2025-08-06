module.exports = {
 config: {
 name: "cmdstore",
 aliases: ["store", "market", "commandstore"],
 version: "1.1",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Get ShiPu AI command store link"
 },
 description: {
 en: "Anime-style links to ShiPu AI free commands"
 },
 category: "info",
 guide: {
 en: "{pn} or type 'cmdstore' in chat"
 }
 },

 onStart: async function ({ message }) {
 const replies = [
`🌸✨ 𝒮𝒽𝒾𝒫𝓊 𝒜𝐼 𝒞𝑜𝓂𝓂𝒶𝓃𝒹 𝒮𝓉𝑜𝓇𝑒 ✨🌸

🛒 𝓥𝓲𝓼𝓲𝓽 𝓽𝓱𝓮 𝓶𝓪𝓰𝓲𝓬 𝓶𝓪𝓻𝓴𝓮𝓽: 
💠 http://lume.cooo.in/

📜 𝓖𝓮𝓽 𝓪𝓵𝓵 𝓕𝓡𝓔𝓔 𝓬𝓸𝓶𝓶𝓪𝓷𝓭𝓼 𝓸𝓯 𝓢𝓱𝓲𝓟𝓾 𝓐𝓘 𝓫𝓸𝓽 💖`,

`🌸 𝗦𝗵𝗶𝗣𝘂 𝗔𝗜 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗦𝘁𝗼𝗿𝗲 🌸

✨ 𝗙𝗿𝗲𝗲 𝗚𝗼𝗮𝘁𝗕𝗼𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗳𝗶𝗹𝗲𝘀, 𝗺𝗼𝗱𝘀 & 𝘁𝗼𝗼𝗹𝘀 
🔗 𝗩𝗶𝘀𝗶𝘁: http://lume.cooo.in/

💖 𝗡𝗼 𝗽𝗮𝘆𝗺𝗲𝗻𝘁, 𝗷𝘂𝘀𝘁 𝗺𝗮𝗴𝗶𝗰 & 𝗰𝗼𝗱𝗲! ✨`
 ];
 return message.reply(replies[Math.floor(Math.random() * replies.length)]);
 },

 onChat: async function ({ message, event }) {
 const triggerWords = ["cmdstore", "store", "market", "commandstore"];
 if (triggerWords.includes(event.body?.toLowerCase())) {
 const replies = [
`🌸✨ 𝒮𝒽𝒾𝒫𝓊 𝒜𝐼 𝒞𝑜𝓂𝓂𝒶𝓃𝒹 𝒮𝓉𝑜𝓇𝑒 ✨🌸

🛒 𝓥𝓲𝓼𝓲𝓽 𝓽𝓱𝓮 𝓶𝓪𝓰𝓲𝓬 𝓶𝓪𝓻𝓴𝓮𝓽: 
💠 http://lume.cooo.in/

📜 𝓖𝓮𝓽 𝓪𝓵𝓵 𝓕𝓡𝓔𝓔 𝓬𝓸𝓶𝓶𝓪𝓷𝓭𝓼 𝓸𝓯 𝓢𝓱𝓲𝓟𝓾 𝓐𝓘 𝓫𝓸𝓽 💖`,

`🌸 𝗦𝗵𝗶𝗣𝘂 𝗔𝗜 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗦𝘁𝗼𝗿𝗲 🌸

✨ 𝗙𝗿𝗲𝗲 𝗚𝗼𝗮𝘁𝗕𝗼𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗳𝗶𝗹𝗲𝘀, 𝗺𝗼𝗱𝘀 & 𝘁𝗼𝗼𝗹𝘀 
🔗 𝗩𝗶𝘀𝗶𝘁: http://lume.cooo.in/

💖 𝗡𝗼 𝗽𝗮𝘆𝗺𝗲𝗻𝘁, 𝗷𝘂𝘀𝘁 𝗺𝗮𝗴𝗶𝗰 & 𝗰𝗼𝗱𝗲! ✨`
 ];
 return message.reply(replies[Math.floor(Math.random() * replies.length)]);
 }
 }
};