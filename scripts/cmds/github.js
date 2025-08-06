const axios = require("axios");

module.exports = {
  config: {
    name: "github",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get GitHub user profile info"
    },
    description: {
      en: "Fetch GitHub user profile details using username"
    },
    category: "info",
    guide: {
      en: "{p}github <username>\nExample: {p}github brandchitron"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide a GitHub username.",
      notFound: "❌ | GitHub user not found.",
      result: `🐙 GitHub Profile Info:\n\n👤 Name: %1\n📛 Login: %2\n📄 Bio: %3\n🏢 Company: %4\n🌍 Location: %5\n🔗 URL: %6\n📅 Created at: %7\n📦 Public Repos: %8\n👥 Followers: %9\n➡️ Following: %10`
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    const username = args[0];

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/github/${encodeURIComponent(username)}`);
      const data = res.data;

      if (!data || data.message === "Not Found") return message.reply(getLang("notFound"));

      const reply = getLang("result",
        data.name || "N/A",
        data.login || "N/A",
        data.bio || "N/A",
        data.company || "N/A",
        data.location || "N/A",
        data.html_url || "N/A",
        data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A",
        data.public_repos || 0,
        data.followers || 0,
        data.following || 0
      );

      message.reply(reply);
    } catch (error) {
      console.error(error);
      message.reply(getLang("notFound"));
    }
  }
};
