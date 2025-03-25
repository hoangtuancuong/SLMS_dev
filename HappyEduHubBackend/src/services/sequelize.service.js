import { Sequelize } from "sequelize";
import databaseConfig from "../config/database.js";
import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const modelFiles = fs.readdirSync(__dirname + "/../models/").filter((file) => file.endsWith(".js"));

let connection;

const sequelizeService = {
	init: async () => {
		try {
			connection = new Sequelize(databaseConfig);

			for (const file of modelFiles) {
				const model = await import(`../models/${file}`);
				model.default.init(connection);
			}

			modelFiles.map(async (file) => {
				const model = await import(`../models/${file}`);
				model.default.associate && model.default.associate(connection.models);
			});

			console.log("[SEQUELIZE] Database service initialized");
		} catch (error) {
			console.log("[SEQUELIZE] Error during database service initialization");
			throw error;
		}
	}
};

export { connection, sequelizeService };
