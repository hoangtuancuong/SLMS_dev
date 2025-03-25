import { Op, Sequelize } from "sequelize";
import User from "../models/User.js";
import AdditionalStudentData from "../models/AdditionalStudentData.js";
import { NotFoundError, UnauthorizedError, UserExistError } from "../utils/ApiError.js";
import { ROLE } from "../utils/const.js";
import AdditionalTeacherData from "../models/AdditionalTeacherData.js";
import Tag from "../models/Tag.js";

function createWhereClause(filter) {
	let where = {};
	if (filter) {
		if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };
		if (filter.email) where.email = { [Op.like]: `%${filter.email}%` };
		if (filter.phone_number) where.phone_number = { [Op.like]: `%${filter.phone_number}%` };
		if (filter.role) where.role = filter.role;
		if (filter.date_of_birth) where.date_of_birth = filter.date_of_birth;
		if (filter.gender) where.gender = filter.gender;
		if (filter.code) where.code = { [Op.like]: `%${filter.code}%` };
	}
	return where;
}

function createOrderClause(sort) {
	let order = [];
	if (sort) {
		for (const key in sort) order.push([key, sort[key]]);
	}
	return order;
}

function createIncludeClause() {
	return [
		{
			model: AdditionalStudentData,
			required: false,
			as: "additional_student_data",
			on: Sequelize.literal("`User`.`id` = `additional_student_data`.`user_id` AND `User`.`role` = 'STUDENT'")
		},
		{
			model: AdditionalTeacherData,
			required: false,
			attributes: ["portfolio"],
			include: {
				model: Tag,
				as: "subject",
				attributes: ["name", "code_fragment", "note"]
			},
			as: "additional_teacher_data",
			on: Sequelize.literal("`User`.`id` = `additional_teacher_data`.`user_id` AND `User`.`role` = 'TEACHER'")
		}
	];
}

const userDto = {
	create: async (data, transaction) => {
		const userExists = await User.findOne({ where: { email: data.email }, transaction });
		if (userExists) throw new UserExistError("Email đã được sử dụng.");
		const user = await User.create({ ...data, role: ROLE.STUDENT }, { transaction });
		await user.update({ code: `HS.${data.date_of_birth.getFullYear()}.${user.id}` }, { transaction });
		return user;
	},

	createByAdmin: async (data, transaction) => {
		const userExists = await User.findOne({ where: { email: data.email }, transaction });
		if (userExists) throw new UserExistError("Email đã được sử dụng.");
		return User.create(data, { transaction });
	},

	getAll: async ({ limit, offset, filter, sort }, transaction) => {
		let where = createWhereClause(filter);
		let order = createOrderClause(sort);
		let include = createIncludeClause();
		const users = await User.findAll({ limit, offset, where, order, include, transaction });
		const total = await User.count({ where, transaction });
		return {
			data: users,
			meta: {
				limit,
				offset,
				total
			}
		};
	},

	find: async (id, transaction) => {
		let include = createIncludeClause();
		const user = await User.findByPk(id, { include, transaction });
		if (!user) throw new NotFoundError("Không tìm thấy người dùng với id: " + id + ".");
		console.log(user.additional_student_data);
		return user;
	},

	findAll: async ({ filter }, transaction) => {
		let where = createWhereClause(filter);
		let include = createIncludeClause();
		const users = await User.findAll({ where, include, transaction });
		return users;
	},

	changePassword: async (data, userId, transaction) => {
		const oldPassword = data.old_password;

		const user = await User.unscoped().findByPk(userId, { transaction });

		if (oldPassword && !(await user.checkPassword(oldPassword)))
			throw new UnauthorizedError("Mật khẩu đã nhập không đúng.");

		await user.update(data, { transaction });
	},

	delete: async (id, transaction) => {
		const user = await User.findByPk(id, { transaction });
		if (!user) throw new NotFoundError("Không tìm thấy người dùng với id: " + id + ".");

		await user.destroy({ transaction });
	},

	update: async (data, userId, transaction) => {
		let user = await User.findByPk(userId, { transaction });
		if (!user) throw new NotFoundError("Không tìm thấy người dùng với id: " + userId + ".");
		user = await user.update(data, { transaction });
		return user;
	},

	bulkStudentCreate: async (student_data, transaction) => {
		let returnData;
		try {
			for (let index = 0; index < student_data.length; index++) {
				const elm = student_data[index];
				const userParams = {
					name: elm.name,
					email: elm.email,
					password: "Abc@1234",
					phone_number: elm.phone_number,
					date_of_birth: elm.date_of_birth,
					gender: elm.gender,
					address: elm.address,
					role: ROLE.STUDENT,
					is_thaiphien: elm.is_thaiphien
				};

				const existUser = await User.findOne({ where: { email: elm.email }, transaction });
				if (existUser) {
					returnData = {
						status: "FAIL",
						message: `Email đã được sử dụng ở vị trí thứ ${index + 1}.`,
						error: null,
						index
					};
					throw new Error(returnData.message);
				}

				const user = await User.create(userParams, { transaction });
				await user.update(
					{ code: `HS${elm.is_thaiphien ? "TP" : ""}.${elm.date_of_birth.getFullYear()}.${user.id}` },
					{ transaction }
				);

				// Check hoomroom_teacher if that person exist
				if (elm.homeroom_teacher_id) {
					const homeroomTeacher = await User.findByPk(elm.homeroom_teacher_id, { transaction });
					if (!homeroomTeacher) {
						returnData = {
							status: "FAIL",
							message: `Mã giáo viên chủ nhiệm không tồn tại.`,
							error: null,
							index
						};
						throw new Error(returnData.message);
					}
				}

				const additionalStudentDataParams = {
					user_id: user.id,
					first_contact_name: elm.first_contact_name,
					first_contact_tel: elm.first_contact_tel,
					second_contact_name: elm.second_contact_name ?? null,
					second_contact_tel: elm.second_contact_tel ?? null,
					homeroom_teacher_id: elm.homeroom_teacher_id,
					cccd: elm.cccd,
					class: elm.class,
					school: elm.school
				};

				await AdditionalStudentData.create(additionalStudentDataParams, { transaction });
			}

			returnData = {
				status: "SUCCESS",
				message: `Tạo người dùng thành công.`
			};
		} catch (error) {
			console.log(error);
			returnData = {
				status: "FAIL",
				message: `Lỗi không xác định khi tạo người dùng thứ ${returnData?.index !== undefined ? returnData.index + 1 : "không xác định"}.`,
				error,
				index: returnData?.index
			};
		}
		return returnData;
	},
	findOne: async ({filter}, transaction) => {
        let where = createWhereClause(filter);
        let include = createIncludeClause();
        const user = await User.findOne({ where, include, transaction });
        return user;
    }
};

export default userDto;
