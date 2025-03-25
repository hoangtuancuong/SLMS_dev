import { Model } from "sequelize";
import Sequelize from "sequelize";
import CourseTag from "./CourseTag.js";
import CourseBlog from "./CourseBlog.js";
import CourseMember from "./CourseMember.js";

class Course extends Model {
	static init(sequelize) {
		return super.init(
			{
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				description: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				fee: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				start_date: {
					type: Sequelize.DATE,
					allowNull: false
				},
				end_date: {
					type: Sequelize.DATE,
					allowNull: false
				},
				is_approved: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				is_private: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				is_generated: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				code: {
					type: Sequelize.STRING,
					allowNull: false
				}
			},
			{
				sequelize,
				timestamps: true,
				createdAt: "created_at",
				updatedAt: "updated_at"
			}
		);
	}

	static associate(models) {
		this.belongsToMany(models.Tag, { through: CourseTag, foreignKey: "course_id", as: "tags", timestamps: false });
		this.belongsToMany(models.User, {
			through: CourseMember,
			foreignKey: "course_id",
			as: "members",
			timestamps: false
		});
		this.hasMany(models.CourseShift, { foreignKey: "course_id", as: "shifts" });
		this.belongsToMany(models.Blog, {
			through: CourseBlog,
			foreignKey: "course_id",
			as: "blogs",
			timestamps: false
		});
		this.hasMany(models.Assignment, { foreignKey: "course_id", as: "course" });
		this.hasMany(models.CourseLesson, { foreignKey: "course_id", as: "lessons" });
	}
}

export default Course;
