"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Courses", "code", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.addColumn("Users", "code", {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.addColumn("Tags", "code_fragment", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.createTable("AdditionalTeacherDatas", {
			user_id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: {
					model: "Users",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			},
			subject_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Tags",
					key: "id"
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
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
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Courses", "code");
		await queryInterface.removeColumn("Users", "code");
		await queryInterface.removeColumn("Tags", "code_fragment");
		await queryInterface.dropTable("AdditionalTeacherDatas");
	}
};
