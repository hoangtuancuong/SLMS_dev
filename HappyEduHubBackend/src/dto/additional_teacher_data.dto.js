import AdditionalTeacherData from "../models/AdditionalTeacherData.js";

const additionalTeacherDataDto = {
	findById: async (id, transaction) => {
		return AdditionalTeacherData.findByPk(id, { transaction });
	},

	create: async (data, transaction) => {
		return AdditionalTeacherData.create(data, { transaction });
	},

	total: async (where, transaction) => {
		return AdditionalTeacherData.count({ where: where, transaction });
	},

	update: async (oldObj, updateObj, transaction) => {
		return oldObj.update(updateObj, { transaction });
	}
};

export default additionalTeacherDataDto;
