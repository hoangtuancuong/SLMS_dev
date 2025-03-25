"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Exams", "content", {
			type: Sequelize.TEXT,
			allowNull: true
		});
		await queryInterface.addColumn("Exams", "note", {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.changeColumn("Exams", "drive_url", {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.changeColumn("Exams", "key", {
			type: Sequelize.STRING,
			allowNull: true
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("Exams", "content");
		await queryInterface.removeColumn("Exams", "note");
		await queryInterface.changeColumn("Exams", "drive_url", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.changeColumn("Exams", "key", {
			type: Sequelize.STRING,
			allowNull: false
		});
	}
};
