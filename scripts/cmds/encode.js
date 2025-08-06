const axios = require("axios");

module.exports = {
  config: {
    name: "encode",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Encode text using PopCat API"
    },
    description: {
      en: "Encodes the given text and returns the encoded result"
    },
    category: "utility",
    guide: {
      en: "{p}encode <text>\nExample: {p}encode hello"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide text to encode.",
      error: "❌ | Failed to encode text."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args.length) return message.reply(getLang("missing"));

    const text = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/encode?text=${text}`);
      if (!res.data || !res.data.result) return message.reply(getLang("error"));

      message.reply(`📝 Encoded Text:\n${res.data.result}`);
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
