import { connection } from "../services/sequelize.service.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";
import scoreDto from "../dto/score.dto.js";
import * as Yup from "yup";

const scoreController = {
	create: async (req, res, next) => {
		const schema = YUP_UTILS.body({
			assignment_id: YUP_UTILS.number("assignment_id").required("Cần phải có `assignment_id`."),
			user_id: YUP_UTILS.number("user_id").required("Cần phải có `user_id`."),
			score: YUP_UTILS.number("score").required("Cần phải có `score`.")
		});
		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			await scoreDto.checkPermission(req.userId, req.role, req.body.assignment_id, transaction);
			const score = await scoreDto.create(req.body, transaction);
			await transaction.commit();
			res.status(200).json(score);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	batchCreate: async (req, res, next) => {
		const schema = YUP_UTILS.body({
			assignment_id: YUP_UTILS.number("assignment_id").required("Cần phải có `assignment_id`."),
			score_data: Yup.array()
				.of(
					YUP_UTILS.object({
						user_id: YUP_UTILS.number("user_id").required("`user_id` không được để trống"),
						score: YUP_UTILS.number("score").required("`score` không được để trống")
					})
				)
				.required("`score_data` không được để trống")
		});

		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			await scoreDto.checkPermission(req.userId, req.role, req.body.assignment_id, transaction);
			await scoreDto.batchCreate(req.body, transaction);
			await transaction.commit();
			res.status(200).json({ message: "Điểm đã được cập nhật thành công" });
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
			score: YUP_UTILS.number("score").required("Cần phải có `score`."),
			note: YUP_UTILS.string("note").required("Cần phải có `note`.")
		});
		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			await scoreDto.checkPermission(req.userId, req.role, req.params.id, transaction);
			const score = await scoreDto.update(req.params.id, req.body, transaction);
			await transaction.commit();
			res.status(200).json(score);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getByAssignmentId: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await scoreDto.getByAssignmentId(req.params.id, transaction);
			await transaction.commit();
			res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getByCourseIdAndUserId: async (req, res, next) => {
		const courseSchema = YUP_UTILS.number("courseId").required("Cần phải có `courseId`.");
		const userSchema = YUP_UTILS.number("userId").required("Cần phải có `userId`.");
		try {
			req.params.courseId = await courseSchema.validate(req.params.courseId);
			req.params.userId = await userSchema.validate(req.params.userId);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const data = await scoreDto.getByCourseIdAndUserId(req.params.courseId, req.params.userId, transaction);
			await transaction.commit();
			res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default scoreController;
