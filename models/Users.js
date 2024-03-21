module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        is_chosen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        availability: {
            type: DataTypes.TEXT
        }
    })
}