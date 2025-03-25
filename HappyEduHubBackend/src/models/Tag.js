import Sequelize, { Model } from "sequelize";
import CourseTag from "./CourseTag.js";

class Tag extends Model {
	static init(sequelize) {
		super.init(
			{
				name: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true
				},
				type: {
					type: Sequelize.STRING,
					allowNull: false
				},
				note: {
					type: Sequelize.STRING,
					allowNull: false
				},
				code_fragment: {
					type: Sequelize.STRING,
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
		this.belongsToMany(models.Course, {
			through: CourseTag,
			foreignKey: "tag_id",
			as: "courses",
			timestamps: false
		});
	}
}

export default Tag;
