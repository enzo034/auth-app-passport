import { Sequelize } from "sequelize";
import { DB_HOST, DB_PASSWORD, DB_NAME, DB_USERNAME } from "../config.js";

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
});

export default sequelize;