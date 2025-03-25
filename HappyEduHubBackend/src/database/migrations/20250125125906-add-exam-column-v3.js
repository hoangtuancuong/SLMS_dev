"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Exams", "teacher_id", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id"
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE"
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Exams", "teacher_id");
	}
};
