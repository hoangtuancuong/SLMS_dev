import * as Yup from "yup";

import courseDto from "../dto/course.dto.js";
import courseLessonDto from "../dto/course_lesson.dto.js";
import courseShiftDto from "../dto/course_shift.dto.js";
import courseMemberDto from "../dto/course_member.dto.js";
import userDto from "../dto/user.dto.js";
import tagDto from "../dto/tag.dto.js";
import { connection } from "../services/sequelize.service.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/ApiError.js";
import { COURSE_TIME_STATUS, MEMBER_STATUS, ROLE, TAG_MODE, TAG_TYPE } from "../utils/const.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

const courseController = {
	find: async (req, res, next) => {
		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			tag_mode: YUP_UTILS.string("tag_mode")
				.oneOf(TAG_MODE.values, `\`tag_mode\` phải là một trong các giá trị sau: ${TAG_MODE.values}`)
				.default(TAG_MODE.OR),
			filter: YUP_UTILS.object({
				name: YUP_UTILS.string("name"),
				tag_ids: Yup.array().of(YUP_UTILS.number("tag_ids")),
				is_approved: YUP_UTILS.boolean("is_approved"),
				code: YUP_UTILS.string("code"),
				// is_private: YUP_UTILS.boolean("is_private"),
				from_start_date: YUP_UTILS.date("from_start_date"),
				to_start_date: YUP_UTILS.date("to_start_date"),
				from_end_date: YUP_UTILS.date("from_end_date"),
				to_end_date: YUP_UTILS.date("to_end_date"),
				from_fee: YUP_UTILS.number("from_fee"),
				to_fee: YUP_UTILS.number("to_fee")
			}).default({
				is_approved: true
			}),
			sort: YUP_UTILS.object({
				name: YUP_UTILS.sort("name"),
				start_date: YUP_UTILS.sort("start_date"),
				end_date: YUP_UTILS.sort("end_date"),
				fee: YUP_UTILS.sort("fee")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const courses = await courseDto.find(req.query, transaction);
			const total = await courseDto.total(
				{ filter: req.query.filter, tag_mode: req.query.tag_mode },
				transaction
			);
			await transaction.commit();
			res.status(200).json({
				data: courses,
				meta: {
					limit: req.query.limit,
					offset: req.query.offset,
					total
				}
			});
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	myCourses: async (req, res, next) => {
		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			tag_mode: YUP_UTILS.string("tag_mode")
				.oneOf(TAG_MODE.values, `\`tag_mode\` phải là một trong các giá trị sau: ${TAG_MODE.values}`)
				.default(TAG_MODE.OR),
			filter: YUP_UTILS.object({
				name: YUP_UTILS.string("name"),
				tag_ids: Yup.array().of(YUP_UTILS.number("tag_ids")),
				is_approved: YUP_UTILS.boolean("is_approved"),
				code: YUP_UTILS.string("code"),
				// is_private: YUP_UTILS.boolean("is_private"),
				from_start_date: YUP_UTILS.date("from_start_date"),
				to_start_date: YUP_UTILS.date("to_start_date"),
				from_end_date: YUP_UTILS.date("from_end_date"),
				to_end_date: YUP_UTILS.date("to_end_date"),
				from_fee: YUP_UTILS.number("from_fee"),
				to_fee: YUP_UTILS.number("to_fee"),
				course_time_status: YUP_UTILS.string("course_time_status").oneOf(
					COURSE_TIME_STATUS.values,
					`\`course_time_status\` phải là một trong các giá trị sau: ${COURSE_TIME_STATUS.values}`
				)
			}).default({
				is_approved: true
			}),
			sort: YUP_UTILS.object({
				name: YUP_UTILS.sort("name"),
				start_date: YUP_UTILS.sort("start_date"),
				end_date: YUP_UTILS.sort("end_date"),
				fee: YUP_UTILS.sort("fee")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const userId = req.userId;
			const courses = await courseDto.findMyCourses(userId, req.query, transaction);
			await transaction.commit();
			res.status(200).json(courses);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	// WIP
	myCourseSchedule: async (req, res, next) => {
		const transaction = await connection.transaction();
		try {
			const userId = req.userId;
			const coursesSchedule = await courseDto.findMyCourseSchedule(userId, transaction);
			await transaction.commit();
			res.status(200).json(coursesSchedule);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	findById: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const course = await courseDto.findById(req.params.id, transaction);
			if (course == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy khóa học có id là " + req.params.id + "."));
			}
			await transaction.commit();
			res.status(200).json(course);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	create: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			name: YUP_UTILS.string("name").required("Cần phải có `name`."),
			description: YUP_UTILS.string("description").required("Cần phải có `description`."),
			start_date: YUP_UTILS.date("start_date").required("Cần phải có `start_date`."),
			end_date: YUP_UTILS.date("end_date")
				.required("Cần phải có `end_date`.")
				.min(Yup.ref("start_date"), "`end_date` phải sau `start_date`."),
			fee: YUP_UTILS.number("fee").required("Cần phải có `fee`."),
			is_private: YUP_UTILS.boolean("is_private").default(false),
			tag_ids: Yup.array()
				.of(YUP_UTILS.number("tag_ids"))
				.required("Cần phải có `tag_ids`.")
				.test("tag_ids", "Cần phải có 2 `tag_ids`.", (value) => value.length === 2),
			course_shifts: Yup.array()
				.of(
					YUP_UTILS.object({
						day: YUP_UTILS.number("day")
							.oneOf(
								[1, 2, 3, 4, 5, 6, 7],
								"`day` phải là một trong các giá trị sau: 1, 2, 3, 4, 5, 6, 7."
							)
							.required("Cần phải có `day`."),
						shift: YUP_UTILS.number("shift")
							.oneOf([1, 2, 3, 4, 5, 6], "`shift` phải là một trong các giá trị sau: 1, 2, 3, 4, 5, 6.")
							.required("Cần phải có `shift`."),
						room: YUP_UTILS.string("room")
					})
				)
				.required("Cần phải có `course_shifts`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
			if (req.role !== ROLE.ADMIN) {
				for (const shift of req.body.course_shifts) {
					if (shift.room)
						return next(new ForbiddenError("Không được phép tạo khóa học có buổi học có phòng học."));
				}
			}
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const tags = await tagDto.findByIds(req.body.tag_ids, transaction);
			const tagsValid = await courseDto.checkTags(req.body.tag_ids, transaction);
			if (!tagsValid) {
				await transaction.rollback();
				return next(new BadRequestError("Cần tag cho môn học và khối lớp học"));
			}
			delete req.body.tag_ids;
			let course = await courseDto.create(
				{
					...req.body,
					is_approved: req.role === ROLE.ADMIN,
					shifts: req.body.course_shifts
				},
				transaction
			);
			await course.setTags(tags, { transaction });

			const subject = tags.find((tag) => tag.type === TAG_TYPE.SUBJECT);
			if (!subject) {
				await transaction.rollback();
				return next(new BadRequestError("Không tìm thấy môn học."));
			}

			const grade = tags.find((tag) => tag.type === TAG_TYPE.GRADE);
			if (!grade) {
				await transaction.rollback();
				return next(new BadRequestError("Không tìm thấy khối lớp."));
			}

			const total = await courseDto.total(
				{ filter: { tag_ids: [subject.id, grade.id] }, tag_mode: TAG_MODE.AND },
				transaction
			);
			await course.update(
				{ code: `${subject.code_fragment}.${grade.code_fragment}.${total + 1}` },
				{ transaction }
			);
			// const user = await userDto.findOne({ filter: { role: ROLE.TEACHER } }, transaction);
            // await courseMemberDto.create({
            //     course_id: course.id,
            //     user_id: user.id,
            //     status: MEMBER_STATUS.APPROVED
            // }, transaction);
			await transaction.commit();
			res.status(200).json(course);
		} catch (error) {
			console.log(error);
			await transaction.rollback();
			return next(error);
		}
	},
	update: async (req, res, next) => {
		const bodySchema = Yup.object().shape({
			name: YUP_UTILS.string("name"),
			description: YUP_UTILS.string("description"),
			start_date: YUP_UTILS.date("start_date"),
			end_date: YUP_UTILS.date("end_date")
				.min(Yup.ref("start_date"), "`end_date` phải sau `start_date`.")
				.required("Cần phải có `end_date`."),
			fee: YUP_UTILS.number("fee"),
			is_approved: YUP_UTILS.boolean("is_approved"),
			is_private: YUP_UTILS.boolean("is_private"),
			tag_ids: Yup.array().of(YUP_UTILS.number("tag_ids")),
			course_shifts: Yup.array().of(
				YUP_UTILS.object({
					day: YUP_UTILS.number("day").oneOf(
						[1, 2, 3, 4, 5, 6, 7],
						"`day` phải là một trong các giá trị sau: 1, 2, 3, 4, 5, 6, 7."
					),
					shift: YUP_UTILS.number("shift").oneOf(
						[1, 2, 3, 4, 5],
						"`shift` phải là một trong các giá trị sau: 1, 2, 3, 4, 5."
					),
					room: YUP_UTILS.string("room")
				})
			)
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			let course = await courseDto.findById(req.params.id, transaction);
			if (course == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy khóa học có id là " + req.params.id + "."));
			}
			course = await courseDto.update(course.id, req.body, transaction);
			if (req.body.tag_ids) {
				const tags = await tagDto.findByIds(req.body.tag_ids, transaction);
				const tagsValid = await courseDto.checkTags(req.body.tag_ids, transaction);
				if (!tagsValid) {
					await transaction.rollback();
					return next(new BadRequestError("Cần tag cho môn học và khối lớp học"));
				}
				delete req.body.tag_ids;
				await course.setTags(tags, { transaction });
			}
			await course.reload({ transaction });
			await transaction.commit();
			res.status(200).json(course);
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
			const course = await courseDto.findById(req.params.id, transaction);
			if (course == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy khóa học có id là " + req.params.id + "."));
			}
			await course.destroy({ transaction });
			await transaction.commit();
			res.status(200).send({ message: "Khóa học đã được xóa thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	approve: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const course = await courseDto.findById(req.params.id, transaction);
			if (course == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy khóa học có id là " + req.params.id + "."));
			} else if (course.is_approved) {
				await transaction.rollback();
				return next(new BadRequestError("Khóa học đã được duyệt."));
			}
			await courseDto.update(course.id, { is_approved: true }, transaction);
			await transaction.commit();
			res.status(200).json({ message: "Khóa học đã được duyệt thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	assignRoom: async (req, res, next) => {
		const idSchema = YUP_UTILS.params({
			id: YUP_UTILS.number("id").required("Cần phải có `id`."),
			shift_id: YUP_UTILS.number("shift_id").required("Cần phải có `shift_id`.")
		});
		try {
			req.params = await idSchema.validate(req.params);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const bodySchema = YUP_UTILS.body({
			room: YUP_UTILS.string("room").required("Cần phải có `room`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const course = await courseDto.findById(req.params.id, transaction);
			if (course == null) {
				throw new NotFoundError("Không tìm thấy khóa học có id là " + req.params.id + ".");
			} else if (!course.is_approved) {
				throw new BadRequestError("Không thể gán phòng cho khóa học chưa được duyệt.");
			}

			const shift = await courseShiftDto.findById(req.params.shift_id, transaction);
			if (shift == null) {
				throw new NotFoundError("Không tìm thấy ca học có id là " + req.params.shift_id + ".");
			} else if (shift.room) {
				throw new BadRequestError("Phòng đã được gán cho ca học này.");
			}

			await courseShiftDto.update(shift, { room: req.body.room }, transaction);

			// GENERATE LESSONS
			// Firstly, check if the course can generate lessons.
			let canGenerate = !course.is_generated;
			// Next, check if all shifts have a room. If not, cannot generate lessons.
			const courseShifts = await courseShiftDto.findAllByCourseId(req.params.id, transaction);
			if (canGenerate) {
				for (const cs of courseShifts) {
					if (cs.room == null) {
						canGenerate = false;
						break;
					}
				}
			}

			// If can generate and there are shifts, generate lessons.
			if (courseShifts.length > 0) {
				let index = 1;
				for (let d = new Date(Date.parse(course.start_date)); d <= new Date(Date.parse(course.end_date)); d.setDate(d.getDate() + 1)) {
					let dayOfWeek = d.getDay();
					if (dayOfWeek == 0) dayOfWeek = 7;
					let matchedShift = courseShifts.filter((cs) => cs.day == dayOfWeek);
					for (const ms of matchedShift) {
						await courseLessonDto.create(
							{
								index: index,
								course_id: req.params.id,
								take_place_at: d,
								shift: ms.shift,
								room: ms.room
							},
							transaction
						);
						index++;
					}
				}
				await courseDto.update(course.id, { is_generated: true }, transaction);
				await transaction.commit();
				res.status(200).json({ message: "Phòng đã được gán thành công. Các tiết học đã được tạo thành công." });
			} else {
				await transaction.commit();
				res.status(200).json({ message: "Phòng đã được gán thành công." });
			}
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default courseController;
