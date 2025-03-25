"use strict";

const { MEMBER_STATUS } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Members", {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			user_id: {
				type: Sequelize.INTEGER,
				references: {
					model: "Users",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				allowNull: false
			},
			course_id: {
				type: Sequelize.INTEGER,
				references: {
					model: "Courses",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				allowNull: false
			},
			status: {
				type: Sequelize.ENUM(MEMBER_STATUS.values),
				allowNull: false,
				defaultValue: MEMBER_STATUS.PENDING
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: new Date()
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: new Date()
			}
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("Members");
	}
};
