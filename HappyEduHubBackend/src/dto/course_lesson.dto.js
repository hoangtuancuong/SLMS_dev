import { Op } from "sequelize";

import CourseLesson from "../models/CourseLesson.js";
import { LESSON_STATUS, MEMBER_STATUS, ROLE } from "../utils/const.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import CourseMember from "../models/CourseMember.js";

const courseLessonDto = {
	findAllLessonsByCourseId: async (course_id, { filter }, transaction) => {
		const where = { course_id };
		if (filter) {
			if (filter.from_take_place_at)
				where.take_place_at = {
					[Op.gte]: filter.from_take_place_at
				};
			if (filter.to_take_place_at)
				where.take_place_at = {
					[Op.lte]: filter.to_take_place_at
				};
		}
		return CourseLesson.findAll({ where, order: [["index", "ASC"]], transaction });
	},

	findLessonById: async (id, transaction) => {
		return CourseLesson.findByPk(id, { transaction });
	},

	create: async (obj, transaction) => {
		return CourseLesson.create(obj, { transaction });
	},

	update: async (oldObj, updateObj, transaction) => {
		return oldObj.update(updateObj, { transaction });
	},

	cancel: async (lesson, transaction) => {
		return lesson.update({ status: JSON.stringify([LESSON_STATUS.CANCELLED]) }, { transaction });
	},

	findTodayLessons: async (transaction) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); 
		const startOfDay = new Date(today.getTime() - (7 * 60 * 60 * 1000)); // Convert to UTC

		today.setHours(23, 59, 59, 999);
		const endOfDay = new Date(today.getTime() - (7 * 60 * 60 * 1000)); // Convert to UTC
		const lessons = await CourseLesson.findAll({
			where: {
				take_place_at: {
					[Op.between]: [startOfDay, endOfDay]
				}
			},
			include: {
				model: Course,
				attributes: ["id", "name", "description", "fee", "start_date", "end_date", "code"],
				as: "course",
				include: {
					model: User,
					as: "members",
					attributes: ["id", "name", "email", "phone_number", "code"],
					through: {
						attributes: []
					},
					required: false,
					where: {
						role: ROLE.TEACHER
					}
				}
			},
			transaction
		});
		return lessons;
	},

	findMySchedule: async (userId, { start_date, end_date }, transaction) => {
		const startDate = new Date(start_date).setUTCHours(0, 0, 0, 0);
		const endDate = new Date(end_date).setUTCHours(23, 59, 59, 999);
		const member = await CourseMember.findAll({
			where: {
				user_id: userId,
				status: MEMBER_STATUS.APPROVED
			},
			transaction
		});
		if (!member) return [];
		const courseIds = member.map((item) => item.course_id);
		const lessons = await CourseLesson.findAll({
			where: {
				take_place_at: {
					[Op.between]: [startDate, endDate]
				}
			},
			include: [
				{
					model: Course,
					attributes: ["id", "name", "description", "fee", "start_date", "end_date", "code"],
					as: "course",
					where: {
						id: {
							[Op.in]: courseIds
						}
					}
				}
			],
			transaction
		});
		return lessons;
	}
};

export default courseLessonDto;
