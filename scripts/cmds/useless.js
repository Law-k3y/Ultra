const axios = require("axios");
module.exports = {
  config: {
    name: "useless",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Useless fact" },
    longDescription: { en: "Get a random useless fact" },
    category: "fun",
    guide: { en: "+useless" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
      const fact = res.data.text;
      message.reply(`🧠 𝗙𝗮𝗰𝘁:\n${fact}`);
    } catch {
      message.reply("❌ 𝗖𝗼𝘂𝗹𝗱𝗻'𝘁 𝗹𝗼𝗮𝗱 𝗳𝗮𝗰𝘁.");
    }
  }
};
