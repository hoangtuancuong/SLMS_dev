"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Exams", "is_private", {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Exams", "is_private");
	}
};
