"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Courses", "is_private", {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Courses", "is_private");
	}
};
