import { Model } from "sequelize";
import Sequelize from "sequelize";
class CourseTag extends Model {
	static init(sequelize) {
		return super.init(
			{
				course_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					allowNull: false,
					references: {
						model: "Courses",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				},
				tag_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					allowNull: false,
					references: {
						model: "Tags",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				}
			},
			{ sequelize, timestamps: false }
		);
	}
}

export default CourseTag;
