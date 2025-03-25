import Receipt from "../models/Receipt.js";
import Course from "../models/Course.js";

function createIncludeClause() {
	return {
		model: Course,
		as: "course",
		attributes: ["id", "name", "description", "code"]
	};
}

const receiptDto = {
	findAll: async (transaction) => {
		return Receipt.findAll({
			transaction,
			include: createIncludeClause()
		});
	},
	findByCourseId: async (courseId, transaction) => {
		return Receipt.findAll({
			where: { course_id: courseId },
			transaction,
			include: createIncludeClause()
		});
	},
	findById: async (id, transaction) => {
		return Receipt.findByPk(id, {
			transaction,
			include: createIncludeClause()
		});
	},
	create: async (receipt, transaction) => {
		return Receipt.create(receipt, {
			include: createIncludeClause(),
			transaction
		});
	},
	update: async (id, receipt, transaction) => {
		await Receipt.update(receipt, { where: { id }, transaction });
		return Receipt.findByPk(id, {
			transaction,
			include: createIncludeClause()
		});
	},
	delete: async (id, transaction) => {
		return Receipt.destroy({ where: { id }, transaction });
	}
};
export default receiptDto;
