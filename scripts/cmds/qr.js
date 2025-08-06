const Jimp = require("jimp");
const QrCode = require("qrcode-reader");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
 config: {
 name: "qrscan",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 1,
 role: 0,
 shortDescription: {
 en: "Auto QR code scanner from images"
 },
 description: {
 en: "Scans every incoming image for QR codes and replies only if found"
 },
 category: "tools",
 guide: {
 en: "Just send an image with QR in group. Bot will auto-detect it!"
 }
 },

 onChat: async function ({ event, message, api }) {
 const { attachments } = event;
 if (!attachments || attachments.length === 0) return;

 const image = attachments.find(att => att.type === "photo");
 if (!image || !image.url) return;

 const imgUrl = image.url;
 const imgPath = path.join(__dirname, "cache", `qrscan_${Date.now()}.jpg`);

 try {
 await downloadImage(imgUrl, imgPath);
 const jimpImage = await Jimp.read(fs.readFileSync(imgPath));
 const qr = new QrCode();

 const result = await new Promise((resolve, reject) => {
 qr.callback = (err, v) => {
 if (err || !v) return resolve(null);
 resolve(v.result);
 };
 qr.decode(jimpImage.bitmap);
 });

 await fs.unlink(imgPath); // Cleanup

 if (result) {
 return message.reply(`✅ 𝗤𝗥 𝗖𝗼𝗱𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱:\n${result}`);
 }
 } catch (err) {
 // silent error
 }
 },

 onStart: async function () {} // Dummy required for install
};

// Download helper
function downloadImage(url, dest) {
 return new Promise((resolve, reject) => {
 const file = fs.createWriteStream(dest);
 https.get(url, res => {
 res.pipe(file);
 file.on("finish", () => file.close(resolve));
 }).on("error", err => {
 fs.unlink(dest, () => reject(err));
 });
 });
}