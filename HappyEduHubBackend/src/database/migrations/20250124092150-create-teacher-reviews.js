"use strict";

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable("TeacherReviews", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			teacher_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id"
				}
			},
			student_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id"
				}
			},
			rate: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			description: {
				allowNull: false,
				type: Sequelize.STRING
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

	down: (queryInterface) => queryInterface.dropTable("TeacherReviews")
};
