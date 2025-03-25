import Sequelize, { Model } from "sequelize";
import { EXAM_TYPE } from "../utils/const.js";

class Exam extends Model {
	static init(sequelize) {
		super.init(
			{
				drive_url: {
					type: Sequelize.STRING,
					allowNull: true
				},
				key: {
					type: Sequelize.STRING,
					allowNull: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				is_private: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				},
				teacher_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				content: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				note: {
					type: Sequelize.STRING,
					allowNull: true
				},
				exam_type: {
					type: Sequelize.ENUM(EXAM_TYPE.values),
					allowNull: false
				}
			},
			{
				sequelize,
				timestamps: true,
				createdAt: "created_at",
				updatedAt: "updated_at"
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "teacher_id", as: "teacher" });
	}
}

export default Exam;
