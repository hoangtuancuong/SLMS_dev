import { Model } from "sequelize";
import Sequelize from "sequelize";
import { TRANSACTION_STATUS } from "../utils/const.js";

class Transaction extends Model {
	static init(sequelize) {
		return super.init(
			{
				id: {
					type: Sequelize.INTEGER,
					autoIncrement: true,
					primaryKey: true
				},
				receipt_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "Receipts",
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
				transaction_code: {
					type: Sequelize.STRING,
					allowNull: false
				},
				payment_method: {
					type: Sequelize.STRING,
					allowNull: false
				},
				amount: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				status: {
					type: Sequelize.ENUM(TRANSACTION_STATUS.values),
					allowNull: false
				},
				raw_response_from_gateway: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				note: {
					type: Sequelize.STRING,
					allowNull: true
				},
				paid_at: {
					type: Sequelize.DATE,
					allowNull: true
				},
				refunded_at: {
					type: Sequelize.DATE,
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
				tableName: "Transactions",
				timestamps: true,
				createdAt: "created_at",
				updatedAt: "updated_at"
			}
		);
	}

	static associate(models) {
		this.belongsTo(models.Receipt, { foreignKey: "receipt_id", as: "receipt" });
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
	}
}

export default Transaction;
