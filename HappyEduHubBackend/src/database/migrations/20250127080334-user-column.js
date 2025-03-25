"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Users", "date_of_birth", {
			type: Sequelize.DATE,
			allowNull: true
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Users", "date_of_birth");
	}
};
