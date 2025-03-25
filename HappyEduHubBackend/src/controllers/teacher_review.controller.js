import teacherReviewDto from "../dto/teacher_review.dto.js";
import { connection } from "../services/sequelize.service.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

let teacherReviewController = {
	create: async (req, res, next) => {
		let bodySchema = YUP_UTILS.body({
			teacher_id: YUP_UTILS.number("teacher_id").required("Cần phải có `teacher_id`."),
			rate: YUP_UTILS.rate("rate").required("Cần phải có `rate`."),
			description: YUP_UTILS.string("description").required("Cần phải có `description`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			await teacherReviewDto.create({ ...req.body, student_id: req.userId }, transaction);
			await transaction.commit();
			return res.status(200).json({
				message: "Đánh giá giáo viên thành công."
			});
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
				rate: YUP_UTILS.rate("rate"),
				from_created_at: YUP_UTILS.date("from_created_at"),
				to_created_at: YUP_UTILS.date("to_created_at")
			}),
			sort: YUP_UTILS.object({
				rate: YUP_UTILS.sort("rate"),
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
			const data = await teacherReviewDto.get(req.params.id, req.query, req.role, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	getById: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await teacherReviewDto.getById(req.params.id, req.role, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	getMyReview: async (req, res, next) => {
		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				rate: YUP_UTILS.rate("rate"),
				from_created_at: YUP_UTILS.date("from_created_at"),
				to_created_at: YUP_UTILS.date("to_created_at")
			}),
			sort: YUP_UTILS.object({
				rate: YUP_UTILS.sort("rate"),
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
			const data = await teacherReviewDto.getMyReview(req.userId, req.query, req.role, transaction);
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

		let bodySchema = YUP_UTILS.body({
			rate: YUP_UTILS.rate("rate"),
			description: YUP_UTILS.string("description")
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
			const data = await teacherReviewDto.update({ ...req.body, id: req.params.id }, req.userId, transaction);
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
			await teacherReviewDto.delete(req.params.id, req.userId, transaction);
			await transaction.commit();
			return res.status(200).json({ message: "Xóa đánh giá giáo viên thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default teacherReviewController;
