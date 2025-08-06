const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "shibe",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Shibe pic" },
    longDescription: { en: "Random shiba dog image" },
    category: "fun",
    guide: { en: "+shibe" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("http://shibe.online/api/shibes?count=1");
      const img = res.data[0];
      const file = path.join(__dirname, "cache/shibe.jpg");
      const f = fs.createWriteStream(file);

      https.get(img, (r) => {
        r.pipe(f);
        f.on("finish", () => {
          message.reply({
            body: "🐕 𝗖𝘂𝘁𝗲 𝗦𝗵𝗶𝗯𝗲:",
            attachment: fs.createReadStream(file)
          });
        });
      });
    } catch {
      message.reply("❌ 𝗦𝗵𝗶𝗯𝗲 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.");
    }
  }
};
