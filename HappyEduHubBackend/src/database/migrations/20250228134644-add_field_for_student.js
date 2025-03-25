"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("AdditionalStudentDatas", "cccd", {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.addColumn("AdditionalStudentDatas", "school", {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.addColumn("AdditionalStudentDatas", "class", {
			type: Sequelize.STRING,
			allowNull: true
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("AdditionalStudentDatas", "cccd");
		await queryInterface.removeColumn("AdditionalStudentDatas", "school");
		await queryInterface.removeColumn("AdditionalStudentDatas", "class");
	}
};
