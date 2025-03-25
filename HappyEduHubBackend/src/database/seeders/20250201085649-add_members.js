"use strict";

const { MEMBER_STATUS } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("CourseMembers", [
			{
				// 1
				user_id: 5,
				course_id: 1,
				status: MEMBER_STATUS.APPROVED,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				// 2
				user_id: 2,
				course_id: 1,
				status: MEMBER_STATUS.APPROVED,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				// 3
				user_id: 3,
				course_id: 1,
				status: MEMBER_STATUS.PENDING,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				// 4
				user_id: 4,
				course_id: 1,
				status: MEMBER_STATUS.REJECTED,
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("Members", null, {});
	}
};
