const axios = require("axios");
module.exports = {
  config: {
    name: "zen",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Zen quote" },
    longDescription: { en: "Inspirational Zen quote" },
    category: "fun",
    guide: { en: "+zen" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://zenquotes.io/api/random");
      const quote = res.data[0].q;
      message.reply(`🧘 𝗭𝗲𝗻 𝗾𝘂𝗼𝘁𝗲:\n"${quote}"`);
    } catch {
      message.reply("❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗾𝘂𝗼𝘁𝗲.");
    }
  }
};
