const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

module.exports = {
 config: {
 name: "rbg",
 aliases: ["removebg", "rmvbg"],
 version: "2.1",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Remove background from image or video"
 },
 longDescription: {
 en: "Removes background from image using proxy and video using Unscreen"
 },
 category: "image",
 guide: {
 en: "+rbg → image bg remove\n+rbg vid → video bg remove"
 }
 },

 onStart: async function ({ message, api, args, event }) {
 const isVideo = args[0] === "vid";
 const unscreenApiKey = "DnFcWMu9WavCVoNgg7BQDWqc";
 const proxyHost = "xyz"; // Replace if different
 let url = "";

 if (event.messageReply?.attachments?.[0]?.url) {
 url = event.messageReply.attachments[0].url;
 } else if (args[1]?.startsWith("http")) {
 url = args[1];
 } else {
 return message.reply(`❌ Please reply to a ${isVideo ? "video" : "image"} or provide a valid link.`);
 }

 // 🌀 React & Notify
 api.setMessageReaction("⏳", event.messageID, () => {}, true);
 message.reply(`🎬 Removing ${isVideo ? "video" : "image"} background, please wait...`, async (err, info) => {
 try {
 if (isVideo) {
 // --- 🔹 Unscreen Video API flow ---
 const form = new FormData();
 form.append("video_url", url);

 const uploadRes = await axios.post("https://api.unscreen.com/v1.0/videos", form, {
 headers: {
 ...form.getHeaders(),
 "X-Api-Key": unscreenApiKey
 }
 });

 const videoId = uploadRes.data.id;
 const pollingUrl = `https://api.unscreen.com/v1.0/videos/${videoId}`;
 let downloadUrl = null;

 // ⏳ Polling until complete
 for (let i = 0; i < 10; i++) {
 const poll = await axios.get(pollingUrl, {
 headers: { "X-Api-Key": unscreenApiKey }
 });

 if (poll.data.status === "done") {
 downloadUrl = poll.data.video.url;
 break;
 }
 await new Promise(r => setTimeout(r, 3000)); // wait 3s
 }

 if (!downloadUrl) throw new Error("Unscreen failed to complete in time.");

 const filePath = path.join(__dirname, "cache", `${videoId}.mp4`);
 const file = await axios.get(downloadUrl, { responseType: "arraybuffer" });
 fs.writeFileSync(filePath, file.data);

 await message.reply({
 body: "✅ Video background removed!\nAPI Owner: Chitron Bhattacharjee",
 attachment: fs.createReadStream(filePath)
 });

 fs.unlinkSync(filePath);
 } else {
 // --- 🔹 Proxy Image API ---
 const encoded = encodeURIComponent(url);
 const proxyUrl = `https://smfahim.${proxyHost}/rbg?url=${encoded}`;
 const imageStream = await global.utils.getStreamFromURL(proxyUrl);

 await message.reply({
 body: "✅ Image background removed!\nAPI Owner: Chitron Bhattacharjee",
 attachment: imageStream
 });
 }

 if (info?.messageID) message.unsend(info.messageID);
 api.setMessageReaction("✅", event.messageID, () => {}, true);
 } catch (e) {
 console.error("❌ RBG ERROR:", e?.response?.data || e.message || e);
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 message.reply(`❌ Failed to remove background.\nReason: ${e.message || "Unknown error"}`);
 }
 });
 }
};