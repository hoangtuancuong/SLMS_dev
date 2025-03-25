import loginDto from "../dto/login.dto.js";
import { connection } from "../services/sequelize.service.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

let loginController = {
	login: async (req, res, next) => {
		const schema = YUP_UTILS.body({
			email: YUP_UTILS.string("email").email("Email không đúng định dạng.").required("Cần phải có `email`."),
			password: YUP_UTILS.string("password").required("Cần phải có `password`.")
		});
		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			let { email, password } = req.body;
			const data = await loginDto.login(email, password, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	logout: async (req, res, next) => {
		try {
			await loginDto.logout(req);
			res.status(200).json({ message: "Đã đăng xuất thành công." });
		} catch (error) {
			return next(error);
		}
	}
};

export default loginController;
