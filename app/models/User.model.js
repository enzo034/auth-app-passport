import { DataTypes } from "sequelize"; 
import sequelize from "../config/db/connection.js";

export const User = sequelize.define('user', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    firstname: {
        type: DataTypes.STRING,
        notEmpty: true
    },
    lastname: {
        type: DataTypes.STRING,
        notEmpty: true
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        },
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});