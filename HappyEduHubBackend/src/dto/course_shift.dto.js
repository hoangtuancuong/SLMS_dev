import CourseShift from "../models/CourseShift.js";

const courseShiftDto = {
	findById: async (id, transaction) => {
		return CourseShift.findByPk(id, { transaction });
	},

	findAllByCourseId: async (course_id, transaction) => {
		const where = { course_id };
		return CourseShift.findAll({ where, transaction });
	},

	update: async (oldObj, updateObj, transaction) => {
		return oldObj.update(updateObj, { transaction });
	}
};

export default courseShiftDto;
