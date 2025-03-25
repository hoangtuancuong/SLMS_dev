import { ValidationError } from "sequelize";
import * as Yup from "yup";
import additionalTeacherDataDto from "../dto/additional_teacher_data.dto.js";
import additionalStudentDataDto from "../dto/additional_student_data.dto.js";
import tagDto from "../dto/tag.dto.js";
import userDto from "../dto/user.dto.js";
import { connection } from "../services/sequelize.service.js";
import { BadRequestError } from "../utils/ApiError.js";
import { GENDER, ROLE, TAG_TYPE } from "../utils/const.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

let userController = {
	register: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			name: YUP_UTILS.string("name").required("Cần phải có `name`."),
			email: YUP_UTILS.string("email").email("Email không hợp lệ.").required("Cần phải có `email`."),
			password: YUP_UTILS.string("password")
				.min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
				.required("Cần phải có `password`."),
			phone_number: YUP_UTILS.string("phone_number").length(10, "Số điện thoại phải có 10 số."),
			date_of_birth: YUP_UTILS.date("date_of_birth").required("Cần phải có `date_of_birth`."),
			gender: YUP_UTILS.string("gender")
				.oneOf(GENDER.values, "`gender` phải là một trong các giá trị sau: " + GENDER.values + ".")
				.required("Cần phải có `gender`."),
			address: YUP_UTILS.string("address"),
			additional_student_data: YUP_UTILS.object({
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
			})
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const user = await userDto.create({ ...req.body, is_thaiphien: false }, transaction);
			if (req.body.additional_student_data.user_id) {
				/// ROLE.ADMIN is used to bypass the check for the user_id, f*cking illegal
				await additionalStudentDataDto.create(
					req.body.additional_student_data,
					user.id,
					ROLE.ADMIN,
					transaction
				);
			}
			await transaction.commit();
			return res.status(200).json({ message: "Đăng ký tài khoản thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	addByAdmin: async (req, res, next) => {
		if (req.body.portfolio) {
			try {
				req.body.portfolio = JSON.stringify(req.body.portfolio);
			} catch {
				return next(new ValidationError("`portfolio` phải là một đối tượng JSON hợp lệ."));
			}
		}

		const bodySchema = YUP_UTILS.body({
			name: YUP_UTILS.string("name").required("Cần phải có `name`."),
			email: YUP_UTILS.string("email").email("Email không đúng định dạng.").required("Cần phải có `email`."),
			password: YUP_UTILS.string("password")
				.min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
				.required("Cần phải có `password`."),
			phone_number: YUP_UTILS.string("phone_number").length(10, "Số điện thoại phải có 10 số."),
			role: YUP_UTILS.string("role")
				.oneOf(ROLE.values, "`role` phải là một trong các giá trị sau: " + ROLE.values)
				.required("Cần phải có `role`."),
			avatar_url: YUP_UTILS.string("avatar_url").url("`avatar_url` phải là URL."),
			is_thaiphien: YUP_UTILS.boolean("is_thaiphien").required("Cần phải có `is_thaiphien`."),
			gender: YUP_UTILS.string("gender")
				.oneOf(GENDER.values, "`gender` phải là một trong các giá trị sau: " + GENDER.values + ".")
				.required("Cần phải có `gender`."),
			address: YUP_UTILS.string("address"),

			// STUDENT-REQUIRED FIELDS
			date_of_birth: YUP_UTILS.date("date_of_birth").when("role", (role, field) => {
				return role[0] === ROLE.STUDENT ? field.required("Cần phải có `date_of_birth`.") : field;
			}),

			// TEACHER-ONLY FIELDS
			subject_id: YUP_UTILS.number("subject_id").when("role", (role, field) => {
				return role[0] === ROLE.TEACHER ? field.required("Cần phải có `subject_id`.") : field.strip();
			}),
			portfolio: YUP_UTILS.string("portfolio").when("role", (role, field) => {
				return role[0] === ROLE.TEACHER ? field : field.strip();
			})
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Phải có ít nhất một trường được cập nhật.", (value) => {
			return Object.keys(value).length > 0;
		});

		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const subject_id = req.body.subject_id;
			delete req.body.subject_id;
			const user = await userDto.createByAdmin(req.body, transaction);
			// ID Generation logic
			if (req.body.role === ROLE.TEACHER) {
				const subject = await tagDto.findById(subject_id, transaction);
				if (subject.type !== TAG_TYPE.SUBJECT) {
					throw new BadRequestError("`subject_id` không hợp lệ.");
				}

				let createData = { user_id: user.id, subject_id: subject_id };
				if (req.body.portfolio) {
					createData.portfolio = req.body.portfolio;
				}
				await additionalTeacherDataDto.create(createData, transaction);

				const total = await additionalTeacherDataDto.total({ subject_id: subject_id }, transaction);
				await userDto.update(
					{
						code: `${subject.code_fragment}.GV.${total + 1}`,
						is_thaiphien: req.body.is_thaiphien
					},
					user.id,
					transaction
				);
			} else if (req.body.role === ROLE.STUDENT) {
				await userDto.update(
					{ code: `HS${req.body.is_thaiphien ? "TP" : ""}.${user.date_of_birth.getFullYear()}.${user.id}` },
					user.id,
					transaction
				);
			}
			// End of ID Generation logic
			await transaction.commit();
			return res.status(200).json({ message: "Tạo tài khoản thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	updateByAdmin: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
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
			name: YUP_UTILS.string("name"),
			email: YUP_UTILS.string("email").email("Email không đúng định dạng."),
			phone_number: YUP_UTILS.string("phone_number").length(10, "Số điện thoại phải có 10 số."),
			role: YUP_UTILS.string("role").oneOf(
				ROLE.values,
				"`role` phải là một trong các giá trị sau: " + ROLE.values
			),
			avatar_url: YUP_UTILS.string("avatar_url").url("`avatar_url` phải là URL."),
			is_thaiphien: YUP_UTILS.boolean("is_thaiphien"),
			gender: YUP_UTILS.string("gender").oneOf(
				GENDER.values,
				"`gender` phải là một trong các giá trị sau: " + GENDER.values + "."
			),
			address: YUP_UTILS.string("address"),
			date_of_birth: YUP_UTILS.date("date_of_birth"),

			// TEACHER-ONLY FIELDS
			subject_id: YUP_UTILS.number("subject_id"),
			portfolio: YUP_UTILS.string("portfolio")
		});

		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			let user = await userDto.find(req.params.id, transaction);
			if (!user) {
				throw new BadRequestError("Không tìm thấy tài khoản có id là " + req.params.id + ".");
			}

			const subject_id = req.body.subject_id;
			const portfolio = req.body.portfolio;
			delete req.body.subject_id;
			delete req.body.portfolio;
			user = await userDto.update(req.body, req.params.id, transaction);

			if (user.role === ROLE.TEACHER) {
				if (subject_id) {
					const subject = await tagDto.findById(subject_id, transaction);
					if (subject.type !== TAG_TYPE.SUBJECT) {
						throw new BadRequestError("`subject_id` không hợp lệ.");
					}
				}

				let updateData = {};
				if (portfolio) updateData.portfolio = portfolio;
				if (subject_id) updateData.subject_id = subject_id;

				const additionalTeacherData = await additionalTeacherDataDto.findById(user.id, transaction);
				await additionalTeacherDataDto.update(additionalTeacherData, updateData, transaction);
				await userDto.update({ is_thaiphien: req.body.is_thaiphien }, user.id, transaction);
			} else if (user.role === ROLE.STUDENT) {
				// Add STUDENT-ONLY MODIFICATIONS HERE (Not have any modifications yet)
			}
			await transaction.commit();
			return res.status(200).json({ message: "Chỉnh sửa tài khoản thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	get: async (req, res, next) => {
		let querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				name: YUP_UTILS.string("name"),
				email: YUP_UTILS.string("email").email("Email không đúng định dạng."),
				role: YUP_UTILS.string("role").oneOf(
					ROLE.values,
					"`role` phải là một trong các giá trị sau: " + ROLE.values + "."
				),
				phone_number: YUP_UTILS.string("phone_number"),
				date_of_birth: YUP_UTILS.date("date_of_birth"),
				gender: YUP_UTILS.string("gender").oneOf(
					GENDER.values,
					"`gender` phải là một trong các giá trị sau: " + GENDER.values + "."
				),
				code: YUP_UTILS.string("code")
			}),

			sort: YUP_UTILS.object({
				name: YUP_UTILS.sort("name"),
				email: YUP_UTILS.sort("email"),
				role: YUP_UTILS.sort("role"),
				phone_number: YUP_UTILS.sort("phone_number"),
				date_of_birth: YUP_UTILS.sort("date_of_birth")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await userDto.getAll(req.query, transaction);
			await transaction.commit();
			data.data = data.data.map((user) => {
				user = user.toJSON();
				if (user.role === ROLE.TEACHER) {
					delete user.additional_student_data;
					if (user.additional_teacher_data)
						user.additional_teacher_data.portfolio = JSON.parse(
							user.additional_teacher_data.portfolio || "{}"
						);
				} else if (user.role === ROLE.STUDENT) {
					delete user.additional_teacher_data;
				} else {
					delete user.additional_student_data;
					delete user.additional_teacher_data;
				}
				return user;
			});
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getMyInfo: async (req, res, next) => {
		const transaction = await connection.transaction();
		try {
			let user = await userDto.find(req.userId, transaction);
			await transaction.commit();
			user = user.toJSON();
			if (user.role === ROLE.TEACHER) {
				delete user.additional_student_data;
				if (user.additional_teacher_data)
					user.additional_teacher_data.portfolio = JSON.parse(user.additional_teacher_data.portfolio || "{}");
			} else if (user.role === ROLE.STUDENT) {
				delete user.additional_teacher_data;
			} else {
				delete user.additional_student_data;
				delete user.additional_teacher_data;
			}
			return res.status(200).json(user);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	find: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.params({
			id: YUP_UTILS.number("id").required("Cần phải có `id`.")
		});
		try {
			req.params = await paramsSchema.validate(req.params);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			let user = await userDto.find(req.params.id, transaction);
			await transaction.commit();
			user = user.toJSON();
			if (user.role === ROLE.TEACHER) {
				delete user.additional_student_data;
				if (user.additional_teacher_data)
					user.additional_teacher_data.portfolio = JSON.parse(user.additional_teacher_data.portfolio || "{}");
			} else if (user.role === ROLE.STUDENT) {
				delete user.additional_teacher_data;
			} else {
				delete user.additional_student_data;
				delete user.additional_teacher_data;
			}
			return res.status(200).json(user);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	changePassword: async (req, res, next) => {
		const schema = YUP_UTILS.body({
			old_password: YUP_UTILS.string("old_password")
				.min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
				.required("Cần phải có `old_password`."),
			password: YUP_UTILS.string("password")
				.min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
				.when("old_password", (old_password, field) =>
					old_password ? field.required("Cần phải có `password`.") : field
				),
			confirm_password: YUP_UTILS.string("confirm_password").when("password", (password, field) =>
				password
					? field
							.required("Cần phải có `confirm_password`.")
							.oneOf([Yup.ref("password")], "`confirm_password` không đúng.")
					: field
			)
		});
		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			await userDto.changePassword(req.body, req.userId, transaction);
			await transaction.commit();
			return res.status(200).json({ message: "Cập nhật mật khẩu thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	// Sussy api
	delete: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			await userDto.delete(req.params.id, transaction);
			await transaction.commit();
			return res.status(200).json({ message: "Xóa người dùng thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	update: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			name: YUP_UTILS.string("name"),
			phone_number: YUP_UTILS.string("phone_number").length(10, "Số điện thoại phải có 10 số."),
			date_of_birth: YUP_UTILS.date("date_of_birth"),
			address: YUP_UTILS.string("address")
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Phải có ít nhất một trường được cập nhật.", (value) => {
			return Object.keys(value).length > 0;
		});

		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await userDto.update(req.body, req.userId, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	bulkStudentCreate: async (req, res, next) => {
		const bodySchem = YUP_UTILS.body({
			student_data: Yup.array().of(
				YUP_UTILS.object({
					name: YUP_UTILS.string("name").required("Cần phải có `name`."),
					email: YUP_UTILS.string("email").email("Email không hợp lệ.").required("Cần phải có `email`."),
					phone_number: YUP_UTILS.string("phone_number")
						.length(10, "Số điện thoại phải có 10 số.")
						.required("Cần phải có `phone_number`."),
					date_of_birth: YUP_UTILS.date("date_of_birth").required("Cần phải có `date_of_birth`."),
					gender: YUP_UTILS.string("gender")
						.oneOf(GENDER.values, "`gender` phải là một trong các giá trị sau: " + GENDER.values + ".")
						.required("Cần phải có `gender`."),
					address: YUP_UTILS.string("address"),
					is_thaiphien: YUP_UTILS.boolean("is_thaiphien").required("Cần phải có `is_thaiphien`."),
					first_contact_name: YUP_UTILS.string("first_contact_name").required(
						"Cần phải có `first_contact_name`."
					),
					first_contact_tel: YUP_UTILS.string("first_contact_tel")
						.length(10, "Số điện thoại phải có 10 số.")
						.required("Cần phải có `first_contact_tel`."),
					second_contact_name: YUP_UTILS.string("second_contact_name"),
					second_contact_tel: YUP_UTILS.string("second_contact_tel").length(
						10,
						"Số điện thoại phải có 10 số."
					),
					homeroom_teacher_id: YUP_UTILS.number("homeroom_teacher_id"),
					cccd: YUP_UTILS.string("cccd"),
					class: YUP_UTILS.string("class"),
					school: YUP_UTILS.string("school")
				})
			)
		});

		try {
			req.body = await bodySchem.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const result = await userDto.bulkStudentCreate(req.body.student_data, transaction);
			if (result.status === "FAIL") {
				await transaction.rollback();
				return next(new BadRequestError(result.message));
			}
			await transaction.commit();
			return res.status(200).json(result);
		} catch (error) {
			console.log(error);
			await transaction.rollback();
			return next(error);
		}
	}
};

export default userController;
