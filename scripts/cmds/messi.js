module.exports = {
 config: {
 name: "messi",
 aliases: ["lm10"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Send a random photo of Messi"
 },
 longDescription: {
 en: "Sends both image and URL of a random Lionel Messi photo"
 },
 category: "football",
 guide: {
 en: "{pn}"
 }
 },

 onStart: async function ({ message }) {
 try {
 const fs = require("fs-extra");
 const path = require("path");
 const https = require("https");
 
 const links = [
 "https://i.imgur.com/ahKcoO3.jpg",
 "https://i.imgur.com/Vsf4rM3.jpg",
 "https://i.imgur.com/ximEjww.jpg",
 "https://i.imgur.com/ukYhm0D.jpg",
 "https://i.imgur.com/Poice6v.jpg",
 "https://i.imgur.com/5yMvy5Z.jpg",
 "https://i.imgur.com/ndyprcd.jpg",
 "https://i.imgur.com/Pm2gC6I.jpg",
 "https://i.imgur.com/wxxHuAG.jpg",
 "https://i.imgur.com/GwOCq59.jpg"
 ];

 const randomLink = links[Math.floor(Math.random() * links.length)];
 const imgName = `messi_${randomLink.split('/').pop()}`;
 const imgPath = path.join(__dirname, "cache", imgName);

 if (!fs.existsSync(imgPath)) {
 await new Promise((resolve, reject) => {
 https.get(randomLink, (res) => {
 const fileStream = fs.createWriteStream(imgPath);
 res.pipe(fileStream);
 fileStream.on("finish", () => {
 fileStream.close();
 resolve();
 });
 }).on("error", (err) => {
 fs.unlinkSync(imgPath);
 reject(err);
 });
 });
 }

 message.reply({
 body: `「 The GOAT has arrived 🐐 」\nImage URL: ${randomLink}`,
 attachment: fs.createReadStream(imgPath)
 });

 } catch (error) {
 console.error("Error sending Messi image:", error);
 message.send("Sorry, couldn't send the Messi image right now. Try again later!");
 }
 }
};