const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "webss",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Take screenshot of a website"
    },
    description: {
      en: "Returns a full page screenshot of any valid website URL"
    },
    category: "tools",
    guide: {
      en: "{p}webss <url>\nExample: {p}webss https://google.com"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide a valid URL.",
      error: "❌ | Couldn't fetch screenshot. Make sure the URL is valid.",
      downloading: "📸 | Taking screenshot of %1..."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    const url = args[0].startsWith("http") ? args[0] : `https://${args[0]}`;

    message.reply(getLang("downloading", url));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/screenshot?url=${encodeURIComponent(url)}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `webss_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: `✅ | Screenshot of:\n${url}`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (e) {
      console.error(e);
      message.reply(getLang("error"));
    }
  }
};
