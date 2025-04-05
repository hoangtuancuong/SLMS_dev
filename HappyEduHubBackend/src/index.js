import dotenv from "dotenv";
import expressService from "./services/express.service.js";
import { sequelizeService } from "./services/sequelize.service.js";
import driveService from "./services/drive.service.js";
import zoomService from "./services/zoom.service.js";

dotenv.config();

const services = [expressService, sequelizeService, driveService, zoomService];

(async () => {
	try {
		for (const service of services) {
			await service.init();
		}
		console.log("Server initialized.");
		//PUT ADITIONAL CODE HERE.
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
})();
