import JwtService from "../services/jwt.service.js";
import { ASSIGNMENT_TYPE, ROLE } from "../utils/const.js";
import { BadTokenError, ForbiddenError } from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
	try {
		if (process.env.SERVER_JWT === "false") return next();

		const token = JwtService.jwtGetToken(req);

		const decoded = JwtService.jwtVerify(token);

		console.log(decoded);

		req.userId = decoded.id;
		req.role = decoded.role;

		return next();
	} catch (error) {
		console.log(error);
		next(new BadTokenError("Token không hợp lệ."));
	}
};

const roleMiddleware = (roles) => {
	return (req, res, next) => {
		const role = req.role;
		if (role === ROLE.TROGIANG || role === ROLE.STUDENTVIP) 
			return next();
		if (roles.includes(role)) {
			return next();
		} else return next(new ForbiddenError("Bạn không có quyền truy cập."));
	};
};

export { authMiddleware, roleMiddleware };
