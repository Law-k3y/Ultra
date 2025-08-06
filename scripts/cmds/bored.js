const axios = require("axios");
module.exports = {
  config: {
    name: "bored",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random activity idea" },
    longDescription: { en: "Get a random activity when bored" },
    category: "fun",
    guide: { en: "+bored" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://www.boredapi.com/api/activity");
      const act = res.data.activity;
      message.reply(`🎯 𝗔𝗰𝘁𝗶𝘃𝗶𝘁𝘆:\n"${act}"`);
    } catch {
      message.reply("❌ 𝗖𝗼𝘂𝗹𝗱𝗻'𝘁 𝗴𝗲𝘁 𝗮𝗰𝘁𝗶𝘃𝗶𝘁𝘆.");
    }
  }
};
