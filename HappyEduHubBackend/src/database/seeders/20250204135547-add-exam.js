"use strict";

const { EXAM_TYPE } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("Exams", [
			{
				drive_url: "https://example.com/exam1",
				key: "ABCD",
				name: "Test example 1",
				is_private: false,
				teacher_id: 5,
				content: "Test content 1",
				note: "Test note 1",
				created_at: new Date(),
				updated_at: new Date(),
				exam_type: EXAM_TYPE.ASSIGNMENT
			},
			{
				drive_url: "https://example.com/exam2",
				key: "ABCD",
				name: "Test example 2",
				is_private: true,
				teacher_id: 5,
				content: "Test content 2",
				note: "Test note 2",
				created_at: new Date(),
				updated_at: new Date(),
				exam_type: EXAM_TYPE.ENTRY_EXAM
			},
			{
				drive_url: "https://example.com/exam3",
				key: "ABCD",
				name: "Test example 3",
				is_private: false,
				teacher_id: 6,
				content: "Test content 3",
				note: "Test note 3",
				created_at: new Date(),
				updated_at: new Date(),
				exam_type: EXAM_TYPE.ASSIGNMENT
			},
			{
				drive_url: "https://example.com/exam4",
				key: "ABCD",
				name: "Test example 4",
				is_private: true,
				teacher_id: 6,
				content: "Test content 4",
				note: "Test note 4",
				created_at: new Date(),
				updated_at: new Date(),
				exam_type: EXAM_TYPE.ASSIGNMENT
			}
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("Exams", null, {});
	}
};
