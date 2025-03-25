"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("DriveFileMetadatas", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			file_id: {
				type: Sequelize.STRING,
				allowNull: false
			},
			name: Sequelize.STRING,
			size: Sequelize.INTEGER,
			type: Sequelize.STRING,
			web_view_link: Sequelize.STRING,
			web_content_link: Sequelize.STRING,
			hash: {
				type: Sequelize.STRING,
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
	},

	async down(queryInterface) {
		await queryInterface.dropTable("DriveFileMetadatas");
	}
};
