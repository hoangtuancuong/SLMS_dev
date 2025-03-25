import rollCallDto from "../dto/roll_call.dto.js";
import { connection } from "../services/sequelize.service.js";
import { ROLL_CALL_STATUS } from "../utils/const.js";
import { YUP_UTILS, catchValidationError } from "../utils/utils.js";

const rollCallController = {
	getByLessonId: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const data = await rollCallDto.getByLessonId(req.params.id, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getByCourseId: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const data = await rollCallDto.getByCourseId(req.params.id, transaction);
			await transaction.commit();
			return res.status(200).json(data);
		} catch (error) {
			console.log(error);
			await transaction.rollback();
			return next(error);
		}
	},

	create: async (req, res, next) => {
		const schema = YUP_UTILS.body({
			user_id: YUP_UTILS.number("user_id").required("Cần phải có `userId`."),
			lesson_id: YUP_UTILS.number("lesson_id").required("Cần phải có `lessonId`."),
			status: YUP_UTILS.string("status")
				.required("Cần phải có `status`.")
				.oneOf(
					ROLL_CALL_STATUS.values,
					"`status` cần phải là một trong các giá trị sau: " + ROLL_CALL_STATUS.values + "."
				),
			note: YUP_UTILS.string("note")
		});
		try {
			req.body = await schema.validate(req.body);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const rollCall = await rollCallDto.create(req.body, transaction);
			await transaction.commit();
			return res.status(200).json(rollCall);
		} catch (error) {
			console.log(error);
			await transaction.rollback();
			return next(error);
		}
	},

	update: async (req, res, next) => {
		const paramsSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		const bodySchema = YUP_UTILS.body({
			status: YUP_UTILS.string("status")
				.required("Cần phải có `status`.")
				.oneOf(
					ROLL_CALL_STATUS.values,
					"`status` cần phải là một trong các giá trị sau: " + ROLL_CALL_STATUS.values + "."
				),
			note: YUP_UTILS.string("note")
		});
		try {
			req.params.id = await paramsSchema.validate(req.params.id);
			req.body = await bodySchema.validate(req.body);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const rollCall = await rollCallDto.update(req.params.id, req.body, transaction);
			await transaction.commit();
			return res.status(200).json(rollCall);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default rollCallController;
