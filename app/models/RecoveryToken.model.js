
import { DataTypes } from 'sequelize';
import sequelize from '../config/db/connection.js';

export const RecoveryToken = sequelize.define('RecoveryToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});