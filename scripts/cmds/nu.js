const axios = require("axios");

module.exports = {
 config: {
 name: "nuresult",
 aliases: ["nu"],
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 0,
 role: 0,
 shortDescription: "Check NU admission result",
 longDescription: "Check National University admission test result by roll number",
 category: "education",
 guide: "{pn} [admissionRoll]\n\nExample: {pn} 7056346"
 },

 onStart: async function ({ message, args, api, event }) {
 const roll = args[0];
 if (!roll || isNaN(roll)) {
 return message.reply("❌ Please provide a valid admission roll number.\nExample: +nu 7056346");
 }

 try {

 api.setMessageReaction("⏳", event.messageID, () => {}, true);

 const response = await axios.post("http://app5.nu.edu.bd/nu-web/fetchAdmissionTestResultInformation", 
 `admissionRoll=${roll}`,
 {
 headers: {
 "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
 "Accept": "text/plain, */*; q=0.01",
 "X-Requested-With": "XMLHttpRequest"
 }
 }
 );

 const html = response.data;

 const extract = (label) => {
 const match = html.match(new RegExp(`<font[^>]*>${label}<\/font>\\s*(.*?)<\/div>`));
 return match ? match[1].trim() : "N/A";
 };

 const result = {
 applicationId: extract("Application ID :"),
 rollNo: extract("Admission Test Roll No :"),
 name: extract("Applicant Name :"),
 result: extract("Result :")
 };

 api.setMessageReaction("✅", event.messageID, () => {}, true);

 const msg = `🎓 NU Admission Result\n\n📄 Application ID: ${result.applicationId}\n🎫 Roll No: ${result.rollNo}\n👤 Name: ${result.name}\n📌 Result: ${result.result}`;
 message.reply(msg);

 } catch (err) {
 console.error(err);
 message.reply("❌ Failed to fetch result. Please try again later or check the roll number.");
 }
 }
};