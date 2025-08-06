const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "caution",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Create a caution style image with custom text"
    },
    description: {
      en: "Generates a caution style meme image using your text"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}caution <text>\nExample: {p}caution Be careful!"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide text for the caution image.",
      error: "❌ | Failed to generate caution image."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args.length) return message.reply(getLang("missing"));

    const text = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/caution?text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `caution_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "⚠️ Here's your caution image!",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
