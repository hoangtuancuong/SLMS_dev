import { Op, Sequelize } from "sequelize";
import TeacherReview from "../models/TeacherReview.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/ApiError.js";
import { ROLE } from "../utils/const.js";

function createWhereClause(filter) {
	let where = {};
	if (filter) {
		if (filter.rate) where.rate = filter.reate;
		if (filter.from_created_at) where.created_at = { [Op.gte]: filter.from_created_at };
		if (filter.to_created_at) where.created_at = { [Op.lte]: filter.to_created_at };
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

const teacherReviewDto = {
	create: async (data, transaction) => {
		const existReview = await TeacherReview.findOne({
			where: {
				teacher_id: data.teacher_id,
				student_id: data.student_id
			}
		});

		if (existReview) throw new BadRequestError("Học sinh này đã đánh giá giáo viên này.");
		return TeacherReview.create(data, { transaction });
	},

	get: async (teacher_id, { limit, offset, filter, sort }, role, transaction) => {
		const where = createWhereClause(filter);
		where.teacher_id = teacher_id;
		const order = createOrderClause(sort);
		const attributes = role === ROLE.ADMIN ? undefined : { exclude: ["student_id"] };

		const reviews = await TeacherReview.findAll({ limit, offset, where, order, attributes, transaction });
		const total = await TeacherReview.count({ where, transaction });

		const averageResult = await TeacherReview.findAll({
			attributes: [[Sequelize.fn("AVG", Sequelize.col("rate")), "averageRate"]],
			where, // Apply the same filters if needed
			raw: true,
			transaction
		});

		const averageRate = parseFloat(averageResult[0]?.averageRate || 0);

		return {
			data: reviews,
			average: averageRate,
			meta: { limit, offset, total }
		};
	},

	getById: async (id, role, transaction) => {
		const attributes = role === ROLE.ADMIN ? undefined : { exclude: ["student_id"] };
		const review = await TeacherReview.findByPk(id, { attributes, transaction });
		if (!review) throw new NotFoundError("Không thể tìm thấy đánh giá với id: " + id + ".");

		return review;
	},

	getMyReview: async (student_id, { limit, offset, filter, sort }, role, transaction) => {
		const where = createWhereClause(filter);
		where.student_id = student_id;
		const order = createOrderClause(sort);
		const attributes = role === ROLE.ADMIN ? undefined : { exclude: ["student_id"] };

		const reviews = await TeacherReview.findAll({ limit, offset, where, order, attributes, transaction });
		const total = await TeacherReview.count({ where, transaction });

		return {
			data: reviews,
			meta: { limit, offset, total }
		};
	},

	update: async (data, student_id, transaction) => {
		let existReview = await TeacherReview.findByPk(data.id, { transaction });
		if (!existReview) throw new NotFoundError("Không thể tìm thấy đánh giá với id: " + data.id + ".");
		if (student_id !== existReview.student_id)
			throw new ForbiddenError("Bạn không có quyền cập nhật đánh giá này.");
		return existReview.update(data, { transaction });
	},

	delete: async (id, student_id, transaction) => {
		let existReview = await TeacherReview.findByPk(id, { transaction });
		if (!existReview) throw new NotFoundError("Không thể tìm thấy đánh giá với id: " + id + ".");
		if (student_id !== existReview.student_id) throw new ForbiddenError("Bạn không có quyền xóa đánh giá này.");
		await existReview.destroy({ transaction });
	}
};

export default teacherReviewDto;
