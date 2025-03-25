"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Courses", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			fee: {
				type: Sequelize.FLOAT,
				allowNull: false
			},
			start_date: {
				type: Sequelize.DATE,
				allowNull: false
			},
			end_date: {
				type: Sequelize.DATE,
				allowNull: false
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

		await queryInterface.createTable("CourseTimes", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			course_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			day: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			start_time: {
				type: Sequelize.TIME,
				allowNull: false
			},
			end_time: {
				type: Sequelize.TIME,
				allowNull: false
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

		await queryInterface.addConstraint("CourseTimes", {
			type: "foreign key",
			fields: ["course_id"],
			references: {
				table: "Courses",
				field: "id"
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		});

		await queryInterface.createTable("CourseTags", {
			course_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: "Courses",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			},
			tag_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: "Tags",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			}
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("CourseTags");
		await queryInterface.dropTable("CourseTimes");
		await queryInterface.dropTable("Courses");
	}
};
