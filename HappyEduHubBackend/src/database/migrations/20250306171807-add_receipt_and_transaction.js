"use strict";

const { TRANSACTION_STATUS } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Receipts", {
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
				allowNull: false,
				defaultValue: Sequelize.NOW
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW
			}
		});

		await queryInterface.createTable("Transactions", {
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
				allowNull: false,
				defaultValue: Sequelize.NOW
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW
			}
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("Transactions");
		await queryInterface.dropTable("Receipts");
	}
};
