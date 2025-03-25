"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("Scores", [
			{
				user_id: 2,
				assignment_id: 1,
				score: 10.0,
				note: "",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				user_id: 3,
				assignment_id: 1,
				score: 7.25,
				note: "",
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				user_id: 4,
				assignment_id: 1,
				score: 6.5,
				note: "",
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("Scores", null, {});
	}
};
