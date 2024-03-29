const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
} = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("availability")
    .setDescription("whens the next movie"),
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("movieModal")
      .setTitle(`When's the next movie`);
    const nameInput = new TextInputBuilder()
      .setCustomId("nameInput")
      .setLabel("What's your name (familiarly)")
      .setStyle(TextInputStyle.Short);

    const dateInput = new TextInputBuilder()
      .setCustomId("dateInput")
      .setLabel("Days available seperated by commas")
      .setStyle(TextInputStyle.Paragraph);

    const nameActionRow = new ActionRowBuilder().addComponents(nameInput);
    const dateActionRow = new ActionRowBuilder().addComponents(dateInput);

    modal.addComponents(nameActionRow, dateActionRow);

    await interaction.showModal(modal);

  },
  
};
