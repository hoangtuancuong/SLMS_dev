import Yup from "yup";

import courseDto from "../dto/course.dto.js";
import courseMemberDto from "../dto/course_member.dto.js";
import userDto from "../dto/user.dto.js";
import { connection } from "../services/sequelize.service.js";
import { BadRequestError, NotFoundError } from "../utils/ApiError.js";
import { MEMBER_STATUS, ROLE } from "../utils/const.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

const memberController = {
	checkEnroll: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const member = await courseMemberDto.findByCourseIdAndUserId(
				{ course_id: req.params.id, user_id: req.userId },
				transaction
			);
			if (member) {
				await transaction.rollback();
				return next(new BadRequestError("Bạn đã đăng ký khóa học này."));
			}
			await transaction.commit();
			res.status(200).json({ message: "Bạn chưa đăng ký khóa học này." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	
	enroll: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			let course = await courseDto.findById(req.params.id, transaction);
			if (course.is_private) {
				await transaction.rollback();
				return next(new BadRequestError("Không thể đăng ký khóa học này."));
			}
			if (!course.is_approved) {
				await transaction.rollback();
				return next(new BadRequestError("Không thể thêm thành viên vào khóa học đang chờ duyệt."));
			}

			let member = await courseMemberDto.findByCourseIdAndUserId(
				{ course_id: req.params.id, user_id: req.userId },
				transaction
			);
			if (member && member.status !== MEMBER_STATUS.REJECTED) {
				await transaction.rollback();
				return next(new BadRequestError("Bạn đã đăng ký khóa học này."));
			}

			if (member) {
				await courseMemberDto.update(member, { status: MEMBER_STATUS.PENDING }, transaction);
			} else {
				await courseMemberDto.create(
					{ course_id: req.params.id, user_id: req.userId, status: MEMBER_STATUS.PENDING },
					transaction
				);
			}
			await transaction.commit();
			res.status(200).json({ message: "Đã gửi yêu cầu tham gia khóa học." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	reviewEnrollRequest: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			ids: Yup.array().of(YUP_UTILS.number("ids")).min(1).required("Cần phải có `ids`."),
			status: YUP_UTILS.string("status")
				.oneOf(MEMBER_STATUS.values, `\`status\` phải là một trong các giá trị sau: ${MEMBER_STATUS.values}`)
				.required("Cần phải có `status`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			for (const id of req.body.ids) {
				const member = await courseMemberDto.findById(id, transaction);
				if (!member) {
					await transaction.rollback();
					return next(new NotFoundError("Không tìm thấy thành viên."));
				} else if (member.status !== MEMBER_STATUS.PENDING) {
					await transaction.rollback();
					return next(new BadRequestError("Không thể cập nhật trạng thái của thành viên đã được chấp nhận hoặc từ chối."));
				}
				await courseMemberDto.updateStatus(id, req.body.status, transaction);
			}
			await transaction.commit();
			res.status(200).json({ message: "Đã cập nhật trạng thái các thành viên." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getEnrollRequest: async (req, res, next) => {
		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				email: YUP_UTILS.string("email"),
				code: YUP_UTILS.string("code"),
				name: YUP_UTILS.string("name"),
				course_id: YUP_UTILS.number("course_id"),
				course_name: YUP_UTILS.string("course_name"),
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await courseMemberDto.findAllRequest(req.query, transaction);
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	bulkAdd: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const bodySchema = YUP_UTILS.body({
			user_ids: Yup.array().of(YUP_UTILS.number("user_ids")).min(1).required("Cần phải có `user_ids`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const course = await courseDto.findById(req.params.id, transaction);
			if (!course) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy khóa học."));
			}

			for (const user_id of req.body.user_ids) {
				const user = await userDto.find(user_id, transaction);
				if (!user) {
					await transaction.rollback();
					return next(new NotFoundError(`Không tìm thấy người dùng ${user_id}.`));
				}

				const member = await courseMemberDto.findByCourseIdAndUserId(
					{ course_id: req.params.id, user_id },
					transaction
				);
				if (member) {
					await transaction.rollback();
					return next(new BadRequestError(`Người dùng ${user_id} đã đăng ký khóa học này.`));
				}

				await courseMemberDto.create({ course_id: req.params.id, user_id, status: MEMBER_STATUS.APPROVED }, transaction);
			}
			await transaction.commit();
			res.status(200).json({ message: "Đã thêm thành viên." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	findNotMembersByCourseId: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const querySchema = YUP_UTILS.query({
			filter: YUP_UTILS.object({
				email: YUP_UTILS.string("email"),
				code: YUP_UTILS.string("code"),
				name: YUP_UTILS.string("name"),
				role: YUP_UTILS.string("role").oneOf(
					ROLE.values,
					`\`role\` phải là một trong các giá trị sau: ${ROLE.values}`
				),
				status: YUP_UTILS.string("status")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const users = await userDto.findAll({ filter: req.query.filter }, transaction);
			const members = await courseMemberDto.findAllByCourseId(req.params.id, transaction);
			const result = [];
			for (const user of users) {
				const member = members.find((member) => member.user_id === user.id);
				if (!member) {
					result.push({ user, status: null });
				} else {
					result.push({ user, status: member.status });
				}
			}
			await transaction.commit();
			res.status(200).json(
				req.query.filter.status !== undefined
					? result.filter((item) =>
						req.query.filter.status === "NOT_ENROLLED"
							? item.status === null
							: item.status === req.query.filter.status
					)
					: result
			);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	findMembersByCourseId: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				status: YUP_UTILS.string("status").oneOf(
					MEMBER_STATUS.values,
					`\`status\` phải là một trong các giá trị sau: ${MEMBER_STATUS.values}`
				),
				role: YUP_UTILS.string("role").oneOf(
					ROLE.values,
					`\`role\` phải là một trong các giá trị sau: ${ROLE.values}`
				)
			}),
			pageNoLimit: YUP_UTILS.boolean("pageNoLimit")
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const members = await courseMemberDto.findByCourseId(req.params.id, req.query, transaction);
			const total = await courseMemberDto.totalByCourseId(
				req.params.id,
				{ filter: req.query.filter },
				transaction
			);
			await transaction.commit();

			const response = {
				data: members
			};

			if (!req.query.pageNoLimit) {
				response.meta = {
					limit: req.query.limit,
					offset: req.query.offset,
					total
				};
			}
			res.status(200).json(response);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	create: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			course_id: YUP_UTILS.number("course_id").required("Cần phải có `course_id`."),
			user_id: YUP_UTILS.number("user_id").required("Cần phải có `user_id`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		let course;
		let user;
		const transaction = await connection.transaction();
		try {
			course = await courseDto.findById(req.body.course_id, transaction);
			if (!course) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy khóa học."));
			}
			if (!course.is_approved) {
				await transaction.rollback();
				return next(new BadRequestError("Không thể thêm thành viên vào khóa học đang chờ duyệt."));
			}
			user = await userDto.find(req.body.user_id, transaction);

			if (!user) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy người dùng."));
			}
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}

		try {
			const status =
				req.role === ROLE.ADMIN
					? MEMBER_STATUS.APPROVED
					: course.is_private
						? MEMBER_STATUS.APPROVED
						: MEMBER_STATUS.PENDING;
			const member = await courseMemberDto.create({ ...req.body, status }, transaction);
			await transaction.commit();
			res.status(200).json(member);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	update: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const bodySchema = YUP_UTILS.body({
			status: YUP_UTILS.string("status").oneOf(
				MEMBER_STATUS.values,
				`\`status\` phải là một trong các giá trị sau: ${MEMBER_STATUS.values}`
			)
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			let member = await courseMemberDto.findById(req.params.id, transaction);
			if (!member) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy thành viên."));
			}
			member = await courseMemberDto.update(member, { status: req.body.status }, transaction);
			await transaction.commit();
			res.status(200).json(member);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	delete: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			await courseMemberDto.delete(req.params.id, transaction);
			await transaction.commit();
			res.status(200).json({ message: "Đã xóa thành viên." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	review: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			ids: Yup.array().of(YUP_UTILS.number("ids")).min(1).required("Cần phải có `ids`."),
			status: YUP_UTILS.string("status")
				.oneOf(MEMBER_STATUS.values, `\`status\` phải là một trong các giá trị sau: ${MEMBER_STATUS.values}`)
				.required("Cần phải có `status`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			for (const id of req.body.ids) {
				const member = await courseMemberDto.findById(id, transaction);
				if (!member) {
					await transaction.rollback();
					return next(new NotFoundError("Không tìm thấy thành viên."));
				} else if (member.status !== MEMBER_STATUS.PENDING) {
					await transaction.rollback();
					return next(new BadRequestError("Không thể cập nhật trạng thái của thành viên đã được chấp nhận."));
				}
				await courseMemberDto.update(member, { status: req.body.status }, transaction);
			}
			await transaction.commit();
			res.status(200).json({ message: "Đã cập nhật trạng thái các thành viên." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	bulkDelete: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const bodySchema = YUP_UTILS.body({
			ids: Yup.array().of(YUP_UTILS.number("ids")).min(1).required("Cần phải có `ids`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			for (const id of req.body.ids) {
				await courseMemberDto.delete(id, transaction);
			}
			await transaction.commit();
			res.status(200).json({ message: "Đã xóa các thành viên." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default memberController;
