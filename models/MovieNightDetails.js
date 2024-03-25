module.exports = (sequelize, DataTypes) => {
    return sequelize.define('movie_night_details', {
        user_id: DataTypes.STRING,
        movie_name: DataTypes.TEXT,
        best_day: {
            type: DataTypes.STRING,
            allowNull: false
        }
        
    })
}