const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "fox",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Fox pic" },
    longDescription: { en: "Random fox image" },
    category: "fun",
    guide: { en: "+fox" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://randomfox.ca/floof/");
      const img = res.data.image;
      const file = path.join(__dirname, "cache/fox.jpg");
      const f = fs.createWriteStream(file);

      https.get(img, (r) => {
        r.pipe(f);
        f.on("finish", () => {
          message.reply({
            body: "🦊 𝗥𝗮𝗻𝗱𝗼𝗺 𝗙𝗼𝘅:",
            attachment: fs.createReadStream(file)
          });
        });
      });
    } catch {
      message.reply("❌ 𝗖𝗮𝗻'𝘁 𝗴𝗲𝘁 𝗳𝗼𝘅.");
    }
  }
};
