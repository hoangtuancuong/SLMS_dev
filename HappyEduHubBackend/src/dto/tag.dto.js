import { Op } from "sequelize";

import Tag from "../models/Tag.js";

const tagDto = {
	findAll: async (transaction) => {
		return Tag.findAll({ transaction });
	},

	findById: async (id, transaction) => {
		return Tag.findByPk(id, { transaction });
	},

	findByIds: async (ids, transaction) => {
		return Tag.findAll({ where: { id: { [Op.in]: ids } }, transaction });
	},

	create: async (obj, transaction) => {
		return Tag.create(obj, { transaction });
	},

	update: async (oldObj, updateObj, transaction) => {
		return oldObj.update(updateObj, { transaction });
	},

	delete: async (id, transaction) => {
		return Tag.destroy({ where: { id: id }, transaction });
	}
};

export default tagDto;
