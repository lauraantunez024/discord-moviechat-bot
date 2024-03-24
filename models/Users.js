module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING,
        },
        is_chosen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        availability: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    })
}