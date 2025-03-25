"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Blogs", "is_approved", {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});
		await queryInterface.renameColumn("Blogs", "user_id", "author_id");
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Blogs", "is_approved");
		await queryInterface.renameColumn("Blogs", "author_id", "user_id");
	}
};
