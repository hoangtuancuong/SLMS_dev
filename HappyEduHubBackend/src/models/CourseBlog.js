import { Model } from "sequelize";
import Sequelize from "sequelize";

class CourseBlog extends Model {
	static init(sequelize) {
		return super.init(
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				course_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "Courses",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				},
				blog_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "Blogs",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
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
		this.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
		this.belongsTo(models.Blog, { foreignKey: "blog_id", as: "blog" });
	}
}

export default CourseBlog;
