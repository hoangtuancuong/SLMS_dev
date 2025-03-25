import { Model } from "sequelize";
import Sequelize from "sequelize";

class Receipt extends Model {
	static init(sequelize) {
		return super.init(
			{
				id: {
					type: Sequelize.INTEGER,
					autoIncrement: true,
					primaryKey: true
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
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				amount: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				deadline: {
					type: Sequelize.DATE,
					allowNull: false
				},
				document_url: {
					type: Sequelize.STRING,
					allowNull: true
				},
				note: {
					type: Sequelize.STRING,
					allowNull: true
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: false
				},
				updated_at: {
					type: Sequelize.DATE,
					allowNull: false
				}
			},
			{
				sequelize,
				tableName: "Receipts",
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

export default Receipt;
