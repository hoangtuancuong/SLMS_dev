"use strict";

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable("Awards", {
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
			description: {
				allowNull: false,
				type: Sequelize.STRING
			},
			time: {
				allowNull: false,
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

	down: (queryInterface) => queryInterface.dropTable("Awards")
};
