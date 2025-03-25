import Assignment from "../models/Assignment.js";
import CourseMember from "../models/CourseMember.js";
import Score from "../models/Score.js";
import { DataExistError, NotFoundError } from "../utils/ApiError.js";
import { MEMBER_STATUS, ROLE } from "../utils/const.js";

const scoreDto = {
	checkPermission: async (userId, userRole, assignmentId, transaction) => {
		if (userRole !== ROLE.TEACHER) {
			return true;
		}
		const assignment = await Assignment.findByPk(assignmentId, { transaction });
		if (!assignment) {
			throw new NotFoundError("Bài tập không tồn tại.");
		}
		const courseMember = await CourseMember.findOne({
			where: {
				user_id: userId,
				course_id: assignment.course_id,
				status: MEMBER_STATUS.APPROVED
			},
			transaction
		});
		if (!courseMember) {
			throw new NotFoundError("Bạn không có quyền truy cập khóa học này.");
		}
		return true;
	},

	create: async (data, transaction) => {
		const existScore = await Score.findOne({
			where: { assignment_id: data.assignment_id, user_id: data.user_id },
			transaction
		});
		if (existScore) {
			throw new DataExistError("Điểm đã tồn tại.");
		}
		const score = await Score.create(data, { transaction });
		return score;
	},

	batchCreate: async (data, transaction) => {
		const { assignment_id, score_data } = data;
		const assignment = await Assignment.findByPk(assignment_id, { transaction });
		if (!assignment) {
			throw new NotFoundError("Bài tập không tồn tại.");
		}
		await Promise.all(
			score_data.map(async (item) => {
				const existScore = await Score.findOne({
					where: { assignment_id: assignment_id, user_id: item.user_id },
					transaction
				});
				if (existScore) {
					const score = await existScore.update({ score: item.score }, { transaction });
					return score;
				} else {
					const score = await Score.create(
						{
							assignment_id: assignment_id,
							user_id: item.user_id,
							score: item.score
						},
						{ transaction }
					);
					return score;
				}
			})
		);
	},

	update: async (scoreId, data, transaction) => {
		let score = await Score.findByPk(scoreId, { transaction });
		if (!score) {
			throw new NotFoundError("Điểm không tồn tại.");
		}
		score = await score.update(data, { transaction });
		return score;
	},

	getByAssignmentId: async (assignmentId, transaction) => {
		const scores = await Score.findAll({ where: { assignment_id: assignmentId }, transaction });
		const averageScore = scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length;
		const studentsScore = scores.map((elm) => {
			return {
				student_id: elm.user_id,
				score: elm.score,
				note: elm.note,
				created_at: elm.created_at,
				updated_at: elm.updated_at
			};
		});

		return {
			assignment_id: assignmentId,
			average_score: averageScore,
			students_score: studentsScore
		};
	},

	getByCourseIdAndUserId: async (courseId, userId, transaction) => {
		const scores = await Score.findAll({
			where: { user_id: userId },
			include: [
				{
					model: Assignment,
					as: "assignment",
					where: { course_id: courseId }
				}
			],
			transaction
		});
		const data = scores.map((elm) => {
			return {
				assignment_id: elm.assignment_id,
				score: elm.score,
				note: elm.note,
				created_at: elm.created_at,
				updated_at: elm.updated_at
			};
		});
		return data;
	}
};

export default scoreDto;
