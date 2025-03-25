"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("CourseBlogs", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			course_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Courses",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			},
			blog_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Blogs",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: new Date()
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: new Date()
			}
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("CourseBlogs");
	}
};
