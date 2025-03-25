"use strict";

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable("AdditionalStudentDatas", {
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id"
				}
			},
			first_contact_name: {
				allowNull: false,
				type: Sequelize.STRING
			},
			first_contact_tel: {
				allowNull: false,
				type: Sequelize.STRING
			},
			second_contact_name: {
				allowNull: true,
				type: Sequelize.STRING
			},
			second_contact_tel: {
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

	down: (queryInterface) => queryInterface.dropTable("AdditionalStudentDatas")
};
