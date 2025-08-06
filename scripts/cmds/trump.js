const axios = require("axios");
module.exports = {
  config: {
    name: "trump",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Trump quote" },
    longDescription: { en: "Get a random Trump quote" },
    category: "fun",
    guide: { en: "+trump" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://api.tronalddump.io/random/quote");
      const quote = res.data.value;
      message.reply(`🇺🇸 𝗧𝗿𝘂𝗺𝗽 𝘀𝗮𝗶𝗱:\n"${quote}"`);
    } catch {
      message.reply("❌ 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗾𝘂𝗼𝘁𝗲.");
    }
  }
};
