import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import globalErrorHandler from "../middlewares/errorHandler.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";

/*
  body-parser: Parse incoming request bodies in a middleware before your handlers, 
  available under the req.body property.
*/

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routeFiles = fs.readdirSync(__dirname + "/../routes/").filter((file) => file.endsWith(".js"));

let server;
let routes = [];

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Documentation",
			version: "1.0.0",
			description: "API documentation for the service"
		}
	},
	apis: ["./src/routes/*.js", "./src/utils/swagger-const.yaml"]
};

const swaggerDocument = swaggerJsdoc(swaggerOptions);

const expressService = {
	init: async () => {
		try {
			/*
		Loading routes automatically
	  */
			for (const file of routeFiles) {
				const route = await import(`../routes/${file}`);
				const routeName = Object.keys(route)[0];
				routes.push(route[routeName]);
			}

			server = express();
			server.use(cors());
			server.use(bodyParser.json());
			server.use(routes);
			server.use(globalErrorHandler);

			server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

			server.listen(process.env.SERVER_PORT);
			console.log("[EXPRESS] Express initialized");
		} catch (error) {
			console.log("[EXPRESS] Error during express service initialization");
			throw error;
		}
	}
};

export default expressService;
