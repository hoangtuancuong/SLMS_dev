import Sequelize, { Model } from "sequelize";
import { BLOG_TYPE } from "../utils/const.js";
import CourseBlog from "./CourseBlog.js";

class Blog extends Model {
	static init(sequelize) {
		super.init(
			{
				author_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "Users",
						key: "id"
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE"
				},
				title: {
					type: Sequelize.STRING,
					allowNull: false
				},
				content: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				thumbnail_url: {
					type: Sequelize.STRING,
					allowNull: true
				},
				is_approved: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				type: {
					type: Sequelize.ENUM(BLOG_TYPE.values),
					allowNull: false,
					defaultValue: BLOG_TYPE.POST
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
		this.belongsTo(models.User, { foreignKey: "author_id", as: "author" });
		this.belongsToMany(models.Course, {
			through: CourseBlog,
			foreignKey: "blog_id",
			as: "courses",
			timestamps: false
		});
	}
}

export default Blog;
