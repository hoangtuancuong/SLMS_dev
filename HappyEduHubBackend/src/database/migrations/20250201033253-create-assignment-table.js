"use strict";

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable("Assignments", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			exam_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Exams",
					key: "id"
				}
			},
			course_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Courses",
					key: "id"
				}
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			assignment_type: {
				allowNull: false,
				type: Sequelize.STRING
			},
			note: {
				allowNull: true,
				type: Sequelize.STRING
			},
			start_time: {
				allowNull: true,
				type: Sequelize.DATE
			},
			end_time: {
				allowNull: true,
				type: Sequelize.DATE
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: new Date()
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: new Date()
			}
		}),

	down: (queryInterface) => queryInterface.dropTable("Assignments")
};
