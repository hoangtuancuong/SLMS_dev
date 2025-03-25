import Sequelize, { Model } from "sequelize";
import { AWARD_TYPE } from "../utils/const.js";

class Award extends Model {
	static init(sequelize) {
		super.init(
			{
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
				description: {
					type: Sequelize.STRING,
					allowNull: true
				},
				image: {
					type: Sequelize.STRING,
					allowNull: true
				},
				time: {
					type: Sequelize.DATE,
					allowNull: true
				},
				type: {
					type: Sequelize.ENUM(AWARD_TYPE.values),
					allowNull: false
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
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
	}
}

export default Award;
