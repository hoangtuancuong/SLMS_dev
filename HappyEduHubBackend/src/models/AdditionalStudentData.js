import Sequelize, { Model } from "sequelize";

class AdditionalStudentData extends Model {
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
				first_contact_name: Sequelize.STRING,
				first_contact_tel: Sequelize.STRING,
				second_contact_name: Sequelize.STRING,
				second_contact_tel: Sequelize.STRING,
				homeroom_teacher_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: "Users",
						key: "id"
					}
				},
				cccd: {
					type: Sequelize.STRING,
					allowNull: true
				},
				class: {
					type: Sequelize.STRING,
					allowNull: true
				},
				school: {
					type: Sequelize.STRING,
					allowNull: true
				}
			},
			{
				sequelize,
				timestamps: true,
				createdAt: "created_at",
				updatedAt: "updated_at",
				tableName: "AdditionalStudentDatas"
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
	}
}

export default AdditionalStudentData;
