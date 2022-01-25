const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Replies with how the point system functions'),
	async execute(interaction) {
		await interaction.reply('Correct on the:\n First Guess--6 points\n Second Guess--5 points\n Third Guess--4 points\n Fourth Guess--3 points\n Fifth Guess--2 points\n Sixth Guess--1 point');
	},
};