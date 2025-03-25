"use strict";

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable("Scores", {
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
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			},
			assignment_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Assignments",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			},
			score: {
				type: Sequelize.DOUBLE,
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

	down: (queryInterface) => queryInterface.dropTable("Scores")
};
