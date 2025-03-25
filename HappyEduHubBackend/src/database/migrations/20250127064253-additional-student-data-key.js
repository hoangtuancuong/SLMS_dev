"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Alter the user_id column to be the primary key
		await queryInterface.changeColumn("AdditionalStudentDatas", "user_id", {
			type: Sequelize.INTEGER,
			allowNull: false
		});

		// Add a primary key constraint to user_id
		await queryInterface.addConstraint("AdditionalStudentDatas", {
			fields: ["user_id"],
			type: "primary key",
			name: "PK_AdditionalStudentDatas_user_id" // Optional: Name the primary key constraint
		});
	},

	async down(queryInterface, Sequelize) {
		// Remove the primary key constraint from user_id
		await queryInterface.removeConstraint("AdditionalStudentDatas", "PK_AdditionalStudentDatas_user_id");

		// Optionally, revert the column change
		await queryInterface.changeColumn("AdditionalStudentDatas", "user_id", {
			type: Sequelize.INTEGER,
			allowNull: true
		});

		// Optionally, add a new primary key if required (e.g., an `id` column)
	}
};
