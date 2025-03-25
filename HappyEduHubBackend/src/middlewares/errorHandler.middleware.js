import { IsApiError } from "../utils/ApiError.js";
const currentEnv = process.env.NODE_ENV || "development";
/**
 * Global error handler for all routes
 * @param {ApiError} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export default (err, _req, res, next) => {
	console.log(err);
	if (res.headersSent) return next(err);
	if (IsApiError(err)) {
		return res.status(err.statusCode).json({
			message: err.message,
			type: err.type
		});
	}

	const response = { message: err.message, type: "SERVER_ERROR" };
	if (currentEnv === "development") response.err = err;
	return res.status(500).json(response);
};
