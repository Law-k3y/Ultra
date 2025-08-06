const axios = require("axios");

module.exports = {
  config: {
    name: "npm",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get npm package info"
    },
    description: {
      en: "Fetches npm package information from PopCat API"
    },
    category: "info",
    guide: {
      en: "{p}npm <package name>\nExample: {p}npm popcat-wrapper"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide an npm package name.",
      notFound: "❌ | Package not found or invalid package name.",
      result: `📦 Package: %1\n📌 Version: %2\n📝 Description: %3\n👤 Author: %4\n📃 License: %5\n🔗 Homepage: %6`
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    const pkg = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/npm?q=${pkg}`);
      const data = res.data;

      if (!data || !data.name) return message.reply(getLang("notFound"));

      const reply = getLang("result",
        data.name,
        data.version || "N/A",
        data.description || "N/A",
        (data.author && data.author.name) || "N/A",
        data.license || "N/A",
        data.homepage || "N/A"
      );

      message.reply(reply);
    } catch (err) {
      console.error(err);
      message.reply(getLang("notFound"));
    }
  }
};
