import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";
import CourseMember from "./CourseMember.js";
import { GENDER } from "../utils/const.js";

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				email: Sequelize.STRING,
				password: Sequelize.VIRTUAL, //When it is VIRTUAL it does not exist in the database
				password_hash: Sequelize.STRING,
				role: Sequelize.STRING,
				phone_number: Sequelize.STRING,
				avatar_url: Sequelize.STRING,
				date_of_birth: Sequelize.DATE,
				code: {
					type: Sequelize.STRING,
					allowNull: true
				},
				is_thaiphien: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				gender: {
					type: Sequelize.ENUM(GENDER.values),
					allowNull: false
				},
				address: {
					type: Sequelize.STRING,
					allowNull: true
				}
			},
			{
				sequelize,
				timestamps: true,
				createdAt: "created_at",
				updatedAt: "updated_at",

				defaultScope: {
					attributes: { exclude: ["password", "password_hash"] }
				}
			}
		);

		this.addHook("beforeSave", async (user) => {
			if (user.password) {
				user.password_hash = await bcrypt.hash(user.password, 8);
			}
		});

		return this;
	}

	static associate(models) {
		this.hasOne(models.AdditionalStudentData, { foreignKey: "user_id", as: "additional_student_data" });
		this.hasOne(models.AdditionalTeacherData, { foreignKey: "user_id", as: "additional_teacher_data" });
		this.belongsToMany(models.Course, {
			through: CourseMember,
			foreignKey: "user_id",
			as: "courses",
			timestamps: false
		});
	}

	checkPassword(password) {
		return bcrypt.compare(password, this.password_hash);
	}
}

export default User;
