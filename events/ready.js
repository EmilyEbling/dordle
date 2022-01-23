const commands = require('../deploy-commands.js')
const { scheduleReminder } = require('../helpers/reminder.js')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		commands.registerCommands();
		scheduleReminder(client);
	},
};
