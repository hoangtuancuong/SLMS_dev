import User from "../models/User.js";
import JwtService from "../services/jwt.service.js";
import { UnauthorizedError } from "../utils/ApiError.js";

const loginDto = {
	login: async (email, password, transaction) => {
		const user = await User.unscoped().findOne({ where: { email }, transaction });

		if (!user || !(await user.checkPassword(password)))
			throw new UnauthorizedError("Email hoặc mật khẩu không đúng.");

		const payload = {
			id: user.id,
			role: user.role
		};

		const token = JwtService.jwtSign(payload);
		const data = await User.findByPk(user.id);
		return { data, token };
	},

	logout: async (data) => {
		JwtService.jwtBlacklistToken(JwtService.jwtGetToken(data));
	}
};

export default loginDto;
