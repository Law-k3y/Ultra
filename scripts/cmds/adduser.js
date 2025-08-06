const { findUid } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const chitronUID = "100081330372098";

module.exports = {
	config: {
		name: "adduser",
		aliases: ["add"],
		version: "2.2",
		author: "Chitron Bhattacharjee",
		countDown: 5,
		role: 0,
		description: {
			en: "Add user to your group",
			vi: "Thêm người dùng vào nhóm"
		},
		category: "box chat",
		guide: {
			en: "{pn} [profile link | uid | 'add chitron']"
		},
		bothPrefix: true
	},

	langs: {
		en: {
			alreadyInGroup: "🚫 Already in group",
			successAdd: "✨ Added successfully: %1 member(s)",
			failedAdd: "❌ Failed to add %1 user(s):",
			approve: "🕊️ Waiting for approval: %1 user(s)",
			invalidLink: "🔗 Invalid Facebook link",
			cannotGetUid: "😢 Can't fetch UID",
			linkNotExist: "❓ Profile not found",
			cannotAddUser: "🛑 User blocked or bot blocked from adding them"
		},
		vi: {
			alreadyInGroup: "🚫 Đã có trong nhóm",
			successAdd: "✨ Đã thêm thành công %1 thành viên",
			failedAdd: "❌ Không thể thêm %1 thành viên:",
			approve: "🕊️ Đợi phê duyệt: %1 thành viên",
			invalidLink: "🔗 Link Facebook không hợp lệ",
			cannotGetUid: "😢 Không lấy được UID",
			linkNotExist: "❓ Không tìm thấy hồ sơ",
			cannotAddUser: "🛑 Bot bị chặn hoặc người dùng chặn thêm nhóm"
		}
	},

	// 🔁 Prefix Usage
	onStart: async function (props) {
		const args = props.args;
		if (!args[0]) return props.message.reply("🧩 Please provide a UID or profile link to add!");
		await handleAdd({ ...props, args });
	},

	// 🧠 No Prefix Detection
	onChat: async function ({ message, event, threadsData, api, getLang }) {
		const content = event.body.toLowerCase();
		const triggers = [
			"add admin", "add owner", "add author",
			"add chitron", "add cb", "add boss",
			"add developer", "add dev", "add ntkhang", "add khang"
		];

		const matched = triggers.some(trigger => isSimilar(content, trigger));
		if (!matched) return;

		await handleAdd({ message, event, api, threadsData, args: [chitronUID], getLang });
	}
};

// 📦 Shared logic for both onStart and onChat
async function handleAdd({ message, event, api, args, threadsData, getLang }) {
	const { members, adminIDs, approvalMode } = await threadsData.get(event.threadID);
	const botID = api.getCurrentUserID();

	const success = [{ type: "success", uids: [] }, { type: "waitApproval", uids: [] }];
	const failed = [];

	function checkErrorAndPush(messageError, item) {
		const cleanItem = item.replace(/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)/i, '');
		const exist = failed.find(error => error.type == messageError);
		if (exist) exist.uids.push(cleanItem);
		else failed.push({ type: messageError, uids: [cleanItem] });
	}

	const regExMatchFB = /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i;

	for (const item of args) {
		let uid;
		let skip = false;

		if (isNaN(item) && regExMatchFB.test(item)) {
			for (let i = 0; i < 10; i++) {
				try {
					uid = await findUid(item);
					break;
				} catch (err) {
					if (["SlowDown", "CannotGetData"].includes(err.name)) {
						await sleep(1000);
						continue;
					}
					if (i === 9 || !["SlowDown", "CannotGetData"].includes(err.name)) {
						checkErrorAndPush(
							err.name === "InvalidLink" ? getLang("invalidLink") :
							err.name === "CannotGetData" ? getLang("cannotGetUid") :
							err.name === "LinkNotExist" ? getLang("linkNotExist") :
							err.message, item
						);
						skip = true;
						break;
					}
				}
			}
		} else if (!isNaN(item)) {
			uid = item;
		} else continue;

		if (skip) continue;

		if (members.some(m => m.userID == uid && m.inGroup)) {
			checkErrorAndPush(getLang("alreadyInGroup"), item);
		} else {
			try {
				await api.addUserToGroup(uid, event.threadID);
				if (approvalMode && !adminIDs.includes(botID))
					success[1].uids.push(uid);
				else
					success[0].uids.push(uid);
			} catch {
				checkErrorAndPush(getLang("cannotAddUser"), item);
			}
		}
	}

	let msg = `🌟 𝗔𝗱𝗱 𝗥𝗲𝗽𝗼𝗿𝘁 🌟\n━━━━━━━━━━━━━\n`;

	if (success[0].uids.length)
		msg += `✅ ${getLang("successAdd", success[0].uids.length)}\n`;

	if (success[1].uids.length)
		msg += `⏳ ${getLang("approve", success[1].uids.length)}\n`;

	if (failed.length)
		msg += `⚠️ ${getLang("failedAdd", failed.reduce((a, b) => a + b.uids.length, 0))}` +
			failed.reduce((a, b) => a += `\n • ${b.uids.join('\n ↳ ')}: ${b.type}`, "") + '\n';

	msg += `━━━━━━━━━━━━━\n💖 𝘽𝙤𝙩 𝘽𝙮: Chitron Bhattacharjee`;

	await message.reply(msg);
}

// 🧠 Strict Typo Detection (≥85% match)
function isSimilar(input, target) {
	input = input.toLowerCase().trim();
	target = target.toLowerCase().trim();

	const distance = levenshteinDistance(input, target);
	const maxAllowed = Math.floor(target.length * 0.15); // only 15% change allowed

	return distance <= maxAllowed;
}

// 🔢 Levenshtein Distance
function levenshteinDistance(a, b) {
	const matrix = [];

	for (let i = 0; i <= b.length; i++) matrix[i] = [i];
	for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					matrix[i][j - 1] + 1,
					matrix[i - 1][j] + 1
				);
			}
		}
	}
	return matrix[b.length][a.length];
}