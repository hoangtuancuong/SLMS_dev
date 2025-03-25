"use strict";

const { ASSIGNMENT_TYPE } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("Assignments", [
			{
				exam_id: 1,
				course_id: 1,
				name: "Test assignment 1",
				assignment_type: ASSIGNMENT_TYPE.TEST,
				note: "Test note 1",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				exam_id: 3,
				course_id: 1,
				name: "Test assignment 2",
				assignment_type: ASSIGNMENT_TYPE.EXCERCISE,
				note: "Test note 2",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				exam_id: 2,
				course_id: 1,
				name: "Test assignment private 3",
				assignment_type: ASSIGNMENT_TYPE.TEST,
				note: "This is a private assignment",
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("Assignments", null, {});
	}
};
