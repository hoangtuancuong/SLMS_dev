"use strict";

const { GENDER, AWARD_TYPE } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("AdditionalStudentDatas", "homeroom_teacher_id", {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: "Users",
				key: "id"
			}
		});
		await queryInterface.addColumn("Users", "is_thaiphien", {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});
		await queryInterface.addColumn("Users", "gender", {
			type: Sequelize.ENUM(GENDER.values),
			allowNull: false
		});
		await queryInterface.addColumn("Users", "address", {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.addColumn("AdditionalTeacherDatas", "degree", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.addColumn("AdditionalTeacherDatas", "speciality", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.addColumn("AdditionalTeacherDatas", "university", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.addColumn("Awards", "image", {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.addColumn("Awards", "type", {
			type: Sequelize.ENUM(AWARD_TYPE.values),
			allowNull: false
		});
		await queryInterface.changeColumn("Awards", "time", {
			type: Sequelize.DATE,
			allowNull: true
		});
		await queryInterface.changeColumn("Awards", "description", {
			type: Sequelize.STRING,
			allowNull: true
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("AdditionalStudentDatas", "homeroom_teacher_id");
		await queryInterface.removeColumn("Users", "is_thaiphien");
		await queryInterface.removeColumn("Users", "gender");
		await queryInterface.removeColumn("Users", "address");
		await queryInterface.removeColumn("AdditionalTeacherDatas", "degree");
		await queryInterface.removeColumn("AdditionalTeacherDatas", "speciality");
		await queryInterface.removeColumn("AdditionalTeacherDatas", "university");
		await queryInterface.removeColumn("Awards", "image");
		await queryInterface.removeColumn("Awards", "type");
		await queryInterface.changeColumn("Awards", "description", {
			type: Sequelize.STRING,
			allowNull: false
		});
		await queryInterface.changeColumn("Awards", "time", {
			type: Sequelize.DATE,
			allowNull: false
		});
	}
};
