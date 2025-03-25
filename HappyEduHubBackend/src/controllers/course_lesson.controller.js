import * as Yup from "yup";

import { connection } from "../services/sequelize.service.js";
import courseLessonDto from "../dto/course_lesson.dto.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";
import { LESSON_STATUS } from "../utils/const.js";
import { NotFoundError, BadRequestError } from "../utils/ApiError.js";

const courseLessonController = {
	find: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const querySchema = YUP_UTILS.query({
			filter: YUP_UTILS.object({
				from_take_place_at: YUP_UTILS.date("from_take_place_at"),
				to_take_place_at: YUP_UTILS.date("to_take_place_at")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const lessons = await courseLessonDto.findAllLessonsByCourseId(req.params.id, req.query, transaction);
			const lessonsWithStatus = lessons.map((l) => {
				l.status = JSON.parse(l.status);
				return l;
			});
			await transaction.commit();
			res.status(200).json(lessonsWithStatus);
		} catch (error) {
			await transaction.rollback();
			next(error);
		}
	},

	update: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const bodySchema = YUP_UTILS.body({
			shift: YUP_UTILS.number("shift"),
			take_place_at: YUP_UTILS.date("take_place_at"),
			room: YUP_UTILS.string("room"),
			note: YUP_UTILS.string("note"),
			is_uncancel: YUP_UTILS.boolean("is_uncancel").default(false)
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			let lesson = await courseLessonDto.findLessonById(req.params.id, transaction);
			if (!lesson) {
				await transaction.rollback();
				return next(new NotFoundError("Tiết học không tồn tại."));
			} else if (lesson.status.includes(LESSON_STATUS.CANCELLED) && !req.body.is_uncancel) {
				await transaction.rollback();
				return next(new BadRequestError("Phải bỏ hủy tiết học trước."));
			}

			let newStatus = JSON.parse(lesson.status).filter(
				(status) => status !== LESSON_STATUS.NORMAL && status !== LESSON_STATUS.CANCELLED
			);
			if (req.body.is_uncancel) {
				newStatus = newStatus.filter((status) => status !== LESSON_STATUS.CANCELLED);
			}
			if (req.body.shift) newStatus.push(LESSON_STATUS.SHIFT_ALTERED);
			if (req.body.take_place_at) newStatus.push(LESSON_STATUS.DATE_ALTERED);
			if (req.body.room) newStatus.push(LESSON_STATUS.ROOM_ALTERED);
			req.body.status = JSON.stringify(Array.from(new Set(newStatus)));

			lesson = await courseLessonDto.update(lesson, req.body, transaction);
			await transaction.commit();
			lesson.status = JSON.parse(lesson.status);
			res.status(200).json(lesson);
		} catch (error) {
			await transaction.rollback();
			next(error);
		}
	},

	cancel: async (req, res, next) => {
		const idSchema = Yup.number().required();
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const lesson = await courseLessonDto.findLessonById(req.params.id, transaction);
			if (!lesson) {
				await transaction.rollback();
				return next(new NotFoundError("Tiết học không tồn tại."));
			} else if (lesson.status.includes(LESSON_STATUS.CANCELLED)) {
				await transaction.rollback();
				return next(new BadRequestError("Tiết học đã bị hủy."));
			}

			await courseLessonDto.cancel(lesson, transaction);
			await transaction.commit();
			res.status(200).json({
				message: "Tiết học đã được hủy thành công."
			});
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getTodayLesson: async (req, res, next) => {
		const transaction = await connection.transaction();
		try {
			const lessons = await courseLessonDto.findTodayLessons(transaction);
			await transaction.commit();
			res.status(200).json(lessons);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	getMySchedule: async (req, res, next) => {
		const schema = YUP_UTILS.body({
			start_date: YUP_UTILS.date("start_date").required("Cần phải có `start_date`."),
			end_date: YUP_UTILS.date("end_date").required("Cần phải có `end_date`.")
		}).required("Cần phải có `start_date` và `end_date`.");

		try {
			req.body = await schema.validate(req.body);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const userId = req.userId;
			const lessons = await courseLessonDto.findMySchedule(userId, req.body, transaction);
			await transaction.commit();
			res.status(200).json(lessons);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default courseLessonController;
