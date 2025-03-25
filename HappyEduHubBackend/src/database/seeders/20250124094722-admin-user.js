"use strict";

const bcrypt = require("bcryptjs");
const { ROLE } = require("../../utils/const");

/** @type {import('sequelize-cli').Seed} */
module.exports = {
	async up(queryInterface) {
		const hashedPassword = await bcrypt.hash("admin1234", 8);

		await queryInterface.bulkInsert("Users", [
			{
				name: "Admin Admin",
				email: "admin@example.com",
				password_hash: hashedPassword,
				role: ROLE.ADMIN,
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("Users", null, {});
	}
};
