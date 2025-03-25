import Sequelize, { Model } from "sequelize";

class TeacherReview extends Model {
	static init(sequelize) {
		super.init(
			{
				teacher_id: Sequelize.INTEGER,
				student_id: Sequelize.INTEGER,
				rate: Sequelize.STRING,
				description: Sequelize.STRING
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
		this.belongsTo(models.User, { foreignKey: "teacher_id", as: "teacher" });
		this.belongsTo(models.User, { foreignKey: "student_id", as: "student" });
	}
}

export default TeacherReview;
