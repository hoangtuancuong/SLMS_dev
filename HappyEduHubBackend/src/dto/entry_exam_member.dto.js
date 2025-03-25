import { Op } from "sequelize";
import EntryExamMember from "../models/EntryExamMember.js";
import Exam from "../models/Exam.js";
import User from "../models/User.js";
import { BadRequestError, NotFoundError } from "../utils/ApiError.js";
import { EXAM_TYPE, ROLE } from "../utils/const.js";

function createWhereClause(filter) {
	let where = {};
	if (filter) {
		where.created_at = {};
		where.updated_at = {};
		if (filter.user_name) where = { ...where, "$author.name$": { [Op.like]: `%${filter.user_name}%` } };
		if (filter.user_id) where.user_id = filter.user_id;
		if (filter.from_created_at) where.created_at = { ...where.created_at, [Op.gte]: filter.from_created_at };
		if (filter.to_created_at) where.created_at = { ...where.created_at, [Op.lte]: filter.to_created_at };
		if (Object.getOwnPropertySymbols(where.created_at).length === 0) delete where.created_at;
		if (filter.from_updated_at) where.updated_at = { ...where.updated_at, [Op.gte]: filter.from_updated_at };
		if (filter.to_updated_at) where.updated_at = { ...where.updated_at, [Op.lte]: filter.to_updated_at };
		if (Object.getOwnPropertySymbols(where.updated_at).length === 0) delete where.updated_at;
	}
	return where;
}

function createOrderClause(sort) {
	const order = [];
	if (sort) {
		for (const key in sort) order.push([key, sort[key]]);
	}
	return order;
}

const entryExamMemberDto = {
	create: async (data, transaction) => {
		const existMember = await EntryExamMember.findOne({
			where: {
				user_id: data.user_id,
				exam_id: data.exam_id
			},
			transaction
		});

		if (existMember) {
			throw new BadRequestError("Thành viên đã tồn tại");
		}

		const exam = await Exam.findOne({
			where: {
				id: data.exam_id,
				exam_type: EXAM_TYPE.ENTRY_EXAM
			},
			transaction
		});

		if (!exam) {
			throw new NotFoundError("Không tìm thấy đề thi");
		}
		const user = await User.findOne({
			where: {
				id: data.user_id,
				role: ROLE.STUDENT
			},
			transaction
		});
		if (!user) {
			throw new NotFoundError("Không tìm thấy người dùng");
		}
		const res = await EntryExamMember.create(data, {
			transaction
		});

		const member = await EntryExamMember.findOne({
			where: {
				id: res.id
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["name", "email", "phone_number"]
				},
				{
					model: Exam,
					as: "exam",
					attributes: ["name", "content", "note"]
				}
			],
			transaction
		});

		return member;
	},

	getMembers: async (examId, { limit, offset, filter, sort }, transaction) => {
		const where = createWhereClause(filter);
		const order = createOrderClause(sort);
		const members = await EntryExamMember.findAll({
			where: {
				...where,
				exam_id: examId
			},
			order,
			limit,
			offset,
			include: [
				{
					model: User,
					as: "user",
					attributes: ["name", "email", "phone_number"]
				},
				{
					model: Exam,
					as: "exam",
					attributes: ["name", "content", "note"]
				}
			],
			transaction
		});
		const total = await EntryExamMember.count({ where, transaction });
		const res = {
			data: members,
			meta: {
				limit,
				offset,
				total
			}
		};
		return res;
	},

	getMemberByUserId: async (userId, examId, transaction) => {
		const member = await EntryExamMember.findOne({
			where: {
				user_id: userId,
				exam_id: examId
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["name", "email", "phone_number"]
				},
				{
					model: Exam,
					as: "exam",
					attributes: ["name", "content", "note"]
				}
			],
			transaction
		});
		if (!member) {
			throw new NotFoundError("Không tìm thấy thành viên");
		}
		return member;
	},

	insertScore: async (data, transaction) => {
		const member = await EntryExamMember.findOne({
			where: {
				user_id: data.user_id,
				exam_id: data.exam_id
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["name", "email", "phone_number"]
				},
				{
					model: Exam,
					as: "exam",
					attributes: ["name", "content", "note"]
				}
			],
			transaction
		});
		if (!member) {
			throw new NotFoundError("Không tìm thấy thành viên");
		}
		member.score = data.score;
		member.note = data.note;
		await member.save({ transaction });
		return member;
	},

	insertScoreByArray: async (data, transaction) => {
		const { exam_id, score_data } = data;
		const exam = await Exam.findOne({
			where: {
				id: exam_id,
				exam_type: EXAM_TYPE.ENTRY_EXAM
			},
			transaction
		});
		if (!exam) {
			throw new NotFoundError("Không tìm thấy đề thi");
		}
		await Promise.all(
			score_data.map(async (item) => {
				const member = await EntryExamMember.findOne({
					where: {
						user_id: item.user_id,
						exam_id: exam_id
					},
					include: [
						{
							model: User,
							as: "user",
							attributes: ["name", "email", "phone_number"]
						},
						{
							model: Exam,
							as: "exam",
							attributes: ["name", "content", "note"]
						}
					],
					transaction
				});
				if (!member) {
					throw new NotFoundError("Không tìm thấy thành viên");
				}
				member.score = item.score;
				member.note = item.note;
				await member.save({ transaction });
			})
		);
	},

	update: async (data, transaction) => {
		const member = await EntryExamMember.findOne({
			where: {
				user_id: data.user_id,
				exam_id: data.exam_id
			},
			include: [
				{
					model: User,
					as: "user",
					attributes: ["name", "email", "phone_number"]
				},
				{
					model: Exam,
					as: "exam",
					attributes: ["name", "content", "note"]
				}
			],
			transaction
		});
		if (!member) {
			throw new NotFoundError("Không tìm thấy thành viên");
		}
		member.score = data.score;
		member.note = data.note;
		await member.save({ transaction });
		return member;
	}
};

export default entryExamMemberDto;
