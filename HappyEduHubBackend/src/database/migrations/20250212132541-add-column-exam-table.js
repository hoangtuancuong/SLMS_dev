"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Exams", "exam_type", {
			type: Sequelize.STRING,
			allowNull: false
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Exams", "exam_type");
	}
};
