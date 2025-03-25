"use strict";

const { LESSON_STATUS } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("CourseLessons", {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
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
			index: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: JSON.stringify([LESSON_STATUS.NORMAL])
			},
			shift: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			take_place_at: {
				type: Sequelize.DATE,
				allowNull: false
			},
			room: {
				type: Sequelize.STRING,
				allowNull: false
			},
			note: {
				type: Sequelize.TEXT,
				allowNull: true
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

		await queryInterface.addColumn("Courses", "is_generated", {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("CourseLessons");
		await queryInterface.removeColumn("Courses", "is_generated");
	}
};
