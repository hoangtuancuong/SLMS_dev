"use strict";

const bcrypt = require("bcryptjs");
const { ROLE } = require("../../utils/const");

/** @type {import('sequelize-cli').Seed} */
module.exports = {
	async up(queryInterface) {
		const hashedPassword = await bcrypt.hash("12345678", 8);

		await queryInterface.bulkInsert("Users", [
			{
				name: "Nguyễn Văn A",
				email: "student1@example.com",
				password_hash: hashedPassword,
				role: ROLE.STUDENT,
				date_of_birth: new Date("2007-01-01"),
				code: "HS.2007.01",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: "Trần Thị B",
				email: "student2@example.com",
				password_hash: hashedPassword,
				role: ROLE.STUDENT,
				date_of_birth: new Date("2005-01-01"),
				code: "HS.2005.02",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: "Trần Thị C",
				email: "student3@example.com",
				password_hash: hashedPassword,
				role: ROLE.STUDENT,
				date_of_birth: new Date("2006-01-01"),
				code: "HS.2006.03",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: "Nguyễn Hữu Việt",
				email: "teacher1@example.com",
				password_hash: hashedPassword,
				role: ROLE.TEACHER,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: "Trần Xuân Nam",
				email: "teacher2@example.com",
				password_hash: hashedPassword,
				role: ROLE.TEACHER,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: "Lương Thế C",
				email: "aafair1@example.com",
				password_hash: hashedPassword,
				role: ROLE.ACADEMIC_AFFAIR,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: "Cao Thị Hằng D",
				email: "aafair2@example.com",
				password_hash: hashedPassword,
				role: ROLE.ACADEMIC_AFFAIR,
				created_at: new Date(),
				updated_at: new Date()
			}
		]);

		await queryInterface.bulkInsert("AdditionalTeacherDatas", [
			{
				user_id: 4,
				subject_id: 1,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				user_id: 5,
				subject_id: 2,
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("Users", null, {});
	}
};
