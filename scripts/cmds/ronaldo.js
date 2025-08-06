const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
 config: {
 name: "ronaldo",
 aliases: ["cr7"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "send you pic of ronaldo"
 },
 longDescription: {
 en: "Sends both image and URL of a random Cristiano Ronaldo photo"
 },
 category: "football",
 guide: {
 en: "{pn}"
 }
 },

 onStart: async function ({ message }) {
 try {
 const links = [
 "https://i.imgur.com/gwAuLMT.jpg",
 "https://i.imgur.com/MuuhaJ4.jpg",
 "https://i.imgur.com/6t0R8fs.jpg",
 "https://i.imgur.com/7RTC4W5.jpg",
 "https://i.imgur.com/VTi2dTP.jpg",
 "https://i.imgur.com/gdXJaK9.jpg",
 "https://i.imgur.com/VqZp7IU.jpg",
 "https://i.imgur.com/9pio8Lb.jpg",
 "https://i.imgur.com/iw714Ym.jpg",
 "https://i.imgur.com/zFbcrjs.jpg",
 "https://i.imgur.com/e0td0K9.jpg",
 "https://i.imgur.com/gsJWOmA.jpg",
 "https://i.imgur.com/lU8CaT0.jpg",
 "https://i.imgur.com/mmZXEYl.jpg",
 "https://i.imgur.com/d2Ot9pW.jpg",
 "https://i.imgur.com/iJ1ZGwZ.jpg",
 "https://i.imgur.com/isqQhNQ.jpg",
 "https://i.imgur.com/GoKEy4g.jpg",
 "https://i.imgur.com/TjxTUsl.jpg",
 "https://i.imgur.com/VwPPL03.jpg",
 "https://i.imgur.com/45zAhI7.jpg",
 "https://i.imgur.com/n3agkNi.jpg",
 "https://i.imgur.com/F2mynhI.jpg",
 "https://i.imgur.com/XekHaDO.jpg"
 ];

 const randomLink = links[Math.floor(Math.random() * links.length)];
 const imgName = `ronaldo_${path.basename(randomLink)}`;
 const cacheDir = path.join(__dirname, "cache");
 const imgPath = path.join(cacheDir, imgName);

 fs.ensureDirSync(cacheDir);

 if (!fs.existsSync(imgPath)) {
 await new Promise((resolve, reject) => {
 https.get(randomLink, (res) => {
 const stream = fs.createWriteStream(imgPath);
 res.pipe(stream);
 stream.on("finish", () => {
 stream.close(resolve);
 });
 }).on("error", (err) => {
 if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
 reject(err);
 });
 });
 }

 return message.reply({
 body: `「 Here Comes The GOAT 🐐 」\nImage URL: ${randomLink}`,
 attachment: fs.createReadStream(imgPath)
 });

 } catch (error) {
 console.error("Error sending Ronaldo image:", error);
 return message.reply("❌ Couldn't send Ronaldo image right now. Please try again later.");
 }
 }
};