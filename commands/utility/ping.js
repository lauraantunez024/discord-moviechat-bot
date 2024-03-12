const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('show user'),
	async execute(interaction) {
		await interaction.showModal(modal);
	},
};