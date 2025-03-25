import { Op } from "sequelize";
import Exam from "../models/Exam.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/ApiError.js";
import { EXAM_TYPE, ROLE } from "../utils/const.js";

function createWhereClause(filter) {
	let where = {};
	if (filter) {
		if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };
		if (filter.from_created_at) where.created_at = { [Op.gte]: filter.from_created_at };
		if (filter.to_created_at) where.created_at = { [Op.lte]: filter.to_created_at };
		if (filter.is_private !== undefined) where.is_private = filter.is_private;
		if (filter.teacher_id) where.teacher_id = filter.teacher_id;
		if (filter.exam_type) where.exam_type = filter.exam_type;
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

const examDto = {
	create: async (data, transaction) => {
		if (data.is_private !== true && data.exam_type === EXAM_TYPE.ENTRY_EXAM) {
			throw new BadRequestError("Không thể tạo bài kiểm tra đầu vào public");
		}
		return Exam.create(data, { transaction });
	},

	findAll: async ({ limit, offset, filter, sort }, transaction) => {
		let where = createWhereClause(filter);
		let exams = await Exam.findAll({ limit, offset, where, order: createOrderClause(sort), transaction });
		let total = await Exam.count({ where, transaction });
		return {
			data: exams,
			meta: { limit, offset, total }
		};
	},

	findAllPublicExam: async ({ limit, offset, filter, sort }, transaction) => {
		let where = createWhereClause(filter);
		where = { ...where, is_private: false };
		let exams = await Exam.findAll({ limit, offset, where, order: createOrderClause(sort), transaction });
		let total = await Exam.count({ where, transaction });
		return {
			data: exams,
			meta: { limit, offset, total }
		};
	},

	findMyExam: async ({ limit, offset, filter, sort }, teacher_id, transaction) => {
		let where = createWhereClause(filter);
		where = { ...where, teacher_id: teacher_id };
		let exams = await Exam.findAll({ limit, offset, where, order: createOrderClause(sort), transaction });
		let total = await Exam.count({ where, transaction });
		return {
			data: exams,
			meta: { limit, offset, total }
		};
	},

	findById: async (id, transaction) => {
		const exam = await Exam.findByPk(id, { transaction });
		if (exam == null) throw new NotFoundError("Không thể tìm thấy bài kiểm tra với id: " + id + ".");
		return exam;
	},

	update: async (id, data, teacher_id, role, transaction) => {
		let existExam = await Exam.findByPk(id, { transaction });
		if (!existExam) throw new NotFoundError("Không thể tìm thấy bài kiểm tra với id: " + id + ".");
		if (role === ROLE.TEACHER && teacher_id !== existExam.teacher_id)
			throw new UnauthorizedError("Bạn không có quyền chỉnh sửa bài kiểm tra này.");
		existExam = await existExam.update(data, { transaction });
		return existExam;
	},

	delete: async (id, teacher_id, role, transaction) => {
		let existExam = await Exam.findByPk(id, { transaction });
		if (!existExam) throw new NotFoundError("Không thể tìm thấy bài kiểm tra với id: " + id + ".");
		if (role === ROLE.TEACHER && teacher_id !== existExam.teacher_id)
			throw new UnauthorizedError("Bạn không có quyền xóa bài kiểm tra này.");
		await existExam.destroy({ transaction });
	}
};

export default examDto;
