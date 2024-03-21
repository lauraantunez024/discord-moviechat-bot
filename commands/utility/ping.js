const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chosen-one')
		.setDescription('claim your turn on the throne'),

	async execute(interaction) {
	await interaction.reply({ content: `Thank you chosen one. We eagerly await your movie pick.`, ephemeral: true })

	},
};