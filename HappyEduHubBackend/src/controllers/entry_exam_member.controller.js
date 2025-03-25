import entryExamMemberDto from "../dto/entry_exam_member.dto.js";
import { connection } from "../services/sequelize.service.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";
import * as Yup from "yup";

const entryExamMemberController = {
	createMember: async (req, res, next) => {
		const schema = YUP_UTILS.object({
			user_id: YUP_UTILS.number("user_id").required("`user_id` không được để trống"),
			exam_id: YUP_UTILS.number("exam_id").required("`exam_id` không được để trống"),
			note: YUP_UTILS.string("note")
		});

		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const member = await entryExamMemberDto.create(req.body, transaction);
			await transaction.commit();
			return res.status(200).json(member);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getMembers: async (req, res, next) => {
		const schema = YUP_UTILS.object({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				user_id: YUP_UTILS.number("user_id"),
				user_name: YUP_UTILS.string("user_name"),
				from_created_at: YUP_UTILS.date("from_created_at"),
				to_created_at: YUP_UTILS.date("to_created_at"),
				from_updated_at: YUP_UTILS.date("from_updated_at"),
				to_updated_at: YUP_UTILS.date("to_updated_at")
			}),
			sort: YUP_UTILS.object({
				created_at: YUP_UTILS.sort("created_at"),
				updated_at: YUP_UTILS.sort("updated_at"),
				score: YUP_UTILS.sort("score")
			})
		});

		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");

		try {
			req.query = await schema.validate(req.query);
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const members = await entryExamMemberDto.getMembers(req.params.id, req.query, transaction);
			await transaction.commit();
			return res.status(200).json(members);
		} catch (error) {
			console.log(error);
			await transaction.rollback();
			return next(error);
		}
	},

	getMemberByUserId: async (req, res, next) => {
		const userIdParamsSchema = YUP_UTILS.number("user_id").required("Cần phải có `user_id`.");
		const examIdParamsSchema = YUP_UTILS.number("exam_id").required("Cần phải có `exam_id`.");
		try {
			req.params.userId = await userIdParamsSchema.validate(req.params.userId);
			req.params.examId = await examIdParamsSchema.validate(req.params.examId);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const member = await entryExamMemberDto.getMemberByUserId(
				req.params.userId,
				req.params.examId,
				transaction
			);
			await transaction.commit();
			return res.status(200).json(member);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	insertScore: async (req, res, next) => {
		const schema = YUP_UTILS.object({
			user_id: YUP_UTILS.number("user_id").required("`user_id` không được để trống"),
			exam_id: YUP_UTILS.number("exam_id").required("`exam_id` không được để trống"),
			score: YUP_UTILS.number("score").required("`score` không được để trống"),
			note: YUP_UTILS.string("note")
		});

		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const member = await entryExamMemberDto.insertScore(req.body, transaction);
			await transaction.commit();
			return res.status(200).json(member);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	insertScoreByArray: async (req, res, next) => {
		const schema = YUP_UTILS.object({
			exam_id: YUP_UTILS.number("exam_id").required("`exam_id` không được để trống"),
			score_data: Yup.array()
				.of(
					YUP_UTILS.object({
						user_id: YUP_UTILS.number("user_id").required("`user_id` không được để trống"),
						score: YUP_UTILS.number("score").required("`score` không được để trống"),
						note: YUP_UTILS.string("note")
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
			await entryExamMemberDto.insertScoreByArray(req.body, transaction);
			await transaction.commit();
			return res.status(200).json({ message: "Điểm đã được cập nhật thành công" });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	update: async (req, res, next) => {
		const schema = YUP_UTILS.object({
			user_id: YUP_UTILS.number("user_id").required("`user_id` không được để trống"),
			exam_id: YUP_UTILS.number("exam_id").required("`exam_id` không được để trống"),
			score: YUP_UTILS.number("score"),
			note: YUP_UTILS.string("note")
		});

		try {
			req.body = await schema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const member = await entryExamMemberDto.update(req.body, transaction);
			await transaction.commit();
			return res.status(200).json(member);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default entryExamMemberController;
