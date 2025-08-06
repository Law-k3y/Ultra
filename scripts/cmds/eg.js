
 * First you need to have knowledge of javascript such as variables, functions, loops, arrays, objects, promise, async/await, ... you can learn more at here: https://developer.mozilla.org/en-US/docs/Web/JavaScript or here: https://www.w3schools.com/js/
 * Next is knowledge of Nodejs such as require, module.exports, ... you can learn more at here: https://nodejs.org/en/docs/
 * And knowledge of unofficial facebook api such as api.sendMessage, api.changeNickname,... you can learn more at here: https://github.com/brandchitron
 * If the file name ends with `.eg.js` then it will not be loaded into the bot, if you want to load it into the bot then change the extension of the file to `.js`
 * Don't change my credit => Author: Chitron Bhattacharjee

module.exports = {
	config: {
		name: "commandName", // Name of command, it must be unique to identify with other commands
		version: "1.1", // Version of command
		author: "Chitron Bhattacharjee", // Author name must not be changed
		countDown: 5, // Time to wait before executing command again (seconds)
		role: 0, // Role of user to use this command (0: normal user, 1: admin box chat, 2: owner bot)
		shortDescription: {
			en: "this is short description of command"
		}, // Short description of command
		description: {
		
			en: "this is long description of command"
		}, // Long description of command
		category: "categoryName", // Category of command
		guide: {
					en: "this is guide of command"
		} // Guide of command
	},

	langs: {
	
		en: {
			hello: "hello world",
			helloWithName: "hello, your facebook id is %1"
		} // English language
	},

	// onStart is a function that will be executed when the command is executed
	onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {
		// YOUR CODE HERE, use console.log() to see all properties in variables above


		// getLang is a function to get language of command

		// getLang without parameter is a function to get language of command without parameter
		message.reply(getLang("hello"));
		// getLang with parameter is a function to get language of command with parameter (delete // in line below to test)
		// message.reply(getLang("hello", event.senderID));

	}
};
