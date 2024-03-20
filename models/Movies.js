module.exports = (sequelize, DataTypes) => {
    return sequelize.define('movies', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        streaming_service: {
            type: DataTypes.TEXT
        }
    })
}