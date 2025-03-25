import { Model } from "sequelize";
import Sequelize from "sequelize";
import { MEMBER_STATUS } from "../utils/const.js";

class CourseMember extends Model {
	static init(sequelize) {
		return super.init(
			{
				id: {
					type: Sequelize.INTEGER,
					autoIncrement: true,
					primaryKey: true
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
				status: {
					type: Sequelize.ENUM(MEMBER_STATUS.values),
					allowNull: false,
					defaultValue: MEMBER_STATUS.PENDING
				}
			},
			{ sequelize, timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
		);
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
		this.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
	}
}

export default CourseMember;
