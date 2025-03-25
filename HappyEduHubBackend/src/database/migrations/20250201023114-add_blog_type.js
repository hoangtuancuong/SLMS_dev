"use strict";

const { BLOG_TYPE } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Blogs", "type", {
			type: Sequelize.ENUM(BLOG_TYPE.values),
			allowNull: false,
			defaultValue: BLOG_TYPE.POST
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("Blogs", "type");
	}
};
