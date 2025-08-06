const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "mock",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate mocking text meme image"
    },
    description: {
      en: "Creates a mocking text meme image with the text you provide"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}mock <text>\nExample: {p}mock hello"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide text to mock.",
      error: "❌ | Failed to generate mocking meme."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args.length) return message.reply(getLang("missing"));

    const text = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/mock?text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `mock_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: `🤡 Here's your mocking meme!`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
