import { Model } from "sequelize";
import Sequelize from "sequelize";
import { LESSON_STATUS } from "../utils/const.js";

class CourseLesson extends Model {
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
				index: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				status: {
					type: Sequelize.STRING,
					allowNull: false,
					defaultValue: JSON.stringify([LESSON_STATUS.NORMAL])
				},
				take_place_at: {
					type: Sequelize.DATE,
					allowNull: false
				},
				shift: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				room: {
					type: Sequelize.STRING,
					allowNull: false
				},
				note: {
					type: Sequelize.TEXT,
					allowNull: true
				}
			},
			{ sequelize, timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
		);
	}

	static associate(models) {
		this.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
	}
}

export default CourseLesson;
