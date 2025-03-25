import { Op } from "sequelize";

import Blog from "../models/Blog.js";
import User from "../models/User.js";

function createWhereClause(filter) {
	let where = {};
	if (filter) {
		if (filter.title) where.title = filter.title;
		if (filter.author_id) where.author_id = filter.author_id;
		where.created_at = {};
		if (filter.from_created_at) where.created_at = { ...where.created_at, [Op.gte]: filter.from_created_at };
		if (filter.to_created_at) where.created_at = { ...where.created_at, [Op.lte]: filter.to_created_at };
		if (Object.getOwnPropertySymbols(where.created_at).length === 0) delete where.created_at;
		if (filter.is_approved !== undefined) where.is_approved = filter.is_approved;
		if (filter.type) where.type = filter.type;
		if (filter.author_name) where = { ...where, "$author.name$": { [Op.like]: `%${filter.author_name}%` } };
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

function createIncludeClause() {
	return {
		model: User,
		as: "author",
		attributes: ["id", "name", "role", "avatar_url"]
	};
}

function createAttributesClause() {
	return { exclude: ["author_id"] };
}

const blogDto = {
	find: async ({ limit, offset, filter, sort }, transaction) => {
		return Blog.findAll({
			limit,
			offset,
			where: createWhereClause(filter),
			include: createIncludeClause(filter),
			attributes: createAttributesClause(),
			order: createOrderClause(sort),
			transaction
		});
	},

	findById: async (id, transaction) => {
		return Blog.findByPk(id, {
			include: createIncludeClause(),
			attributes: createAttributesClause(),
			transaction
		});
	},

	total: async ({ filter }, transaction) => {
		return Blog.count({
			where: createWhereClause(filter),
			include: createIncludeClause(),
			transaction
		});
	},

	create: async (obj, transaction) => {
		return Blog.create(obj, { include: createIncludeClause(), transaction });
	},

	update: async (oldObj, updateObj, transaction) => {
		return oldObj.update(updateObj, { transaction });
	},

	delete: async (id, transaction) => {
		return Blog.destroy({ where: { id: id }, transaction });
	},

	admin: {
		// find: async ({ limit, offset, filter, sort }, transaction) => {
		// 	return Blog.findAll({
		// 		limit,
		// 		offset,
		// 		where: createWhereClause(filter),
		// 		include: createIncludeClause(),
		// 		attributes: createAttributesClause(),
		// 		order: createOrderClause(sort),
		// 		transaction
		// 	});
		// },

		// findById: async (id, transaction) => {
		// 	return Blog.findByPk(id, {
		// 		include: createIncludeClause(),
		// 		attributes: createAttributesClause(),
		// 		transaction
		// 	});
		// },

		// total: async ({ filter }, transaction) => {
		// 	return Blog.count({ where: createWhereClause(filter), transaction });
		// },

		approve: async (id, transaction) => {
			return blogDto.update(await Blog.findByPk(id), { is_approved: true }, transaction);
		}
	}
};

export default blogDto;
