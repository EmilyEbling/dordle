const { SlashCommandBuilder } = require('@discordjs/builders');
const { sendLeaderboardMessage} = require('../helpers/reminder.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Replies with the most recent Wordle leaderboard'),
	async execute(interaction) {
		sendLeaderboardMessage(interaction.channel);
		await interaction.reply({ content: 'Success!', ephemeral: true });
	},
};