const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "yesno",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Yes/No/Maybe GIF" },
    longDescription: { en: "Returns a random Yes/No/Maybe GIF" },
    category: "fun",
    guide: { en: "+yesno" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://yesno.wtf/api");
      const img = res.data.image;
      const file = path.join(__dirname, "cache/yesno.gif");
      const f = fs.createWriteStream(file);

      https.get(img, (r) => {
        r.pipe(f);
        f.on("finish", () => {
          message.reply({
            body: "🤖 𝗬𝗲𝘀/𝗡𝗼/𝗠𝗮𝘆𝗯𝗲:",
            attachment: fs.createReadStream(file)
          });
        });
      });
    } catch {
      message.reply("❌ 𝗘𝗿𝗿𝗼𝗿 𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗚𝗜𝗙.");
    }
  }
};
