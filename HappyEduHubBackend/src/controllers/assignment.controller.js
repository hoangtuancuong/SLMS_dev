import { connection } from "../services/sequelize.service.js";
import { ASSIGNMENT_TYPE, ROLE } from "../utils/const.js";
import assignmentDto from "../dto/assignment.dto.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";
import { UnauthorizedError } from "../utils/ApiError.js";

const assignmentController = {
	create: async (req, res, next) => {
		const schema = YUP_UTILS.body({
			course_id: YUP_UTILS.number("course_id").required("Cần phải có `course_id`."),
			exam_id: YUP_UTILS.number("exam_id").required("Cần phải có `exam_id`."),
			name: YUP_UTILS.string("name").required("Cần phải có `name`."),
			assignment_type: YUP_UTILS.string("assignment_type")
				.oneOf(
					ASSIGNMENT_TYPE.values,
					"`assignment_type` cần phải là một trong các giá trị sau: " + ASSIGNMENT_TYPE.values + "."
				)
				.required("Cần phải có `assignment_type`."),
			note: YUP_UTILS.string("note"),
			start_time: YUP_UTILS.date("start_time"),
			end_time: YUP_UTILS.date("end_time")
		});
		try {
			req.body = await schema.validate(req.body, { abortEarly: false });
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await assignmentDto.create(req.body, req.userId, transaction, req.role === ROLE.ADMIN);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	get: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				name: YUP_UTILS.string("name"),
				from_start_time: YUP_UTILS.date("from_start_time"),
				to_start_time: YUP_UTILS.date("to_start_time"),
				from_end_time: YUP_UTILS.date("from_end_time"),
				to_end_time: YUP_UTILS.date("to_end_time"),
				from_created_at: YUP_UTILS.date("from_created_at"),
				to_created_at: YUP_UTILS.date("to_created_at"),
				assignment_type: YUP_UTILS.string("assignment_type").oneOf(
					ASSIGNMENT_TYPE.values,
					"`assignment_type` cần phải là một trong các giá trị sau: " + ASSIGNMENT_TYPE.values + "."
				)
			}),
			sort: YUP_UTILS.object({
				created_at: YUP_UTILS.sort("created_at"),
				start_time: YUP_UTILS.sort("start_time"),
				end_time: YUP_UTILS.sort("end_time")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await assignmentDto.get(req.params.id, req.query, req.userId, req.role, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	update: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const schema = YUP_UTILS.body({
			name: YUP_UTILS.string("name"),
			exam_id: YUP_UTILS.number("exam_id"),
			assignment_type: YUP_UTILS.string("assignment_type").oneOf(
				ASSIGNMENT_TYPE.values,
				"`assignment_type` cần phải là một trong các giá trị sau: " + ASSIGNMENT_TYPE.values + "."
			),
			note: YUP_UTILS.string("note"),
			start_time: YUP_UTILS.date("start_time"),
			end_time: YUP_UTILS.date("end_time")
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Ít nhất một trường là bắt buộc.", (value) => {
			return Object.keys(value).length > 0;
		});
		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			if (
				!(req.role === ROLE.TEACHER && req.body.assignment_type === ASSIGNMENT_TYPE.EXCERCISE) &&
				!(req.role === ROLE.ACADEMIC_AFFAIR && req.body.assignment_type === ASSIGNMENT_TYPE.EXAM)
			) {
				throw new UnauthorizedError("Bạn không có quyền cập nhật bài kiểm tra này.");
			}
			const data = await assignmentDto.update(req.params.id, req.body, req.userId, req.role, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	delete: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			await assignmentDto.delete(req.params.id, req.userId, req.role, transaction);
			await transaction.commit();
			return res.status(200).json({ message: "Đã xóa bài kiểm tra thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getDetail: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await assignmentDto.getDetail(req.params.id, req.userId, req.role, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getMyAssignment: async (req, res, next) => {
		const transaction = await connection.transaction();
		try {
			const userId = req.userId;
			const data = await assignmentDto.getMyAssignment(userId, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default assignmentController;
