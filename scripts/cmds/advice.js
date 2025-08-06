const axios = require("axios");
module.exports = {
  config: {
    name: "advice",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random advice" },
    longDescription: { en: "Get a random piece of advice" },
    category: "fun",
    guide: { en: "+advice" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://api.adviceslip.com/advice");
      const advice = res.data.slip.advice;
      message.reply(`💡 𝗔𝗱𝘃𝗶𝗰𝗲:\n"${advice}"`);
    } catch {
      message.reply("❌ 𝗖𝗮𝗻'𝘁 𝗳𝗲𝘁𝗰𝗵 𝗮𝗱𝘃𝗶𝗰𝗲.");
    }
  }
};
