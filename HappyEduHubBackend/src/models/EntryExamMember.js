import { Model } from "sequelize";
import Sequelize from "sequelize";

class EntryExamMember extends Model {
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
				exam_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "Exams",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				},
				score: {
					type: Sequelize.DOUBLE,
					allowNull: true
				},
				note: {
					type: Sequelize.STRING,
					allowNull: true
				}
			},
			{ sequelize, timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
		);
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
		this.belongsTo(models.Exam, { foreignKey: "exam_id", as: "exam" });
	}
}

export default EntryExamMember;
