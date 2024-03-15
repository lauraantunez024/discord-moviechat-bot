// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const Sequelize = require("sequelize");
const pg = require('pg');
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

require("dotenv").config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const sequelize = new Sequelize('availability', 'laura', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const userAvailability = sequelize.define("availability", {
  name: {
    type: Sequelize.STRING,
    unique: false,
  },
  days: Sequelize.ARRAY(Sequelize.STRING),
});

const submissionCount = sequelize.define("submission_count", {
    day_of_week: {
      type: Sequelize.STRING,
      // defaultValue: 'Wednesday',
      unique: false
    },
    submissions: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
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
  submissionCount.sync();
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


// Handles modal submission and adds it to sequelize database  

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  const nameData = interaction.fields.getTextInputValue("nameInput");
  const dateData = interaction.fields.getTextInputValue("dateInput");
  const filteredDates = dateData.trim().replace(' ', '');
  const datesData = filteredDates.split(',');
  const info = new Map();
  for(var i=0; i < daysOfWeek.length; i++) {
    info.set(daysOfWeek[i])
  }

  
  if (interaction.customId === "movieModal") {

    try { 

      const userInfo = await userAvailability.create({
        name: nameData,
        days: datesData,
      });
      for(var i=0; i < datesData.length; i++) {
        const dateInfo = submissionCount.create({
          day_of_week: datesData[i]
        })
      }

        const singleUser = await userAvailability.findOne({ where: { name: userInfo.name } })

        if (singleUser) {
            for(var i=0; i < datesData.length; i++) {
              if (singleUser.get('days').includes(datesData[i])) {
                info.set(daysOfWeek[i], true)

              } else {
                info.set(daysOfWeek[i], false)

              }
              console.log(info)


            }

            return interaction.reply(singleUser.get('days'));
        }

        const singleDay = await submissionCount.findOne({ where: { day_of_week: dateInfo.day_of_week}})

        if (!singleDay) {
          
          submissionCount.get
        }

        

        // for(var i = 0; i < datesData.length; i++) {
       
        //   const day = await submissionCount.findAll({ attributes: ['day_of_week']});
        //   if (day === datesData[i]) {
            
        //     day.increment('submissions');
        //     console.log(day)
            
        //   } 
        // return interaction.reply(day);
          
        // }


              // for(var i=0; i < submissionCount.day_of_week.length; i++) {
              //   const singleDay = await submissionCount.findOne({ where: { day_of_week: datesData[i] } })
              //   if (singleDay === dateData[i]) {
              //     singleDay.increment('submissions')
              //     singleDay.destroy({where: { day_of_week: datesData[i]}})
              //   } else { 
              //     console.log('only create')
              //   }

              // }




        // return interaction.reply(`Could not find tag: ${singleUser}`);
        // if (info.get(daysOfWeek[i]) === true ) {
        //   submissionCount.create({
        //     day_of_week: info.get(daysOfWeek[i]),
        //     submissions: 1
        //   })
        // }

        
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
