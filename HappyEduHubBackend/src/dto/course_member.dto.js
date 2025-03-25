import { Op } from "sequelize";
import Course from "../models/Course.js";
import CourseMember from "../models/CourseMember.js";
import User from "../models/User.js";
import { MEMBER_STATUS } from "../utils/const.js";

function createIncludeClause() {
	let include = [];
	include.push({ model: User, as: "user", attributes: ["id", "name", "role", "avatar_url", "email", "code"] });
	include.push({ model: Course, as: "course", attributes: ["id", "name"] });
	return include;
}

const courseMemberDto = {
	findByCourseId: async (courseId, { limit, offset, filter, sort, pageNoLimit }, transaction) => {
		const where = {};
		if (filter) {
			if (filter.status) where.status = filter.status;
			if (filter.role) where["$user.role$"] = filter.role;
			where["$course.id$"] = courseId;
		}

		const order = [];
		if (sort) {
			for (const key in sort) order.push([key, sort[key]]);
		}

		return CourseMember.findAll({
			limit: pageNoLimit ? undefined : limit,
			offset: pageNoLimit ? undefined : offset,
			where,
			order,
			include: createIncludeClause(),
			attributes: { exclude: ["user_id", "course_id"] },
			transaction
		});
	},

	updateStatus: async (id, status, transaction) => {
		return CourseMember.update({ status }, { where: { id }, transaction });
	},

	findAllRequest: async ({ limit, offset, filter }, transaction) => {
		let where = {
			status: MEMBER_STATUS.PENDING
		}

		if (filter) {
			if (filter.email) where = { ...where, "$user.email$": { [Op.like]: `%${filter.email}%` } };
			if (filter.code) where = { ...where, "$user.code$": { [Op.like]: `%${filter.code}%` } };
			if (filter.name) where = { ...where, "$user.name$": { [Op.like]: `%${filter.name}%` } };
			if (filter.course_id) where = { ...where, course_id: filter.course_id };
			if (filter.course_name) where = { ...where, "$course.name$": { [Op.like]: `%${filter.course_name}%` } };
		}

		const data = await CourseMember.findAll({
			where,
			limit,
			offset,
			include: createIncludeClause(),
			transaction,
		});

		const total = await CourseMember.count({ where, include: createIncludeClause(), transaction });
		return {
			data,
			meta: {
				limit,
				offset,
				total
			}
		}
	},

	findAllByCourseId: async (courseId, transaction) => {
		return CourseMember.findAll({ where: { course_id: courseId }, transaction });
	},

	totalByCourseId: async (courseId, { filter }, transaction) => {
		const where = {
			course_id: courseId
		};
		if (filter) {
			if (filter.status) where.status = filter.status;
			if (filter.role) where["$user.role$"] = filter.role;
		}
		return CourseMember.count({ where, include: createIncludeClause(), transaction });
	},

	findByCourseIdAndUserId: async ({ course_id, user_id }, transaction) => {
		return CourseMember.findOne({ where: { course_id, user_id }, include: createIncludeClause(), transaction });
	},

	findById: async (id, transaction) => {
		return CourseMember.findByPk(id, {
			include: createIncludeClause(),
			attributes: { exclude: ["user_id", "course_id"] },
			transaction
		});
	},

	create: async (obj, transaction) => {
		return CourseMember.create(obj, { include: createIncludeClause(), transaction });
	},

	update: async (oldObj, updateObj, transaction) => {
		return oldObj.update(updateObj, { transaction });
	},

	delete: async (id, transaction) => {
		return CourseMember.destroy({ where: { id }, transaction });
	}
};

export default courseMemberDto;
