"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("Courses", [
			{
				// 1
				name: "Advanced English for 6th graders",
				description: "Khóa học Tiếng Anh nâng cao cho học sinh lớp 6",
				start_date: new Date(),
				end_date: (() => {
					let date = new Date();
					date.setMonth(date.getMonth() + 2);
					return date;
				})(),
				fee: 100000,
				is_private: false,
				is_approved: false,
				is_generated: false,
				code: "TA.6.01",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				// 2
				name: "Advanced Math for 9th graders",
				description: "Khóa học Toán nâng cao cho học sinh lớp 9",
				start_date: new Date(),
				end_date: (() => {
					let date = new Date();
					date.setMonth(date.getMonth() + 2);
					return date;
				})(),
				fee: 100000,
				is_private: true,
				is_approved: false,
				is_generated: false,
				code: "TH.9.01",
				created_at: new Date(),
				updated_at: new Date()
			}
		]);

		await queryInterface.bulkInsert("CourseShifts", [
			{
				course_id: 1,
				day: 1,
				shift: "1",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				course_id: 1,
				day: 2,
				shift: "2",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				course_id: 2,
				day: 3,
				shift: "3",
				created_at: new Date(),
				updated_at: new Date()
			}
		]);

		await queryInterface.bulkInsert("CourseTags", [
			{
				course_id: 1,
				tag_id: 5
			},
			{
				course_id: 1,
				tag_id: 9
			},
			{
				course_id: 2,
				tag_id: 1
			},
			{
				course_id: 2,
				tag_id: 12
			}
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("CourseShifts", null, {});
		await queryInterface.bulkDelete("CourseTags", null, {});
		await queryInterface.bulkDelete("Courses", null, {});
	}
};
