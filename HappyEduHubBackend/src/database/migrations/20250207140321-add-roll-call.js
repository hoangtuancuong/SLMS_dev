"use strict";

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable("RollCalls", {
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
			lesson_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "CourseLessons",
					key: "id"
				}
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false
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

	down: (queryInterface) => queryInterface.dropTable("RollCalls")
};
