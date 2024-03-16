const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder() 
        .setName('movie-pick')
        .setDescription("What movie and what streaming service?"),
        async execute(interaction) {
            const modal = new ModalBuilder()
                .setCustomId('moviePick')
                .setTitle('Whats the movie')
            const movieName = new TextInputBuilder()
                .setCustomId("movieNameInput")
                .setLabel("What's the name of the movie")
                .setStyle(TextInputStyle.Paragraph);
            const streamingServName = new TextInputBuilder()
                .setCustomId("streamingService")
                .setLabel("What streaming service is it on?")
                .setStyle(TextInputStyle.Short)

            const movieNameActionRow = new ActionRowBuilder().addComponents(movieName)
            const streamingNameActionRow = new ActionRowBuilder().addComponents(streamingServName)

        modal.addComponents(movieNameActionRow, streamingNameActionRow);

        await interaction.showModal(modal);

        }
}