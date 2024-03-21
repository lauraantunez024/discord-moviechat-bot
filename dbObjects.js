const Sequelize = require('sequelize');
const sequelize = new Sequelize('movienightdb', 'laura', 'password', {
    host: 'localhost',
    dialect: 'postgres'
  });

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const Movies = require('./models/Movies')(sequelize, Sequelize.DataTypes);
const MovieNightDetails = require('./models/MovieNightDetails.js')(sequelize, Sequelize.DataTypes)

MovieNightDetails.belongsTo(Movies, { foreignKey: 'movie_id', as: 'movie' });
MovieNightDetails.belongsTo(Users)

Reflect.defineProperty(Users.prototype, 'addMovie', {
    value: async movie => {
         await MovieNightDetails.findOne({
            where: { user_id: this.user_id, movie_id: movie.id },
        });

        return MovieNightDetails.create({ user_id: this.user_id, movie_id: movie.id, best_day: 'Thursday'})

    }
});

Reflect.defineProperty(Users.prototype, 'getMovies', {
    value: () => {
        if (user_id.is_chosen === true ) {

            return MovieNightDetails.findAll({
                where: {user_id: user_id},
                include: ['movie']
            })
        }
        return MovieNightDetails.findAll({
            where: { user_id: this.user_id},
            include: ['movie']
        })
    }
});

module.exports = { Users, Movies, MovieNightDetails }