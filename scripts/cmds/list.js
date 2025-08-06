const { commands, aliases } = global.GoatBot;

module.exports = {
 config: {
 name: "list",
 version: "3.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Show all commands or details"
 },
 longDescription: {
 en: "Type 'list' to view all categorized commands\nType 'list <command>' to view details"
 },
 category: "info",
 guide: {
 en: "list\nlist <command>"
 },
 usePrefix: true,
 useChat: true
 },

 langs: {
 en: {
 header: "🌸✨ 𝓗𝓮𝓵𝓹 𝓜𝓮𝓷𝓾 𝓫𝔂 𝓒𝓱𝓲𝓽𝓻𝓸𝓷 🌸✨",
 categoryNoPrefix: "🌼 𝙉𝙤 𝙋𝙧𝙚𝙛𝙞𝙭 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨 🌼",
 categoryPrefixOnly: "🌸 𝙊𝙣𝙡𝙮 𝙋𝙧𝙚𝙛𝙞𝙭 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨 🌸",
 empty: "❌ 𝙉𝙤 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨 𝙞𝙣 𝙩𝙝𝙞𝙨 𝙘𝙖𝙩𝙚𝙜𝙤𝙧𝙮 ❌",
 footer: "\n🌟 𝓣𝔂𝓹𝓮 𝓵𝓲𝓼𝓽 𝓬𝓸𝓶𝓶𝓪𝓷𝓭 𝓷𝓪𝓶𝓮 𝓯𝓸𝓻 𝓭𝓮𝓽𝓪𝓲𝓵𝓼 💖 𝓚𝓪𝔀𝓪𝓲𝓲!",
 notFound: "❌ 𝓒𝓸𝓶𝓶𝓪𝓷𝓭 '%1' 𝓷𝓸𝓽 𝓯𝓸𝓾𝓷𝓭! ❌",
 detailTitle: "🌟 𝓓𝓮𝓽𝓪𝓲𝓵𝓼 𝓸𝓯 𝓬𝓸𝓶𝓶𝓪𝓷𝓭 '%1' 🌟",
 name: "🧸 𝙉𝙖𝙢𝙚: %1",
 aliases: "🌻 𝘼𝙡𝙞𝙖𝙨𝙚𝙨: %1",
 description: "🌸 𝘿𝙚𝙨𝙘𝙧𝙞𝙥𝙩𝙞𝙤𝙣: %1",
 role: "🔐 𝙍𝙤𝙡𝙚 𝙍𝙚𝙦𝙪𝙞𝙧𝙚𝙙: %1",
 guide: "🐼 𝙐𝙨𝙖𝙜𝙚: %1",
 version: "🐣 𝙑𝙚𝙧𝙨𝙞𝙤𝙣: %1",
 noGuide: "❌ 𝙉𝙤 𝙪𝙨𝙖𝙜𝙚 𝙜𝙪𝙞𝙙𝙚 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚 ❌"
 }
 },

 onChat: async function ({ message, event, getLang }) {
 const text = event.body.trim();
 if (!text.toLowerCase().startsWith("list")) return;

 const args = text.split(/\s+/).slice(1);
 return module.exports.onStart({ message, args, getLang });
 },

 onStart: async function ({ message, args, getLang }) {
 if (args.length === 0) {
 const noPrefix = [], prefixOnly = [];

 const short = (name) => name.length > 10 ? name.slice(0, 7) + "..." : name;

 for (const [, cmd] of commands) {
 const cfg = cmd.config;
 const desc = cfg.shortDescription?.en || "No description";
 const info = `• ${short(cfg.name).padEnd(10)} : ${desc}`;

 if (typeof cmd.onChat === "function") noPrefix.push(info);
 else prefixOnly.push(info);
 }

 function addBars(arr) {
 const res = [];
 for (let i = 0; i < arr.length; i++) {
 res.push(arr[i]);
 if ((i + 1) % 3 === 0 && i !== arr.length - 1) res.push("██████████—🌸");
 }
 return res.join("\n");
 }

 const msg = [
 getLang("header"),
 "",
 `${getLang("categoryNoPrefix")}\n${noPrefix.length ? addBars(noPrefix) : getLang("empty")}`,
 "",
 `${getLang("categoryPrefixOnly")}\n${prefixOnly.length ? addBars(prefixOnly) : getLang("empty")}`,
 getLang("footer")
 ].join("\n");

 return message.reply(msg);
 }

 // list <command>
 const name = args[0].toLowerCase();
 const cmd = commands.get(name) || commands.get(aliases.get(name));
 if (!cmd) return message.reply(getLang("notFound", name));

 const cfg = cmd.config;
 const getRole = (r) => ["Everyone", "Admin", "Bot Owner"][r] || `Role ${r}`;
 const msg = [
 getLang("detailTitle", cfg.name),
 "██████████—🌸",
 "",
 getLang("name", cfg.name || "N/A"),
 "",
 getLang("aliases", cfg.aliases?.join(", ") || "None"),
 "",
 getLang("description", typeof cfg.description === "object" ? cfg.description.en || "No description" : cfg.description || "No description"),
 "",
 getLang("role", getRole(cfg.role ?? 0)),
 "",
 getLang("guide", typeof cfg.guide === "object" ? (cfg.guide.en || getLang("noGuide")) : (cfg.guide || getLang("noGuide"))),
 "",
 getLang("version", cfg.version || "1.0"),
 "",
 "██████████—🌸"
 ].join("\n");

 return message.reply(msg);
 }
};
<div style="text-align: center;"><div style="position:relative; top:0; margin-right:auto;margin-left:auto; z-index:99999">

</div></div>