const axios = require("axios");
module.exports = {
  config: {
    name: "geek",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Geek joke" },
    longDescription: { en: "Programming-related joke" },
    category: "fun",
    guide: { en: "+geek" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://geek-jokes.sameerkumar.website/api");
      message.reply(`👨‍💻 𝗚𝗲𝗲𝗸 𝗝𝗼𝗸𝗲:\n"${res.data}"`);
    } catch {
      message.reply("❌ 𝗘𝗿𝗿𝗼𝗿 𝗴𝗲𝘁𝘁𝗶𝗻𝗴 𝗴𝗲𝗲𝗸 𝗷𝗼𝗸𝗲.");
    }
  }
};
