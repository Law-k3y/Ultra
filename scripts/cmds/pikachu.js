const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pikachu",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate a Pikachu image with custom text"
    },
    description: {
      en: "Creates a cute Pikachu image with the text you provide"
    },
    category: "fun",
    guide: {
      en: "{p}pikachu <text>\nExample: {p}pikachu hello"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide text to put on the Pikachu image.",
      error: "❌ | Failed to generate Pikachu image."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args.length) return message.reply(getLang("missing"));

    const text = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/pikachu?text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `pikachu_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: `⚡ Here's your Pikachu image!`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
