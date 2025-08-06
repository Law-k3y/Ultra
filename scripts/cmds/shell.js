const { exec } = require('child_process');

module.exports = {
 config: {
 name: "shell",
 aliases: ["sh"], 
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 2,
 shortDescription: "Execute shell commands",
 longDescription: "",
 category: "owner",
 guide: {
 en: "{p}{n} <command>" // Removed Vietnamese guide for simplicity
 }
 },

 onStart: async function ({ args, message, event, api }) {
 const command = args.join(" ");
 
 if (!command) {
 return message.reply("Please provide a command to execute.");
 }

 exec(command, (error, stdout, stderr) => {
 if (error) {
 console.error(`Error executing command: ${error}`);
 return message.reply(`An error occurred while executing the command: ${error.message}`);
 }

 if (stderr) {
 console.error(`Command execution resulted in an error: ${stderr}`);
 return message.reply(`Command execution resulted in an error: ${stderr}`);
 }

 console.log(`Command executed successfully:\n${stdout}`);
 message.reply(`Command executed successfully:\n${stdout}`);
 });
 }
};