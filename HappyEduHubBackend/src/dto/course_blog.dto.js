import { Op } from "sequelize";

import Blog from "../models/Blog.js";
import CourseBlog from "../models/CourseBlog.js";

function createOrderClause(sort) {
	const order = [];
	if (sort) {
		for (const key in sort) order.push([key, sort[key]]);
	}
	return order;
}

const courseBlogDto = {
	findBlogsByCourseId: async (course_id, { limit, offset, filter, sort }, transaction) => {
		const where = { course_id };
		if (filter) {
			if (filter.author_id) where.author_id = filter.author_id;
			if (filter.type) where.type = filter.type;
			if (filter.title) where.title = { [Op.like]: `%${filter.title}%` };
		}

		return CourseBlog.findAll({
			limit,
			offset,
			where,
			order: createOrderClause(sort),
			include: [
				{
					model: Blog,
					as: "blog"
				}
			],
			transaction
		}).then((data) => data.map((d) => d.blog));
	},

	totalBlogsByCourseId: async (course_id, { filter }, transaction) => {
		const where = { course_id };
		if (filter) {
			if (filter.author_id) where.author_id = filter.author_id;
			if (filter.type) where.type = filter.type;
			if (filter.title) where.title = { [Op.like]: `%${filter.title}%` };
		}

		return CourseBlog.count({ where, transaction });
	},

	findByCourseIdAndBlogId: async (course_id, blog_id, transaction) => {
		return CourseBlog.findOne({ where: { course_id, blog_id }, transaction });
	},

	addBlogToCourse: async (course_id, blog_id, transaction) => {
		return CourseBlog.create({ course_id, blog_id }, { transaction });
	},

	removeBlogFromCourse: async (course_id, blog_id, transaction) => {
		return CourseBlog.destroy({ where: { course_id, blog_id }, transaction });
	}
};

export default courseBlogDto;
