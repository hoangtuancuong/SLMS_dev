import { Model } from "sequelize";
import Sequelize from "sequelize";
import { ROLL_CALL_STATUS } from "../utils/const.js";

class RollCall extends Model {
	static init(sequelize) {
		return super.init(
			{
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				lesson_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "CourseLessons",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				},
				user_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "Users",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				},
				status: {
					type: Sequelize.ENUM(ROLL_CALL_STATUS.values),
					allowNull: false
				},
				note: {
					type: Sequelize.STRING,
					allowNull: true
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
		this.belongsTo(models.CourseLesson, { foreignKey: "lesson_id", as: "lesson" });
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
	}
}

export default RollCall;
