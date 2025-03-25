import additionalStudentDataDto from "../dto/additional_student_data.dto.js";
import { connection } from "../services/sequelize.service.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

let additionalStudentDataController = {
	create: async (req, res, next) => {
		const idParams = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idParams.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		// ARCANE STUFF
		const bodySchema = YUP_UTILS.body({
			first_contact_name: YUP_UTILS.string("first_contact_name"),
			first_contact_tel: YUP_UTILS.string("first_contact_tel").length(
				10,
				"Số điện thoại phải có đúng 10 chữ số."
			),
			second_contact_name: YUP_UTILS.string("second_contact_name").when(
				"first_contact_name",
				(first_contact_name, schema) =>
					first_contact_name
						? schema
						: schema.test(
								"SECOND_REQUIRES_FIRST_NAME",
								"Nếu có liên hệ thứ hai, liên hệ thứ nhất là bắt buộc.",
								(value) => !value
							)
			),
			second_contact_tel: YUP_UTILS.string("second_contact_tel")
				.length(10, "Số điện thoại phải có đúng 10 chữ số.")
				.when("first_contact_name", (first_contact_name, schema) =>
					first_contact_name
						? schema
						: schema.test(
								"SECOND_REQUIRES_FIRST_TEL",
								"Nếu có liên hệ thứ hai, liên hệ thứ nhất là bắt buộc.",
								(value) => !value
							)
				),
			cccd: YUP_UTILS.string("cccd"),
			class: YUP_UTILS.string("class"),
			school: YUP_UTILS.string("school")
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Ít nhất một trường là bắt buộc.", (value) => {
			return Object.values(value).some((val) => val);
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
			const data = await additionalStudentDataDto.create(params, req.userId, req.role, transaction);
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

		const bodySchema = YUP_UTILS.body({
			first_contact_name: YUP_UTILS.string("first_contact_name"),
			first_contact_tel: YUP_UTILS.string("first_contact_tel").length(
				10,
				"Số điện thoại phải có đúng 10 chữ số."
			),
			second_contact_name: YUP_UTILS.string("second_contact_name"),
			second_contact_tel: YUP_UTILS.string("second_contact_tel"),
			cccd: YUP_UTILS.string("cccd"),
			class: YUP_UTILS.string("class"),
			school: YUP_UTILS.string("school")
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Ít nhất một trường là bắt buộc.", (value) => {
			return Object.keys(value).length > 0;
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const params = {
				user_id: req.params.id,
				...req.body
			};
			const data = await additionalStudentDataDto.update(params, req.userId, req.role, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default additionalStudentDataController;
