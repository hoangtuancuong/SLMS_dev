import { Model } from "sequelize";
import Sequelize from "sequelize";

class DriveFileMetadata extends Model {
	static init(sequelize) {
		return super.init(
			{
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
					// How to make this field not output in json>
					type: Sequelize.STRING,
					allowNull: false
				}
			},
			{
				sequelize,
				timestamps: true,
				tableName: "DriveFileMetadatas",
				createdAt: "created_at",
				updatedAt: "updated_at"
			}
		);
	}

	toJSON() {
		const object = this.get();
		delete object.hash;
		return object;
	}
}

export default DriveFileMetadata;
