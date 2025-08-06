const math = require("mathjs");

module.exports = {
 config: {
 name: "calc",
 version: "2.1",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Scientific calculator with step-by-step solution"
 },
 description: {
 en: "Evaluate math expressions with scientific functions and show step-by-step results"
 },
 category: "tools",
 guide: {
 en: "+calc [expression]\nSupports: +, -, *, /, %, ^, sqrt(), sin(), cos(), log(), etc.\nExample: +calc sin(30 deg) + sqrt(16)"
 }
 },

 onStart: async function ({ message, args }) {
 const expression = args.join(" ");
 if (!expression)
 return message.reply("❌ Please provide a math expression.\n📌 Example: `+calc sin(30 deg) + sqrt(16)`");

 try {
 const steps = [];
 const scope = {};
 const simplified = math.simplify(expression, scope);
 const finalResult = simplified.evaluate(scope);

 steps.push("📐 𝗠𝗔𝗧𝗛 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗢𝗥");
 steps.push("━━━━━━━━━━━━━━━━━━━━");
 steps.push(`📥 Expression:\n➤ ${expression}`);

 if (simplified.toString() !== expression) {
 steps.push(`🧮 Simplified:\n➤ ${simplified.toString()}`);
 }

 steps.push(`✅ Result:\n➤ ${finalResult}`);
 steps.push("━━━━━━━━━━━━━━━━━━━━");
 steps.push("🤖 Powered by Shipu Ai");

 message.reply(steps.join("\n\n"));
 } catch (err) {
 message.reply("❌ Invalid expression. Please check your syntax or use supported math functions.");
 }
 }
};