const Sequelize = require('sequelize')
const sequelize = new Sequelize('movienightdb', 'laura', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const Movie = require('./models/Movies.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes)
require('./models/MovieNightDetails.js')(sequelize, Sequelize.DataTypes)

const force = process.argv.includes('--force') || process.argv.includes('-f')

sequelize.sync({ force }).then(async () => {
    const picks = [
        Movie.upsert({ name: 'Linda Linda Lindas', streaming_service: 'Youtube'}),
        Movie.upsert({ name: 'Bicycle Thieves', streaming_service: 'Max'}),
        Movie.upsert({ name: 'The Harder They Fall', streaming_service: 'Netflix'})
    ];

    await Promise.all(picks);
    console.log('Database has been synced weeeeee');

    sequelize.close();

}).catch(console.error)

