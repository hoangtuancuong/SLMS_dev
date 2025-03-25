"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Exams", "name", {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: false
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Exams", "name");
	}
};
