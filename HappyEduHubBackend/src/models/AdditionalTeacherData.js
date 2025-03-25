import Sequelize, { Model } from "sequelize";

class AdditionalTeacherData extends Model {
	static init(sequelize) {
		super.init(
			{
				user_id: {
					primaryKey: true,
					type: Sequelize.INTEGER,
					references: {
						model: "Users",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				},
				subject_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "Tags",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				},
				portfolio: {
					type: Sequelize.TEXT,
					allowNull: false,
					defaultValue: "{}"
				}
			},
			{
				sequelize,
				timestamps: true,
				createdAt: "created_at",
				updatedAt: "updated_at",
				tableName: "AdditionalTeacherDatas"
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Tag, { foreignKey: "subject_id", as: "subject" });
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
	}
}

export default AdditionalTeacherData;
