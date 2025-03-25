import * as Yup from "yup";

import additionalTeacherDataDto from "../dto/additional_teacher_data.dto.js";
import { connection } from "../services/sequelize.service.js";
import { BadRequestError, ValidationError } from "../utils/ApiError.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

let additionalTeacherDataController = {
	create: async (req, res, next) => {
		const idParams = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idParams.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		if (req.body.portfolio) {
			try {
				req.body.portfolio = JSON.stringify(req.body.portfolio);
			} catch {
				return next(new ValidationError("`portfolio` phải là một đối tượng JSON hợp lệ."));
			}
		}

		const bodySchema = YUP_UTILS.body({
			subject_id: YUP_UTILS.number("subject_id").required("Cần có `subject_id`"),
			portfolio: Yup.string().typeError("`portfolio` phải là stringify object.").required("Cần có `portfolio`")
		});
		try {
			req.body = await bodySchema.validate(req.body, { abortEarly: false });
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const params = {
				user_id: req.params.id,
				...req.body
			};
			const data = await additionalTeacherDataDto.create(params, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	update: async (req, res, next) => {
		const idParams = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idParams.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		if (req.body.portfolio) {
			try {
				req.body.portfolio = JSON.stringify(req.body.portfolio);
			} catch {
				return next(new ValidationError("`portfolio` phải là một đối tượng JSON hợp lệ."));
			}
		}

		const bodySchema = YUP_UTILS.body({
			subject_id: YUP_UTILS.number("subject_id"),
			portfolio: Yup.string().typeError("`portfolio` phải là stringify object.")
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Ít nhất một trường là bắt buộc.", (value) => {
			return Object.keys(value).length > 0;
		});
		try {
			req.body = await bodySchema.validate(req.body, { abortEarly: false });
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const oldData = await additionalTeacherDataDto.findById(req.params.id, transaction);
			if (!oldData) {
				await transaction.rollback();
				return next(
					new BadRequestError("Không tìm thấy AdditionalTeacherData có id là " + req.params.id + ".")
				);
			}
			const data = await additionalTeacherDataDto.update(oldData, req.body, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default additionalTeacherDataController;
