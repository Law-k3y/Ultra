const axios = require("axios");

module.exports = {
  config: {
    name: "decode",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Decode binary text using PopCat API"
    },
    description: {
      en: "Decodes binary strings to text"
    },
    category: "utility",
    guide: {
      en: "{p}decode <binary>\nExample: {p}decode 0110100001100101"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide a binary string to decode.",
      error: "❌ | Failed to decode binary."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args.length) return message.reply(getLang("missing"));

    const binary = args.join("");

    // Optional: Validate binary input
    if (!/^[01]+$/.test(binary)) return message.reply("❌ | Input contains non-binary characters.");

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/decode?binary=${encodeURIComponent(binary)}`);
      if (!res.data || !res.data.result) return message.reply(getLang("error"));

      message.reply(`🔡 Decoded Text:\n${res.data.result}`);
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
