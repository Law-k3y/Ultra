const axios = require("axios");
module.exports = {
  config: {
    name: "quote",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Famous quote" },
    longDescription: { en: "Get a random quote from QuoteGarden" },
    category: "fun",
    guide: { en: "+quote" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://quote-garden.onrender.com/api/v3/quotes/random");
      const quote = res.data.data[0].quoteText;
      message.reply(`📜 𝗤𝘂𝗼𝘁𝗲:\n"${quote}"`);
    } catch {
      message.reply("❌ 𝗖𝗮𝗻'𝘁 𝗴𝗲𝘁 𝗾𝘂𝗼𝘁𝗲.");
    }
  }
};
