"use strict";

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable("Blogs", {
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
			title: {
				allowNull: false,
				type: Sequelize.STRING
			},
			content: {
				allowNull: false,
				type: Sequelize.STRING
			},
			thumbnail_url: {
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

	down: (queryInterface) => queryInterface.dropTable("Blogs")
};
