const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sadcat",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate a sad cat meme"
    },
    description: {
      en: "Sends a sad cat meme image with your custom text"
    },
    category: "fun",
    guide: {
      en: "{p}sadcat <your text>\nExample: {p}sadcat I'm not ok"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide some text for the sad cat.",
      error: "❌ | Failed to generate sad cat meme. Try again later.",
      processing: "😿 | Generating your sad cat meme..."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    const text = encodeURIComponent(args.join(" "));
    message.reply(getLang("processing"));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/sadcat?text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `sadcat_${Date.now()}.jpg`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: `Here's your sad cat 😿`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
