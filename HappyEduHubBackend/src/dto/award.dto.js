import { Op } from "sequelize";

import Award from "../models/Award.js";
import User from "../models/User.js";

function createWhereClause(filter) {
	let where = {};
	if (filter) {
		if (filter.user_id) where.user_id = filter.user_id;
		where.time = {};
		if (filter.from_time) where.time = { ...where.time, [Op.gte]: filter.from_time };
		if (filter.to_time) where.time = { ...where.time, [Op.lte]: filter.to_time };
		if (Object.getOwnPropertySymbols(where.time).length === 0) delete where.time;
		if (filter.type) where.type = filter.type;
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
		model: User,
		attributes: ["id", "name", "role"],
		as: "user"
	};
}

function createAttributesClause() {
	return { exclude: ["user_id"] };
}

export const awardDto = {
	find: async ({ limit, offset, filter, sort }, transaction) => {
		return Award.findAll({
			limit,
			offset,
			where: createWhereClause(filter),
			order: createOrderClause(sort),
			include: createIncludeClause(),
			attributes: createAttributesClause(),
			transaction
		});
	},

	findById: async (id, transaction) => {
		return Award.findByPk(id, {
			include: createIncludeClause(),
			attributes: createAttributesClause(),
			transaction
		});
	},

	total: async ({ filter }, transaction) => {
		return Award.count({ where: createWhereClause(filter), include: createIncludeClause(), transaction });
	},

	create: async (obj, transaction) => {
		return Award.create(obj, { transaction });
	},

	update: async (oldObj, updateObj, transaction) => {
		return oldObj.update(updateObj, { transaction });
	},

	delete: async (id, transaction) => {
		return Award.destroy({ where: { id: id }, transaction });
	}
};

export default awardDto;
