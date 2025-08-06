const fs = require("fs-extra");
const path = require("path");

module.exports = {
 config: {
 name: "set",
 version: "1.3",
 author: "Chitron Bhattacharjee",
 countDown: 3,
 role: 2,
 shortDescription: { en: "🌟 Set command prefix mode" },
 longDescription: { en: "🌸 Toggle or reset prefix behavior for any command" },
 category: "🛠️ System",
 guide: {
 en: "✨ set <command> -npx\n✨ set <command> -bpx\n✨ set <command> -reset"
 },
 usePrefix: true,
 useChat: true
 },

 onStart: async function ({ args, message }) {
 if (args.length < 2) {
 return message.reply("🎀 𝒰𝓈𝒶𝑔𝑒:\n🪄 set <command> -npx\n🪄 set <command> -bpx\n🪄 set <command> -reset");
 }

 const cmdName = args[0];
 const filePath = path.join(__dirname, `${cmdName}.js`);

 if (!fs.existsSync(filePath)) {
 return message.reply(`❌ 𝒞𝑜𝓂𝓂𝒶𝓃𝒹 \`${cmdName}\` 𝓃𝑜𝓉 𝒻𝑜𝓊𝓃𝒹!`);
 }

 let content = await fs.readFile(filePath, "utf8");

 const ensureInjected = () => {
 const configMatch = content.match(/config\s*:\s*{([\s\S]*?)}/);
 if (!configMatch) return false;
 const configBlock = configMatch[0];
 let updatedBlock = configBlock;

 if (!/usePrefix\s*:\s*(true|false)/.test(updatedBlock)) {
 updatedBlock = updatedBlock.replace(/{/, `{\n usePrefix: true,`);
 }
 if (!/useChat\s*:\s*(true|false)/.test(updatedBlock)) {
 updatedBlock = updatedBlock.replace(/{/, `{\n useChat: true,`);
 }

 content = content.replace(configBlock, updatedBlock);
 return true;
 };

 const success = ensureInjected();
 if (!success) return message.reply("⚠️ Couldn't find valid config block to inject into.");

 // Apply changes based on args
 if (args.includes("-reset")) {
 content = content
 .replace(/usePrefix\s*:\s*(true|false)/, "usePrefix: true")
 .replace(/useChat\s*:\s*(true|false)/, "useChat: false");

 await fs.writeFile(filePath, content);
 return message.reply(`🔄 \`${cmdName}\` 𝓇𝑒𝓈𝑒𝓉 𝓉𝑜 𝓅𝓇𝑒𝒻𝒾𝓍 𝑜𝓃𝓁𝓎 𝓂𝑜𝒹𝑒 💡`);
 }

 // bpx overrides npx if both present
 if (args.includes("-bpx")) {
 content = content
 .replace(/usePrefix\s*:\s*(true|false)/, "usePrefix: true")
 .replace(/useChat\s*:\s*(true|false)/, "useChat: true");

 await fs.writeFile(filePath, content);
 return message.reply(
 `🌟 \`${cmdName}\` 𝓈𝑒𝓉 𝓉𝑜: Ｂｏｔｈ－Ｐｒｅｆｉｘ 🌟\n✨ 𝒞𝓊𝓉𝑒 𝓈𝓌𝒾𝓉𝒸𝒽 𝒶𝒸𝓉𝒾𝓋𝒶𝓉𝑒𝒹! 💖`
 );
 }

 if (args.includes("-npx")) {
 content = content
 .replace(/usePrefix\s*:\s*(true|false)/, "usePrefix: false")
 .replace(/useChat\s*:\s*(true|false)/, "useChat: true");

 await fs.writeFile(filePath, content);
 return message.reply(
 `🌙 \`${cmdName}\` 𝓈𝑒𝓉 𝓉𝑜: Ｎｏ－Ｐｒｅｆｉｘ 🌙\n🌸 𝒞𝒽𝒾𝓁𝓁 𝓋𝒾𝒷𝑒𝓈 𝑜𝓃𝓁𝓎 💫`
 );
 }

 return message.reply("⚠️ Invalid flags. Use `-npx`, `-bpx`, or `-reset`");
 },

 onChat: async function ({ event, message }) {
 const body = event.body?.trim();
 if (!body) return;

 const match = body.match(/^set\s+(\w+)\s+((?:-\w+\s*){1,3})$/i);
 if (match) {
 const cmd = match[1];
 const flags = match[2].trim().split(/\s+/);
 return this.onStart({ ...arguments[0], args: [cmd, ...flags], message });
 }
 }
};