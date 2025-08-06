const axios = require("axios");
module.exports = {
  config: {
    name: "forismatic",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Philosophical quote" },
    longDescription: { en: "Get a philosophical quote from Forismatic" },
    category: "fun",
    guide: { en: "+forismatic" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en");
      const quote = res.data.quoteText;
      const author = res.data.quoteAuthor || "Unknown";
      message.reply(`🧠 𝗤𝘂𝗼𝘁𝗲:\n"${quote}"\n— *${author}*`);
    } catch {
      message.reply("❌ 𝗙𝗶𝗹𝗼𝘀𝗼𝗽𝗵𝗶𝗰 𝗾𝘂𝗼𝘁𝗲 𝗳𝗮𝗶𝗹𝗲𝗱.");
    }
  }
};
