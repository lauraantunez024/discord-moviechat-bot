// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const { Op, Sequelize } = require('sequelize');
const { Client, codeBlock, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Users, Movies } = require('./dbObjects.js');
const pg = require('pg');
const cron = require('node-cron')
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
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const sequelize = new Sequelize('database', 'laura', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const moviedb = new Collection();

// TO DO: add helper function that determines best day based on responses and adds it to movie night details db
// Create a cron job that fires day after 'best available day'

// const chosen = new Collection();

async function updateChosenUser () {
  try {
        const users = await Users.findAll({ });
        
        const chosenUser = Users.findOne({ where: { is_chosen: true } }) || 'No one is chosen.';

        const chosenIndex = chosenUser ? users.indexOf(chosenUser) : -1;

        const nextIndex = (chosenIndex + 1) % users.length;

        for (let i=0; i < users.length; i++) {
          if (i === nextIndex) {
            users[i].is_chosen = true;
         
          } else {
            users[i].is_chosen = false;
          }
          await users[i].save()
        }
        return users[nextIndex]
      } catch (error) {
        console.error('Error updating chosen user:', error);
      }

}

cron.schedule('* * * * * *', async () => {
  console.log('Running cron to update user....')
  try {
    const chosenUser = await updateChosenUser();
    console.log('Chosen User:', chosenUser.user_id)

  } catch(error) {
    console.error('Error updating chosen user:', error)
  }
})

// updateChosenUser().then(chosenUser => {
//   console.log('Chosen User:', chosenUser.user_id)
// }).catch(error => {
//   console.error('Error:', error)
// })
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
  // userAvailability.sync();
  // submissionCount.sync();
  // movie.sync();
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
  } catch (error) {qe
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


// async function findAvailable(user, days) {
//   const user = interaction.user.id

//   if (user) {

//   }
// }


// Handles modal submission and adds it to sequelize database  

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  
  if (interaction.customId === "movieModal") {
    const nameData = interaction.fields.getTextInputValue("nameInput");
    const dateData = interaction.fields.getTextInputValue("dateInput");
    const filteredDates = dateData.trim().replace(' ', '');
    const dateCollection = new Collection();
    const datesData = filteredDates.split(',');
    for(var i=0; i < datesData.length; i++) {
      dateCollection.set('day', datesData[i])
    }

  
    for(var i=0; i < daysOfWeek.length; i++) {
     moviedb.set(daysOfWeek[i], 0) 
    }

   const entryFilter = moviedb.filter(dateCollection.values() === moviedb.keys())
    moviedb.set
   
   {
    return Users.create({ user_id: nameData, availability: entryFilter})
    
   }
    

    // try { 

    //   const userInfo = await userAvailability.create({
    //     name: nameData,
    //     days: datesData,
    //   });
    //   // for(var i=0; i < datesData.length; i++) {
    //   //   const dateInfo = submissionCount.create({
    //   //     day_of_week: datesData[i]
    //   //   })
    //   // }

    //     const singleUser = await userAvailability.findOne({ where: { name: userInfo.name } })

    //     if (singleUser) {
    //         for(var i=0; i < datesData.length; i++) {
    //           if (singleUser.get('days').includes(datesData[i])) {
    //             info.set(daysOfWeek[i], true)

    //           } else {
    //             info.set(daysOfWeek[i], false)

    //           }
    //           console.log(info)
    //         }

    //         return interaction.reply(singleUser.get('days'));
    //     }

    //     const singleDay = await submissionCount.findOne({ where: { day_of_week: dateInfo.day_of_week}})

    //     if (!singleDay) {
          
    //       submissionCount.get
    //     }
        
    //   } catch (error) {
    //     if (error.name === "SequelizeUniqueConstraintError") {
    //       return interaction.reply("Something already exists.");
    //     }
  
    //     return interaction.reply("Something went wrong :(");
    //   }
    
  }
});

// Handles mnovie name modal submission and adds it to movies database

// client.on(Events.InteractionCreate, async (interaction) => {
  
  
//   if (interaction.customId === "moviePick") {
//     if (!interaction.isModalSubmit()) return;
//     const movieData = interaction.fields.getTextInputValue("movieInput")
//     const streamingData = interaction.fields.getTextInputValue("streamingService")
//     try {
//       const movieInfo = await movie.create({
//         name: movieData,
//         streamingPlatform: streamingData
//       })
      





//     } catch (error) {
//       if (error.name === "SequelizeUniqueConstraintError") {
//         return interaction.reply("Something already exists.");
//       }

//       return interaction.reply("Something went wrong :(");
// ''
//     }
//     return interaction.reply({ content: 'Your pick has been logged, thank you!', ephemeral: true})

//   }
// })

// client.on(Events.InteractionCreate, async (modalSubmit) => {
//   if (!modalSubmit.isModalSubmit()) return;

  
//   if (commandName === "whatmovie") {
//     // if (!interaction.isChatInputCommand()) return;
//     const modalData = await movie.findAll({ attributes: ['name']});
//     const formattedData = modalData.map( movie => movie.name).join(', ') || "Person (probably luis) hasn't dropped movie choice yet"
//     await modalSubmit.reply({ formattedData }) 
//   }
//   }
// )


// client.once(Events.ClientReady, async readyClient => {
// 	const storedDays = await Users.findAll();
// 	storedMovies.forEach(b => currency.set(b.user_id, b));

// 	console.log(`Logged in as ${readyClient.user.tag}!`);
// });
// Log in to Discord with your client's token
client.login(process.env.TOKEN);
