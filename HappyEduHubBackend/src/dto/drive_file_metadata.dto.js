import DriveFileMetadata from "../models/DriveFileMetadata.js";

const driveFileMetadataDto = {
	create: async (data, transaction) => {
		return DriveFileMetadata.create(data, { transaction });
	},

	findByHash: async (hash, transaction) => {
		return DriveFileMetadata.findOne({ where: { hash }, transaction });
	}
};

export default driveFileMetadataDto;
