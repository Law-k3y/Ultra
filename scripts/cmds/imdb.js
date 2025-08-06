const axios = require("axios");

module.exports = {
  config: {
    name: "imdb",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Search for a movie/show info from IMDb"
    },
    description: {
      en: "Get detailed info like rating, genre, cast, and plot from IMDb"
    },
    category: "entertainment",
    guide: {
      en: "{p}imdb <movie or series name>\nExample: {p}imdb iron man"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide a movie or show name.",
      error: "❌ | Couldn't fetch IMDb data. Try a valid title.",
      result: `🎬 Title: %1\n⭐ Rating: %2/10\n📅 Released: %3\n🎭 Genre: %4\n🎬 Director: %5\n👥 Actors: %6\n📖 Plot: %7\n🌍 Country: %8\n📺 Type: %9\n🔗 URL: %10`
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    const query = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/imdb?q=${query}`);
      const d = res.data;

      const msg = getLang("result",
        d.title || "N/A",
        d.rating || "N/A",
        d.released || "N/A",
        d.genre || "N/A",
        d.director || "N/A",
        d.actors || "N/A",
        d.plot || "N/A",
        d.country || "N/A",
        d.type || "N/A",
        d.imdb_url || "N/A"
      );

      message.reply({
        body: msg,
        attachment: d.poster ? await global.utils.getStreamFromURL(d.poster) : undefined
      });

    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
