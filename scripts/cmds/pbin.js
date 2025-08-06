const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
 config: {
 name: "pbin",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 10,
 role: 2,
 shortDescription: { en: "Create paste on Pistebin" },
 description: {
 en: "Paste given text or content from a file to pistebin and get a sharable link"
 },
 category: "tools",
 guide: {
 en: "{p}pbin <text | [password]>\n{p}pbin <filename.js>\n{p}pbin hello world | pass123"
 }
 },

 onStart: async function ({ api, args, message, event }) {
 const { threadID } = event;

 if (!args[0]) {
 return message.reply(
 "📋 Please provide content or filename to paste.\n\nExample:\n+pbin Hello World!\n+pbin test.js | mypass"
 );
 }

 const input = args.join(" ");
 let content = input;
 let password = null;

 // Split for password
 if (input.includes(" | ")) {
 const parts = input.split(" | ");
 content = parts[0].trim();
 password = parts[1]?.trim();
 } else if (input.includes("--password")) {
 const parts = input.split("--password");
 content = parts[0].trim();
 password = parts[1]?.trim();
 }

 // If content is a filename
 if (content.endsWith(".js") && !content.includes(" ") && !content.includes("\n")) {
 const filePath = path.join(__dirname, content);
 try {
 if (fs.existsSync(filePath)) {
 content = fs.readFileSync(filePath, "utf8");
 } else {
 return message.reply(`❌ File "${content}" not found in the command folder.`);
 }
 } catch (err) {
 return message.reply(`❌ Error reading file: ${err.message}`);
 }
 }

 try {
 const apiKey = "e1e79284eb39d2c9d1042af8b52cd10e0a6e5b5da49312b5";
 const baseUrl = "https://pistebin.vercel.app";

 const headers = {
 "X-API-Key": apiKey,
 "Content-Type": "application/json"
 };

 const body = { content };
 if (password) body.password = password;

 const res = await axios.post(`${baseUrl}/api/save`, body, { headers });

 if (res.status === 200) {
 const result = res.data;
 const pasteUrl = `${baseUrl}${result.url}`;
 let finalMsg = `✅ Paste created!\n🔗 ${pasteUrl}`;
 if (password) finalMsg += `\n🔒 Password protected`;

 return message.reply(finalMsg);
 } else {
 return message.reply(`❌ Paste failed: ${res.status} ${res.statusText}`);
 }
 } catch (err) {
 const errorText = err.response
 ? `${err.response.status} - ${err.response.statusText}`
 : err.message;
 return message.reply(`❌ Error creating paste: ${errorText}`);
 }
 }
};