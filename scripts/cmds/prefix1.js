const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "2.0",
		author: "Chitron Bhattacharjee",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Change bot's prefix in chat or globally"
		},
		description: {
			en: "Customize the command prefix for your chat or system (admin only)"
		},
		category: "config",
		guide: {
			en: `
🌸 Usage:
+prefix <new> → Set new prefix in this group
+prefix <new> -g → Set global prefix (admin only)
+prefix reset → Reset prefix to default

🧸 Examples:
+prefix #
+prefix $ -g
+prefix reset`
		}
	},

	langs: {
		en: {
			reset: "💠 Your prefix has been reset to default: 【 %1 】",
			onlyAdmin: "⛔ Only bot admin can set global prefix!",
			confirmGlobal: "🌐 Please react to confirm global prefix change~",
			confirmThisThread: "💬 Please react to confirm group prefix change~",
			successGlobal: "✅ Global prefix successfully changed to: 『 %1 』",
			successThisThread: "✅ Group prefix successfully changed to: 『 %1 』",
			myPrefix: `
╭───[ 🌸 𝒫𝓇𝑒𝒻𝒾𝓍 𝒾𝓃𝒻𝑜 ]───╮
│ ✨ 𝐵𝑜𝓉 𝒩𝒶𝓂𝑒: 𝑆𝐻𝐼𝒫𝒰 𝒜𝐼
│ 🌐 𝒮𝓎𝓈𝓉𝑒𝓂 𝒫𝓇𝑒𝒻𝒾𝓍: %1
│ 💬 𝒞𝒽𝒶𝓉 𝒫𝓇𝑒𝒻𝒾𝓍: %2
│ 🧚‍♀️ 𝒟𝑒𝓋: Chitron Bhattacharjee
│ 📝 𝒯𝒾𝓅: Type +help for commands
╰───────────────╯`
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0].toLowerCase() === 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g") {
			if (role < 2) return message.reply(getLang("onlyAdmin"));
			formSet.setGlobal = true;
		} else {
			formSet.setGlobal = false;
		}

		return message.reply(
			formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread"),
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body?.toLowerCase() === "prefix") {
			return message.reply(getLang(
				"myPrefix",
				global.GoatBot.config.prefix,
				utils.getPrefix(event.threadID)
			));
		}
	}
};