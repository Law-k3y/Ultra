const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs-extra");

module.exports = {
 config: {
 name: "cutout",
 aliases: ["cutbg"],
 version: "1.1",
 role: 0,
 author: "Chitron Bhattacharjee",
 category: "utility",
 cooldowns: 5,
 countDown: 5,
 guide: {
 en: "cutout [reply to image or provide image URL] - remove background using Cutout Pro API"
 }
 },
 
 onStart: async ({ api, event, args }) => {
 try {
 let imageUrl;
 
 // Case 1: User replied to an image
 if (event.messageReply && event.messageReply.attachments[0]?.type === "photo") {
 imageUrl = event.messageReply.attachments[0].url;
 } 
 // Case 2: User provided URL as argument
 else if (args[0] && args[0].match(/^https?:\/\/.+\.(jpe?g|png|gif|bmp)$/i)) {
 imageUrl = args[0];
 } 
 // No valid image source found
 else {
 return api.sendMessage("⚠️ Please reply to an image or provide an image URL to remove background.", event.threadID);
 }

 // Download the image
 const imageResponse = await axios.get(imageUrl, { 
 responseType: "arraybuffer",
 headers: {
 "DNT": 1,
 "Accept-Language": "en-US,en;q=0.9"
 }
 });
 
 // Prepare form data
 const formData = new FormData();
 formData.append("file", imageResponse.data, {
 filename: "image.jpg",
 contentType: "image/jpeg"
 });
 
 // Call Cutout Pro API
 const response = await axios({
 method: "post",
 url: "https://www.cutout.pro/api/v1/matting?mattingType=6",
 data: formData,
 headers: {
 "APIKEY": "db95b47632c54582b5bb24271de428bc",
 ...formData.getHeaders()
 },
 responseType: "stream",
 timeout: 30000
 });
 
 // Send result
 api.sendMessage({
 body: "✅ Background removed successfully!",
 attachment: response.data
 }, event.threadID, event.messageID);
 
 } catch (e) {
 console.error("Cutout Pro Error:", e);
 let errorMessage = "⚠️ An error occurred while processing the image.";
 
 if (e.response?.status === 429) {
 errorMessage = "⚠️ API rate limit exceeded. Please try again later.";
 } else if (e.code === "ECONNABORTED") {
 errorMessage = "⚠️ The request took too long. Please try again with a smaller image.";
 }
 
 api.sendMessage(errorMessage, event.threadID);
 }
 }
};
