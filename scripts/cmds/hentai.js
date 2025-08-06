const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const axios = require("axios");

module.exports = {
  config: {
    name: "hentai",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send safe cute anime illustration" },
    longDescription: { en: "Fetches safe (non-R18) anime images from lolicon API" },
    category: "fun",
    guide: { en: "+hentai" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.post("https://api.lolicon.app/setu/v2", {
        r18: 0,
        num: 1
      });

      if (!res.data || !res.data.data || res.data.data.length === 0) {
        return message.reply("❌ কোনো ছবি পাওয়া যায়নি।");
      }

      const imageUrl = res.data.data[0].urls.original || res.data.data[0].urls.regular;
      const filePath = path.join(__dirname, "cache/hentai.jpg");

      const file = fs.createWriteStream(filePath);
      https.get(imageUrl, resImg => {
        resImg.pipe(file);
        file.on("finish", () => {
          const caption = `
✨ 𝓒𝓾𝓽𝓮 𝓗𝓮𝓷𝓽𝓪𝓲 𝓑𝓪𝓫𝔂 ✨

🌸 𝐀𝐩𝐢 𝐂𝐫𝐞𝐝𝐢𝐭: 𝐂𝐡𝐢𝐭𝐫𝐨𝐧 𝐁𝐡𝐚𝐭𝐭𝐚𝐜𝐡𝐚𝐫𝐣𝐞𝐞
          `;
          message.reply({
            body: caption.trim(),
            attachment: fs.createReadStream(filePath)
          });
        });
      }).on("error", () => {
        message.reply("❌ ছবি ডাউনলোডে সমস্যা হয়েছে।");
      });

    } catch {
      message.reply("❌ ছবি আনতে সমস্যা হয়েছে।");
    }
  }
};
