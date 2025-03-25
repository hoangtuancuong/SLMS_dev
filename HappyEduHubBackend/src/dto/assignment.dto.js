import { Op } from "sequelize";
import Assignment from "../models/Assignment.js";
import Exam from "../models/Exam.js";
import CourseMember from "../models/CourseMember.js";
import { NotFoundError, UnauthorizedError } from "../utils/ApiError.js";
import { ASSIGNMENT_TYPE, EXAM_TYPE, MEMBER_STATUS, ROLE } from "../utils/const.js";
import Course from "../models/Course.js";
import Score from "../models/Score.js";

function createWhereClause(filter) {
	let where = {};
	if (filter) {
		if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };

		if (filter.from_created_at) where.created_at = { [Op.gte]: filter.from_created_at };
		if (filter.to_created_at) where.created_at = { [Op.lte]: filter.to_created_at };

		if (filter.from_start_time) where.start_time = { [Op.gte]: filter.from_start_time };
		if (filter.to_start_time) where.start_time = { [Op.lte]: filter.to_start_time };

		if (filter.from_end_time) where.end_time = { [Op.gte]: filter.from_end_time };
		if (filter.to_end_time) where.end_time = { [Op.lte]: filter.to_end_time };

		if (filter.assignment_type) where.assignment_type = filter.assignment_type;
	}
	return where;
}

function createOrderClause(sort) {
	let order = [];
	if (sort) {
		for (const key in sort) order.push([key, sort[key]]);
	}
	return order;
}

function createIncludeClause() {
	return {
		model: Exam,
		required: false,
		attributes: ["name", "is_private", "teacher_id", "drive_url", "content", "note"],
		as: "exam"
	};
}

const assignmentDto = {
	create: async (data, userId, transaction, isAdmin) => {
		const member = await CourseMember.findOne({
			where: {
				course_id: data.course_id,
				user_id: userId,
				status: MEMBER_STATUS.APPROVED
			}
		});
		if (!member && !isAdmin) throw new UnauthorizedError("Bạn không có quyền tạo bài kiểm tra này.");

		const exam = await Exam.findOne({
			where: {
				id: data.exam_id
			}
		});
		console.log(exam)
		if (!exam) throw new NotFoundError("Không tìm thấy bài kiểm tra.");

		if (!exam.is_private || userId === exam.teacher_id || isAdmin) {
			const assignment = await Assignment.create(data, { transaction });
			return assignment;
		} else {
			throw new UnauthorizedError("Bạn không có quyền tạo bài kiểm tra này.");
		}
	},

	get: async (id, { limit, offset, filter, sort }, userId, role, transaction) => {
		if (role !== ROLE.ADMIN) {
			const member = await CourseMember.findOne({
				where: {
					course_id: id,
					user_id: userId,
					status: MEMBER_STATUS.APPROVED
				}
			});

			if (!member) throw new UnauthorizedError("Bạn không có quyền xem bài kiểm tra này.");
		}

		const where = createWhereClause(filter);
		const order = createOrderClause(sort);
		const include = createIncludeClause();
		const assignments = await Assignment.findAll({
			where: {
				course_id: id,
				...where
			},
			order,
			limit,
			offset,
			include,
			transaction
		});

		const total = await Assignment.count({
			where: {
				course_id: id,
				...where
			},
			transaction
		});

		return {
			data: assignments,
			meta: { total, limit, offset }
		};
	},

	update: async (id, data, userId, role, transaction) => {
		let assignment = await Assignment.findByPk(id, { transaction });
		if (!assignment) throw new NotFoundError("Không tìm thấy bài kiểm tra.");

		if (
			!(role !== ROLE.ACADEMIC_AFFAIR && assignment.assignment_type === ASSIGNMENT_TYPE.EXAM) ||
			!(role !== ROLE.TEACHER && assignment.assignment_type === ASSIGNMENT_TYPE.EXCERCISE)
		) {
			throw new UnauthorizedError("Bạn không có quyền sửa bài kiểm tra này.");
		}

		const member = await CourseMember.findOne({
			where: {
				course_id: assignment.course_id,
				user_id: userId,
				status: MEMBER_STATUS.APPROVED
			}
		});

		if (!member) throw new UnauthorizedError("Bạn không có quyền sửa bài kiểm tra này.");

		if (data.exam_id) {
			const exam = await Exam.findByPk(data.exam_id);
			if (!exam) throw new NotFoundError("Không tìm thấy bài kiểm tra.");

			if (exam.is_private && userId !== exam.teacher_id) {
				throw new UnauthorizedError("Bạn không có quyền sửa bài kiểm tra này.");
			}
		}

		assignment = await assignment.update(data, { transaction });

		return assignment;
	},

	delete: async (id, userId, role, transaction) => {
		const assignment = await Assignment.findByPk(id, { transaction });
		if (!assignment) throw new NotFoundError("Không tìm thấy bài kiểm tra.");

		if (
			!(role !== ROLE.ACADEMIC_AFFAIR && assignment.assignment_type === ASSIGNMENT_TYPE.EXAM) ||
			!(role !== ROLE.TEACHER && assignment.assignment_type === ASSIGNMENT_TYPE.EXCERCISE)
		) {
			throw new UnauthorizedError("Bạn không có quyền sửa bài kiểm tra này.");
		}

		const member = await CourseMember.findOne({
			where: {
				course_id: assignment.course_id,
				user_id: userId,
				status: MEMBER_STATUS.APPROVED
			}
		});

		if (!member) throw new UnauthorizedError("Bạn không có quyền xóa bài kiểm tra này.");

		await assignment.destroy({ transaction });
	},

	getDetail: async (id, userId, role, transaction) => {
		const include = createIncludeClause();
		const assignment = await Assignment.findByPk(id, { transaction, include });
		if (!assignment) throw new NotFoundError("Không tìm thấy bài kiểm tra.");

		if (role !== ROLE.ADMIN) {
			const member = await CourseMember.findOne({
				where: {
					course_id: assignment.course_id,
					user_id: userId,
					status: MEMBER_STATUS.APPROVED
				},
				transaction
			});

			if (!member) throw new UnauthorizedError("Bạn không có quyền xem bài kiểm tra này.");
		}

		return assignment;
	},

	getMyAssignment: async (userId, transaction) => {
		const courseMember = await CourseMember.findAll({
			where: {
				user_id: userId,
				status: MEMBER_STATUS.APPROVED
			},
			transaction
		});

		const courseIds = courseMember.map((member) => member.course_id);

		const scores = await Score.findAll({
			where: {
				user_id: userId
			},
			transaction
		});

		const assignments = await Assignment.findAll({
			where: {
				course_id: {
					[Op.in]: courseIds
				},
				id: {
					[Op.notIn]: scores.map((score) => score.assignment_id)
				}
			},
			include: {
				model: Course,
				attributes: ["name", "start_date", "end_date", "code"],
				as: "course"
			},
			transaction
		});

		return assignments;
	}
};

export default assignmentDto;
