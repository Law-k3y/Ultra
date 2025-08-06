// url check image
const checkUrlRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|gif)/gi;
const regExColor = /#([0-9a-f]{6})|rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)|rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+\.?\d*)\)/gi;
const { uploadImgbb } = global.utils;

module.exports = {
	config: {
		name: "customrankcard",
		aliases: ["crc", "customrank"],
		version: "1.12",
		author: "Chitron Bhattacharjee",
		countDown: 5,
		role: 0,
		description: {
			vi: "Thiết kế thẻ rank theo ý bạn",
			en: "Design rank card by your own"
		},
		category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
		guide: {
			vi: {
				body: "   {pn} [maincolor | subcolor | linecolor | expbarcolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <value>"
					+ "\n   Trong đó: "
					+ "\n  + maincolor | background <value>: background chính của thẻ rank"
					+ "\n  + subcolor <value>: background phụ"
					+ "\n  + linecolor <value>: màu của đường kẻ giữa background chính và phụ"
					+ "\n  + expbarcolor <value>: màu của thanh exp"
					+ "\n  + progresscolor <value>: màu của thanh exp hiện tại"
					+ "\n  + alphasubcolor <value>: độ mờ của background phụ (từ 0 -> 1)"
					+ "\n  + textcolor <value>: màu của chữ (hex color or rgba)"
					+ "\n  + namecolor <value>: màu của tên"
					+ "\n  + expcolor <value>: màu của exp"
					+ "\n  + rankcolor <value>: màu của rank"
					+ "\n  + levelcolor <value>: màu của level"
					+ "\n    • <value> có thể là mã hex color, rgb, rgba, gradient (mỗi màu cách nhau bởi dấu cách) hoặc url hình ảnh"
					+ "\n    • Nếu bạn muốn dùng gradient, hãy nhập nhiều mã màu cách nhau bởi dấu cách"
					+ "\n   {pn} reset: reset tất cả về mặc định"
					+ "\n   Ví dụ:"
					+ "\n    {pn} maincolor #fff000"
					+ "\n    {pn} maincolor #0093E9 #80D0C7"
					+ "\n    {pn} subcolor rgba(255,136,86,0.4)"
					+ "\n    {pn} reset",
				attachment: {
					[`${__dirname}/assets/guide/customrankcard_1.jpg`]: "https://i.ibb.co/BZ2Qgs1/image.png",
					[`${__dirname}/assets/guide/customrankcard_2.png`]: "https://i.ibb.co/wy1ZHHL/image.png"
				}
			},
			en: {
				body: "   {pn} [maincolor | subcolor | linecolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <value>"
					+ "\n   In which: "
					+ "\n  + maincolor | background <value>: main background of rank card"
					+ "\n  + subcolor <value>: sub background"
					+ "\n  + linecolor <value>: color of line between main and sub background"
					+ "\n  + expbarcolor <value>: color of exp bar"
					+ "\n  + progresscolor <value>: color of current exp bar"
					+ "\n  + alphasubcolor <value>: opacity of sub background (from 0 -> 1)"
					+ "\n  + textcolor <value>: color of text (hex color or rgba)"
					+ "\n  + namecolor <value>: color of name"
					+ "\n  + expcolor <value>: color of exp"
					+ "\n  + rankcolor <value>: color of rank"
					+ "\n  + levelcolor <value>: color of level"
					+ "\n    • <value> can be hex color, rgb, rgba, gradient (each color is separated by space) or image url"
					+ "\n    • If you want to use gradient, please enter many colors separated by space"
					+ "\n   {pn} reset: reset all to default"
					+ "\n   Example:"
					+ "\n    {pn} maincolor #fff000"
					+ "\n    {pn} subcolor rgba(255,136,86,0.4)"
					+ "\n    {pn} reset",
				attachment: {
					[`${__dirname}/assets/guide/customrankcard_1.jpg`]: "https://i.ibb.co/BZ2Qgs1/image.png",
					[`${__dirname}/assets/guide/customrankcard_2.png`]: "https://i.ibb.co/wy1ZHHL/image.png"
				}
			}
		}
	},

	langs: {
		vi: {
			invalidImage: "Url hình ảnh không hợp lệ, vui lòng chọn 1 url với trang đích là hình ảnh (jpg, jpeg, png, gif), bạn có thể tải ảnh lên trang https://imgbb.com/ và chọn mục \"lấy link trực tiếp\" để lấy url hình ảnh",
			invalidAttachment: "File đính kèm không phải là hình ảnh",
			invalidColor: "Mã màu không hợp lệ, vui lòng nhập mã hex color (6 chữ số) hoặc mã màu rgba",
			notSupportImage: "Url hình ảnh không được hỗ trợ với tùy chọn \"%1\"",
			success: "Đã lưu thay đổi của bạn, bên dưới là phần xem trước",
			reseted: "Đã reset tất cả cài đặt về mặc định",
			invalidAlpha: "Vui lòng chọn chỉ số trong khoảng từ 0 -> 1"
		},
		en: {
			invalidImage: "Invalid image url, please choose an url with image destination (jpg, jpeg, png, gif), you can upload image to https://imgbb.com/ and choose \"get direct link\" to get image url",
			invalidAttachment: "Invalid attachment, please choose an image file",
			invalidColor: "Invalid color code, please choose a hex color code (6 digits) or rgba color code",
			notSupportImage: "Url image is not supported with option \"%1\"",
			success: "Your changes have been saved, here is a preview",
			reseted: "All settings have been reset to default",
			invalidAlpha: "Please choose a number from 0 -> 1"
		}
	},

	onStart: async function ({ message, threadsData, event, args, getLang, usersData, envCommands }) {
		if (!args[0])
			return message.SyntaxError();

		const customRankCard = await threadsData.get(event.threadID, "data.customRankCard", {});
		const key = args[0].toLowerCase();
		let value = args.slice(1).join(" ");

		const supportImage = ["maincolor", "background", "bg", "subcolor", "expbarcolor", "progresscolor", "linecolor"];
		const notSupportImage = ["textcolor", "namecolor", "expcolor", "rankcolor", "levelcolor", "lvcolor"];

		if ([...notSupportImage, ...supportImage].includes(key)) {
			const attachmentsReply = event.messageReply?.attachments;
			const attachments = [
				...event.attachments.filter(({ type }) => ["photo", "animated_image"].includes(type)),
				...attachmentsReply?.filter(({ type }) => ["photo", "animated_image"].includes(type)) || []
			];
			if (value == 'reset') {
			}
			else if (value.match(/^https?:\/\//)) {
				// if image url
				const matchUrl = value.match(checkUrlRegex);
				if (!matchUrl)
					return message.reply(getLang("invalidImage"));
				const infoFile = await uploadImgbb(matchUrl[0], 'url');
				value = infoFile.image.url;
			}
			else if (attachments.length > 0) {
				// if image attachment
				if (!["photo", "animated_image"].includes(attachments[0].type))
					return message.reply(getLang("invalidAttachment"));
				const url = attachments[0].url;
				const infoFile = await uploadImgbb(url, 'url');
				value = infoFile.image.url;
			}
			else {
				// if color
				const colors = value.match(regExColor);
				if (!colors)
					return message.reply(getLang("invalidColor"));
				value = colors.length == 1 ? colors[0] : colors;
			}

			if (value != "reset" && notSupportImage.includes(key) && value.startsWith?.("http"))
				return message.reply(getLang("notSupportImage", key));

			switch (key) {
				case "maincolor":
				case "background":
				case "bg":
					value == "reset" ? delete customRankCard.main_color : customRankCard.main_color = value;
					break;
				case "subcolor":
					value == "reset" ? delete customRankCard.sub_color : customRankCard.sub_color = value;
					break;
				case "linecolor":
					value == "reset" ? delete customRankCard.line_color : customRankCard.line_color = value;
					break;
				case "progresscolor":
					value == "reset" ? delete customRankCard.exp_color : customRankCard.exp_color = value;
					break;
				case "expbarcolor":
					value == "reset" ? delete customRankCard.expNextLevel_color : customRankCard.expNextLevel_color = value;
					break;
				case "textcolor":
					value == "reset" ? delete customRankCard.text_color : customRankCard.text_color = value;
					break;
				case "namecolor":
					value == "reset" ? delete customRankCard.name_color : customRankCard.name_color = value;
					break;
				case "rankcolor":
					value == "reset" ? delete customRankCard.rank_color : customRankCard.rank_color = value;
					break;
				case "levelcolor":
				case "lvcolor":
					value == "reset" ? delete customRankCard.level_color : customRankCard.level_color = value;
					break;
				case "expcolor":
					value == "reset" ? delete customRankCard.exp_text_color : customRankCard.exp_text_color = value;
					break;
			}
			try {
				await threadsData.set(event.threadID, customRankCard, "data.customRankCard");
				message.reply({
					body: getLang("success"),
					attachment: await global.client.makeRankCard(event.senderID, usersData, threadsData, event.threadID, envCommands["rank"]?.deltaNext || 5)
						.then(stream => {
							stream.path = "rankcard.png";
							return stream;
						})
				});
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["alphasubcolor", "alphasubcard"].includes(key)) {
			if (parseFloat(value) < 0 && parseFloat(value) > 1)
				return message.reply(getLang("invalidAlpha"));
			customRankCard.alpha_subcard = parseFloat(value);
			try {
				await threadsData.set(event.threadID, customRankCard, "data.customRankCard");
				message.reply({
					body: getLang("success"),
					attachment: await global.client.makeRankCard(event.senderID, usersData, threadsData, event.threadID, envCommands["rank"]?.deltaNext || 5)
						.then(stream => {
							stream.path = "rankcard.png";
							return stream;
						})
				});
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (key == "reset") {
			try {
				await threadsData.set(event.threadID, {}, "data.customRankCard");
				message.reply(getLang("reseted"));
			}
			catch (err) {
				message.err(err);
			}
		}
		else
			message.SyntaxError();
	}
};