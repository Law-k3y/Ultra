const axios = require("axios");

module.exports = {
  config: {
    name: "element",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get information about a periodic table element"
    },
    description: {
      en: "Fetches detailed information about a chemical element from Popcat API"
    },
    category: "education",
    guide: {
      en: "{p}element <name or symbol>\nExample: {p}element bohrium\nExample: {p}element Bh"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide an element name or symbol!",
      notFound: "❌ | No element found with that name or symbol.",
      result: "🧪 | Element Info:\n\n🔹 Name: %1\n🔹 Symbol: %2\n🔹 Atomic Number: %3\n🔹 Atomic Mass: %4\n🔹 Appearance: %5\n🔹 Category: %6\n🔹 Discovered By: %7\n🔹 Phase: %8\n🔹 Summary: %9"
    }
  },

  onStart: async function ({ api, args, message, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    const element = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/periodic-table?element=${element}`);
      const data = res.data;

      const replyText = getLang("result", data.name, data.symbol, data.atomic_number, data.atomic_mass, data.appearance || "N/A", data.category, data.discovered_by || "Unknown", data.phase, data.summary);
      message.reply(replyText);
    } catch (err) {
      return message.reply(getLang("notFound"));
    }
  }
};
