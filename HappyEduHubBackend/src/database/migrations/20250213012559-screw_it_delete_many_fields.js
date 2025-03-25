"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn("AdditionalTeacherDatas", "degree");
		await queryInterface.removeColumn("AdditionalTeacherDatas", "speciality");
		await queryInterface.removeColumn("AdditionalTeacherDatas", "university");
		await queryInterface.addColumn("AdditionalTeacherDatas", "portfolio", {
			type: Sequelize.TEXT,
			allowNull: false,
			defaultValue: "{}"
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.addColumn("AdditionalTeacherDatas", "degree", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.addColumn("AdditionalTeacherDatas", "speciality", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.addColumn("AdditionalTeacherDatas", "university", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.removeColumn("AdditionalTeacherDatas", "portfolio");
	}
};
