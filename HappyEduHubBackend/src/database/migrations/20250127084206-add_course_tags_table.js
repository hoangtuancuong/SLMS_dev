"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("CourseTags", {
			course_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Courses",
					key: "id"
				},
				primaryKey: true,
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			},
			tag_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Tags",
					key: "id"
				},
				primaryKey: true,
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			}
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("CourseTags");
	}
};
