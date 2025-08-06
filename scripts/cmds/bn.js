module.exports = {
 config: {
 name: "bn",
 version: "1.0.3",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 vi: "Dịch văn bản",
 en: "Text translation"
 },
 longDescription: {
 vi: "Dịch văn bản sang ngôn ngữ chỉ định (mặc định là tiếng Bengali)",
 en: "Translate text to specified language (defaults to Bengali)"
 },
 category: "utility",
 guide: {
 vi: "[bn/ar/en/vi/hi] [văn bản] hoặc reply tin nhắn với [bn/ar/en/vi/hi]",
 en: "[bn/ar/en/vi/hi] [text] or reply to message with [bn/ar/en/vi/hi]"
 }
 },

 langs: {
 vi: {
 missingInput: "Vui lòng nhập văn bản cần dịch hoặc reply tin nhắn",
 error: "Đã xảy ra lỗi khi dịch",
 invalidLang: "Ngôn ngữ đích không hợp lệ"
 },
 en: {
 missingInput: "Please enter text to translate or reply to a message",
 error: "An error occurred while translating",
 invalidLang: "Invalid target language"
 }
 },

 onStart: async function ({ api, event, args, message, getLang }) {
 try {
 // Check if axios is available (preferred over request)
 let axios;
 try {
 axios = require("axios");
 } catch {
 // Fallback to request if axios not available
 const request = global.nodemodule["request"];
 if (!request) {
 return message.reply(getLang("error") + " (No request module found)");
 }
 }

 let content = args.join(" ");
 
 // Handle case when no input and no message reply
 if (content.length === 0 && event.type !== "message_reply") {
 return message.reply(getLang("missingInput"));
 }

 let translateThis, lang = "bn"; // Default to Bengali

 if (event.type === "message_reply") {
 // If replying to a message
 translateThis = event.messageReply.body;
 
 // Check if language is specified
 if (content.length > 0) {
 lang = content.trim();
 }
 } else {
 // If not replying to a message
 // Check if language is specified with ->
 const langSeparatorIndex = content.indexOf("->");
 if (langSeparatorIndex !== -1) {
 translateThis = content.slice(0, langSeparatorIndex).trim();
 lang = content.slice(langSeparatorIndex + 2).trim();
 } else {
 translateThis = content;
 }
 }

 // Validate language code (2 characters only)
 if (lang.length !== 2) {
 return message.reply(getLang("invalidLang"));
 }

 // Encode the text for URL
 const encodedText = encodeURIComponent(translateThis);
 
 // Translation API URL
 const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodedText}`;

 if (axios) {
 // Use axios if available
 const response = await axios.get(apiUrl);
 const data = response.data;
 
 let translatedText = '';
 data[0].forEach(item => {
 if (item[0]) {
 translatedText += item[0];
 }
 });
 
 return message.reply(translatedText);
 } else {
 // Fallback to request
 return new Promise((resolve, reject) => {
 global.nodemodule["request"](apiUrl, (err, response, body) => {
 if (err) {
 return reject(err);
 }
 
 try {
 const data = JSON.parse(body);
 let translatedText = '';
 data[0].forEach(item => {
 if (item[0]) {
 translatedText += item[0];
 }
 });
 
 resolve(message.reply(translatedText));
 } catch (e) {
 reject(e);
 }
 });
 });
 }
 } catch (err) {
 console.error(err);
 return message.reply(getLang("error"));
 }
 }
};