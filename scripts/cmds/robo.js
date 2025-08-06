const https = require("https");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "robo",
    version: "1.0",
    author: "Chitron Bhattacharjee",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Robo avatar" },
    longDescription: { en: "Avatar generated from text" },
    category: "fun",
    guide: { en: "+robo Chitron" }
  },

  onStart: async function({ message, args }) {
    const text = args.join(" ") || "guest";
    const url = `https://robohash.org/${encodeURIComponent(text)}`;
    const file = path.join(__dirname, "cache/robo.jpg");
    const f = fs.createWriteStream(file);

    https.get(url, (r) => {
      r.pipe(f);
      f.on("finish", () => {
        message.reply({
          body: "🤖 𝗬𝗼𝘂𝗿 𝗥𝗼𝗯𝗼 𝗔𝘃𝗮𝘁𝗮𝗿:",
          attachment: fs.createReadStream(file)
        });
      });
    });
  }
};
