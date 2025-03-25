import examDto from "../dto/exam.dto.js";
import { connection } from "../services/sequelize.service.js";
import { EXAM_TYPE } from "../utils/const.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

let examController = {
	create: async (req, res, next) => {
		const schema = YUP_UTILS.body({
			drive_url: YUP_UTILS.string("drive_url"),
			key: YUP_UTILS.string("key"),
			is_private: YUP_UTILS.boolean("is_private").required("Cần phải có `is_private`."),
			name: YUP_UTILS.string("name").required("Cần phải có `name`."),
			content: YUP_UTILS.string("content"),
			note: YUP_UTILS.string("note"),
			exam_type: YUP_UTILS.string("exam_type")
				.required("Cần phải có `exam_type`.")
				.oneOf(EXAM_TYPE.values, "`exam_type` cần phải là một trong các giá trị sau: " + EXAM_TYPE.values + ".")
		});
		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const exam = await examDto.create({ ...req.body, teacher_id: req.userId }, transaction);
			await transaction.commit();
			return res.status(200).json(exam);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	findAll: async (req, res, next) => {
		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				name: YUP_UTILS.string("name"),
				from_created_at: YUP_UTILS.date("from_created_at"),
				to_created_at: YUP_UTILS.date("to_created_at"),
				is_private: YUP_UTILS.boolean("is_private"),
				teacher_id: YUP_UTILS.number("teacher_id"),
				exam_type: YUP_UTILS.string("exam_type").oneOf(
					EXAM_TYPE.values,
					"`exam_type` cần phải là một trong các giá trị sau: " + EXAM_TYPE.values + "."
				)
			}),
			sort: YUP_UTILS.object({
				created_at: YUP_UTILS.sort("created_at")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await examDto.findAll(req.query, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	findAllPublicExam: async (req, res, next) => {
		let querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				name: YUP_UTILS.string("name"),
				from_created_at: YUP_UTILS.date("from_created_at"),
				to_created_at: YUP_UTILS.date("to_created_at"),
				teacher_id: YUP_UTILS.number("teacher_id"),
				exam_type: YUP_UTILS.string("exam_type").oneOf(
					EXAM_TYPE.values,
					"`exam_type` cần phải là một trong các giá trị sau: " + EXAM_TYPE.values + "."
				)
			}),
			sort: YUP_UTILS.object({
				created_at: YUP_UTILS.sort("created_at")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await examDto.findAllPublicExam(req.query, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	findMyExam: async (req, res, next) => {
		let querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				name: YUP_UTILS.string("name"),
				from_created_at: YUP_UTILS.date("from_created_at"),
				to_created_at: YUP_UTILS.date("to_created_at"),
				is_private: YUP_UTILS.boolean("is_private"),
				exam_type: YUP_UTILS.string("exam_type").oneOf(
					EXAM_TYPE.values,
					"`exam_type` cần phải là một trong các giá trị sau: " + EXAM_TYPE.values + "."
				)
			}),

			sort: YUP_UTILS.object({
				created_at: YUP_UTILS.sort("created_at")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await examDto.findMyExam(req.query, req.userId, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getExamById: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const exam = await examDto.findById(req.params.id, transaction);
			await transaction.commit();
			return res.status(200).json(exam);
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

		const bodySchema = YUP_UTILS.body({
			drive_url: YUP_UTILS.string("drive_url"),
			key: YUP_UTILS.string("key"),
			name: YUP_UTILS.string("name"),
			is_private: YUP_UTILS.boolean("is_private"),
			teacher_id: YUP_UTILS.number("teacher_id"),
			content: YUP_UTILS.string("content"),
			note: YUP_UTILS.string("note"),
			exam_type: YUP_UTILS.string("exam_type").oneOf(
				EXAM_TYPE.values,
				"`exam_type` cần phải là một trong các giá trị sau: " + EXAM_TYPE.values + "."
			)
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
			const { id } = req.params;
			const exam = await examDto.update(id, req.body, req.userId, req.role, transaction);
			await transaction.commit();
			return res.status(200).json(exam);
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
			await examDto.delete(req.params.id, req.userId, req.role, transaction);
			await transaction.commit();
			return res.status(200).json({ message: "Đã xóa bài test thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default examController;
