"use strict";

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable("EntryExamMembers", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id"
				}
			},
			exam_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Exams",
					key: "id"
				}
			},
			score: {
				type: Sequelize.DOUBLE,
				allowNull: true
			},
			note: {
				allowNull: true,
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

	down: (queryInterface) => queryInterface.dropTable("EntryExamMembers")
};
