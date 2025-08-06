const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
 config: {
 name: "lens",
 version: "1.0",
 author: "Chitron Bhattacharjee", // Modified from your concept
 description: "Generate Google Lens search links",
 category: "utility",
 guide: {
 en: "Reply to an image with '+lens'"
 }
 },

 onStart: async function ({ api, event }) {
 // Empty onStart since we're using onReply
 },

 onReply: async function ({ api, event, Reply, args }) {
 if (event.type !== "message_reply" || !event.messageReply.attachments?.[0]?.type === "photo") {
 return api.sendMessage("❌ Please reply to an image with '+lens'", event.threadID);
 }

 try {
 const imageUrl = event.messageReply.attachments[0].url;
 const encodedUrl = encodeURIComponent(imageUrl);
 const lensUrl = `https://lens.google.com/uploadbyurl?url=${encodedUrl}`;
 
 await api.sendMessage({
 body: `🔍 Google Lens Search:\n${lensUrl}\n\nClick the link to search this image on Google Lens`,
 attachment: await global.utils.getStreamFromUrl(imageUrl) // Include original image
 }, event.threadID);

 } catch (error) {
 console.error("Lens Error:", error);
 api.sendMessage("⚠️ Failed to generate Lens link. The image might be too large.", event.threadID);
 }
 },

 onChat: async function ({ api, event, args }) {
 if (event.body?.toLowerCase().trim() === "+lens") {
 this.onReply({ api, event, Reply: this, args });
 }
 }
};