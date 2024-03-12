// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const Sequelize = require("sequelize");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");

require("dotenv").config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const userAvailability = sequelize.define("availability", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  days: Sequelize.TEXT,
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, (readyClient) => {
  userAvailability.sync();
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

//   handles general command function

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});


// client.on(Events.InteractionCreate, async (interaction) => {
//     if (!interaction.isChatInputCommand()) return;
  
//     const { commandName } = interaction;
  
//     if (commandName === "availability") {
//       const nameData = interaction.fields.getTextInputValue("nameInput");
//       const dateData = interaction.fields.getTextInputValue("dateInput");
  
//       try {
//         // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
//         const info = await userAvailability.create({
//           name: nameData,
//           date: dateData,
//         });
  
//         return interaction.reply(`User ${info.name} added on ${info.date}.`);
//       } catch (error) {
//         if (error.name === "SequelizeUniqueConstraintError") {
//           return interaction.reply("That tag already exists.");
//         }
  
//         return interaction.reply("Something went wrong with adding a tag.");
//       }
//     }
//   });
// handles modal

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  const nameData = interaction.fields.getTextInputValue("nameInput");
  const dateData = interaction.fields.getTextInputValue("dateInput");
  console.log(
    `THE NAME OF THE PERSON IS ${nameData} AND THEIR AVAILABLE DAY IS ${dateData}`
  );
  if (interaction.customId === "movieModal") {
    try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        const info = await userAvailability.create({
          name: nameData,
          days: dateData,
        });
        const singleUser = await userAvailability.findOne({ where: { name: info.name } })

        if (singleUser) {

            return interaction.reply(singleUser.get('days'));
        }
        return interaction.reply(`Could not find tag: ${singleUser}`);


  
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          return interaction.reply("Something already exists.");
        }
  
        return interaction.reply("Something went wrong :(");
      }


    
  }
});



// Log in to Discord with your client's token
client.login(process.env.TOKEN);
