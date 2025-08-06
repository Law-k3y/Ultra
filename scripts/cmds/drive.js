const axios = require('axios');

module.exports = {
 config: {
 name: "drive",
 version: "0.0.1",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 description: "Upload videos to Google Drive easily!",
 category: "Utility",
 guide: "Use: {pn} <link> to upload a video from a link\nOr reply to a video/message with media to upload"
 },

 onStart: async function ({ message, event, args }) {
 const inputUrl = event?.messageReply?.attachments?.[0]?.url || args[0];

 if (!inputUrl)
 return message.reply("Please provide a valid video URL or reply to a media message.");

 try {
 const noobx = "ArYAN";
 const apiURL = `https://aryan-xyz-google-drive.vercel.app/drive?url=${encodeURIComponent(inputUrl)}&apikey=${noobx}`;
 const res = await axios.get(apiURL);

 const data = res.data || {};
 console.log("API response data:", data);

 const driveLink = data.driveLink || data.driveLIink;

 if (driveLink) {
 const successMsg = `✅ File uploaded to Google Drive!\n\n🔗 URL: ${driveLink}`;
 return message.reply(successMsg);
 }

 const errorMsg = data.error || JSON.stringify(data) || "Failed to upload the file.";
 return message.reply(`Upload failed: ${errorMsg}`);
 } catch (error) {
 console.error("Upload Error:", error);
 return message.reply("An error occurred during upload. Please try again.");
 }
 }
};