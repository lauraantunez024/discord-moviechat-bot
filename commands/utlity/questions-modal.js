const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('what do you think it does'),
    async execute(interaction) {
        await interaction.reply('Hey cutie');
    }
}