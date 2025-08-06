const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "setu",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "NSFW/SFW anime image by tag"
    },
    longDescription: {
      en: "Get anime/hentai (R18 or SFW) images by tag from the Lolicon API"
    },
    category: "media",
    guide: {
      en: "+setu list\n+setu sex\n+setu hentai -5"
    }
  },

  onStart: async function ({ message, args, event }) {
    const input = args.join(" ").toLowerCase();

    // +setu list
    if (input === "list") {
      const sfw = [
        "maid", "waifu", "blonde_hair", "white_hair", "school_uniform", "loli", "cute", "cosplay", "idol"
      ];
      const nsfw = [
        "hentai", "sex", "boobs", "nude", "cum", "yuri", "futa", "anal", "r18"
      ];

      let txt = "🗂️ 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗧𝗮𝗴𝘀:\n\n";
      txt += "🔵 𝗦𝗙𝗪:\n" + sfw.map(t => `• ${t}`).join("\n") + "\n\n";
      txt += "🔴 𝗡𝗦𝗙𝗪:\n" + nsfw.map(t => `• ${t}`).join("\n");

      return message.reply(txt);
    }

    if (!input) return message.reply("❗ Example: +setu sex or +setu loli -5");

    // Parse tag and number
    const tagMatch = input.match(/^(.+?)(?:\s*-([1-9]|10|15|20))?$/);
    if (!tagMatch) return message.reply("⚠️ Invalid format. Try +setu hentai -5");

    const tag = tagMatch[1];
    const num = tagMatch[2] ? parseInt(tagMatch[2]) : 1;

    const url = `https://api.lolicon.app/setu/v2?r18=1&tag=${encodeURIComponent(tag)}&num=${num}`;

    try {
      const res = await axios.get(url);
      const data = res.data.data;

      if (!data.length) return message.reply(`❌ No results found for tag: ${tag}`);

      for (const img of data) {
        const imgURL = img.urls.original;
        const filename = path.join(__dirname, "cache", `setu-${Date.now()}.jpg`);

        await downloadImage(imgURL, filename);
        await message.reply({
          body: `✨ ${img.title}\n👤 ${img.author}\n🔗 Pixiv ID: ${img.pid}`,
          attachment: fs.createReadStream(filename)
        });
        fs.unlinkSync(filename);
      }

    } catch (err) {
      console.error(err);
      return message.reply("🚫 API error or tag failed.");
    }
  }
};

// Image download helper
async function downloadImage(url, dest) {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}
