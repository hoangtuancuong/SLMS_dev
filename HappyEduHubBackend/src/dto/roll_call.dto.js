import Course from "../models/Course.js";
import CourseLesson from "../models/CourseLesson.js";
import CourseMember from "../models/CourseMember.js";
import RollCall from "../models/RollCall.js";
import User from "../models/User.js";
import { BadRequestError, NotFoundError } from "../utils/ApiError.js";
import { ROLL_CALL_STATUS } from "../utils/const.js";

const rollCallDto = {
	create: async (data, transaction) => {
		const lesson = await CourseLesson.findByPk(data.lesson_id, { transaction });
		if (!lesson) {
			throw new NotFoundError("Không tìm thấy tiết học với id: " + data.lesson_id + ".");
		}
		const existMember = await CourseMember.findOne({
			where: { user_id: data.user_id, course_id: lesson.course_id },
			transaction
		});
		if (!existMember) {
			throw new NotFoundError("Không tìm thấy thành viên trong khóa học.");
		}
		const rollCall = await RollCall.create(data, { transaction });
		return rollCall;
	},

	update: async (id, data, transaction) => {
		const rollCall = await RollCall.findByPk(id, { transaction });
		if (!rollCall) {
			throw new NotFoundError("Không tìm thấy điểm danh với id: " + id + ".");
		}
		if (rollCall.status !== ROLL_CALL_STATUS.ABSENT) {
			throw new BadRequestError("Không thể cập nhật điểm danh này.");
		}
		return rollCall.update(data, { transaction });
	},

	getByLessonId: async (id, transaction) => {
		const rollCalls = await RollCall.findAll({
			where: {
				lesson_id: id
			},
			include: [
				{
					model: User,
					attributes: ["name", "code"],
					as: "user"
				}
			],
			transaction
		});
		return rollCalls;
	},

	//ARCANE STUFF, I DON'T EVEN KNOW WHAT IS THE OUTPUT OF THIS FUNCTION, GOOD LUCK TESTING IT
	getByCourseId: async (id, transaction) => {
		const course = await Course.findByPk(id, {
			attributes: ["id", "name", "code"],
			transaction
		});
		if (!course) {
			throw new NotFoundError("Không tìm thấy khóa học với id: " + id + ".");
		}
		const lessons = await CourseLesson.findAll({
			where: {
				course_id: id
			},
			attributes: ["id", "index", "status", "take_place_at", "shift", "room", "note"],
			transaction
		});

		const lessonRollCalls = await Promise.all(
			lessons.map(async (lesson) => {
				const rollCalls = await RollCall.findAll({
					where: {
						lesson_id: lesson.id
					},
					include: [
						{
							model: User,
							attributes: ["name", "code"],
							as: "user"
						}
					],
					transaction
				});

				console.log(rollCalls, "CHECK DATA OMG");

				return {
					lesson: lesson,
					rollCalls: rollCalls
				};
			})
		);

		const data = {
			course: course,
			lessons: lessonRollCalls
		};

		return data;
	}
};

export default rollCallDto;
