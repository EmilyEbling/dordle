const leaderboard = require('../helpers/update-leaderboard.js');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		leaderboard.parseMessage(message);
	},
};