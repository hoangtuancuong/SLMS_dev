import Sequelize, { Model } from "sequelize";

class Assignment extends Model {
	static init(sequelize) {
		super.init(
			{
				exam_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				course_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				assignment_type: {
					type: Sequelize.STRING,
					allowNull: false
				},
				note: {
					type: Sequelize.STRING,
					allowNull: true
				},
				start_time: {
					type: Sequelize.DATE,
					allowNull: true
				},
				end_time: {
					type: Sequelize.DATE,
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

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
		this.belongsTo(models.Exam, { foreignKey: "exam_id", as: "exam" });
	}
}

export default Assignment;
