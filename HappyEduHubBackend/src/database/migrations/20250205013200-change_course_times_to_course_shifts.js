"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameTable("CourseTimes", "CourseShifts");
		await queryInterface.removeColumn("CourseShifts", "start_time");
		await queryInterface.removeColumn("CourseShifts", "end_time");
		await queryInterface.addColumn("CourseShifts", "shift", {
			type: Sequelize.INTEGER,
			allowNull: false
		});
		await queryInterface.addColumn("CourseShifts", "room", {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.renameTable("Members", "CourseMembers");
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameTable("CourseShifts", "CourseTimes");
		await queryInterface.addColumn("CourseTimes", "start_time", {
			type: Sequelize.TIME,
			allowNull: false
		});
		await queryInterface.addColumn("CourseTimes", "end_time", {
			type: Sequelize.TIME,
			allowNull: false
		});
		await queryInterface.removeColumn("CourseShifts", "shift");
		await queryInterface.removeColumn("CourseShifts", "room");
		await queryInterface.renameTable("CourseMembers", "Members");
	}
};
