import Sequelize from "sequelize";
import { Model } from "sequelize";

class CourseShift extends Model {
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
					allowNull: false
				},
				day: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				shift: {
					type: Sequelize.ENUM(["1", "2", "3", "4", "5"]),
					allowNull: false
				},
				room: {
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
		this.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
	}
}

export default CourseShift;
