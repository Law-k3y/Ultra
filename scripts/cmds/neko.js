const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "neko",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    role: 0,
    shortDescription: { en: "Send neko image" },
    longDescription: { en: "Sends a cute neko girl image" },
    category: "fun",
    guide: { en: "+neko" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://api.waifu.pics/sfw/neko";
    const filePath = path.join(__dirname, "cache/neko.jpg");

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
              body: "🐱 𝗡𝗲𝗸𝗼 𝗖𝗮𝘁𝗴𝗶𝗿𝗹 𝗔𝗹𝗲𝗿𝘁",
              attachment: fs.createReadStream(filePath)
            });
          });
        });
      });
    });
  }
};
