const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "wf",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send waifu image" },
    longDescription: { en: "Sends a random anime waifu photo" },
    category: "fun",
    guide: { en: "+waifu" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://api.waifu.pics/sfw/waifu";
    const filePath = path.join(__dirname, "cache/waifu.jpg");

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
              body: "💘 𝗬𝗼𝘂𝗿 𝗔𝗻𝗶𝗺𝗲 𝗪𝗮𝗶𝗳𝘂",
              attachment: fs.createReadStream(filePath)
            });
          });
        });
      });
    });
  }
};
