"use strict";

const { TAG_TYPE } = require("../../utils/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("Tags", [
			{
				// 1
				name: "Toán",
				type: TAG_TYPE.SUBJECT,
				note: "Môn học Toán",
				code_fragment: "TH"
			},
			{
				// 2
				name: "Lý",
				type: TAG_TYPE.SUBJECT,
				note: "Môn học Lý",
				code_fragment: "VL"
			},
			{
				// 3
				name: "Hóa",
				type: TAG_TYPE.SUBJECT,
				note: "Môn học Hóa",
				code_fragment: "HH"
			},
			{
				// 4
				name: "Văn",
				type: TAG_TYPE.SUBJECT,
				note: "Môn học Văn",
				code_fragment: "VH"
			},
			{
				// 5
				name: "Anh",
				type: TAG_TYPE.SUBJECT,
				note: "Môn học Anh",
				code_fragment: "TA"
			},
			{
				// 6
				name: "Sinh",
				type: TAG_TYPE.SUBJECT,
				note: "Môn học Sinh",
				code_fragment: "SH"
			},
			{
				// 7
				name: "Tin",
				type: TAG_TYPE.SUBJECT,
				note: "Môn học Tin",
				code_fragment: "TI"
			},
			{
				// 8
				name: "Mỹ thuật",
				type: TAG_TYPE.SUBJECT,
				note: "Môn học Mỹ thuật",
				code_fragment: "MT"
			},
			{
				// 9
				name: "Lớp 6",
				type: TAG_TYPE.GRADE,
				note: "Lớp 6",
				code_fragment: "6"
			},
			{
				// 10
				name: "Lớp 7",
				type: TAG_TYPE.GRADE,
				note: "Lớp 7",
				code_fragment: "7"
			},
			{
				// 11
				name: "Lớp 8",
				type: TAG_TYPE.GRADE,
				note: "Lớp 8",
				code_fragment: "8"
			},
			{
				// 12
				name: "Lớp 9",
				type: TAG_TYPE.GRADE,
				note: "Lớp 9",
				code_fragment: "9"
			},
			{
				// 13
				name: "Lớp 10",
				type: TAG_TYPE.GRADE,
				note: "Lớp 10",
				code_fragment: "10"
			},
			{
				// 14
				name: "Lớp 11",
				type: TAG_TYPE.GRADE,
				note: "Lớp 11",
				code_fragment: "11"
			},
			{
				// 15
				name: "Lớp 12",
				type: TAG_TYPE.GRADE,
				note: "Lớp 12",
				code_fragment: "12"
			}
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("Tags", null, {});
	}
};
