const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "maid",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send maid image" },
    longDescription: { en: "Sends a random anime maid" },
    category: "fun",
    guide: { en: "+maid" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://api.waifu.pics/sfw/maid";
    const filePath = path.join(__dirname, "cache/maid.jpg");

    https.get(imgUrl, res => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        const image = JSON.parse(data).url;
        const file = fs.createWriteStream(filePath);
        https.get(image, imgRes => {
          imgRes.pipe(file);
          file.on("finish", () => {
            message.reply({
              body: "🧹 𝗠𝗮𝗶𝗱 𝗠𝗼𝗼𝗱 𝗢𝗻!",
              attachment: fs.createReadStream(filePath)
            });
          });
        });
      });
    });
  }
};
