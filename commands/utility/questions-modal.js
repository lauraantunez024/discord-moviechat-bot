const {
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

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
      .setLabel("What day are you free this week?")
      .setStyle(TextInputStyle.Paragraph);

    const nameActionRow = new ActionRowBuilder().addComponents(nameInput);
    const dateActionRow = new ActionRowBuilder().addComponents(dateInput);

    modal.addComponents(nameActionRow, dateActionRow);

    await interaction.showModal(modal);

  },
  
};

// const client = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
// 		GatewayIntentBits.GuildMessages,
// 		GatewayIntentBits.MessageContent,
// 		GatewayIntentBits.GuildMembers,
//   ]})

// client.on(Events.InteractionCreate, async interaction => {
//     if (!interaction.isChatInputCommand()) return;

//     if (interaction.commandName === 'availability') {
//         const modal = new ModalBuilder()
//             .setCustomId('movieModal')
//             .setTitle(`When's the next movie`);

//             const nameInput = new TextInputBuilder()
//                 .setCustomId('nameInput')
//                 .setLabel("What's your name (familiarly)")
//                 .setStyle(TextInputStyle.Short)

//             const dateInput = new TextInputBuilder()
//                 .setCustomId('dateInput')
//                 .setLabel('What day are you free this week?')
//                 .setStyle(TextInputStyle.Paragraph)

//             const nameActionRow = new ActionRowBuilder().addComponents(nameInput);
//             const dateActionRow = new ActionRowBuilder().addComponents(dateInput);

//             modal.addComponents(nameActionRow, dateActionRow);

//             await interaction.showModal(modal)

//     }
// })
