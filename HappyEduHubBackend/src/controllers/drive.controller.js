import crypto from "crypto";
import driveFileMetadataDto from "../dto/drive_file_metadata.dto.js";
import driveService from "../services/drive.service.js";
import { connection } from "../services/sequelize.service.js";
import { ValidationError } from "../utils/ApiError.js";
import { YUP_UTILS, catchValidationError } from "../utils/utils.js";

const driveController = {
	upload: async (req, res, next) => {
		let file = req.file;
		try {
			if (!file) {
				throw new ValidationError("Cần phải có `file`.");
			} else if (file.size > 5 * 1024 * 1024) {
				throw new ValidationError("Kích thước không được vượt quá 5MB.");
			}
		} catch (error) {
			return next(error);
		}

		const transaction = await connection.transaction();
		try {
			const hash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");
			let driveFileMetadata = await driveFileMetadataDto.findByHash(hash, transaction);
			if (driveFileMetadata) {
				return res.status(200).json(driveFileMetadata.toJSON());
			}

			const metadata = await driveService.upload(req.file);
			const driveFileMetadataNew = await driveFileMetadataDto.create({
				name: metadata.name,
				file_id: metadata.id,
				size: metadata.size,
				type: metadata.mimeType,
				web_view_link: metadata.webViewLink,
				web_content_link: metadata.webContentLink,
				hash: hash
			});
			await transaction.commit();
			return res.status(200).json(driveFileMetadataNew.toJSON());
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	findFiles: async (req, res, next) => {
		const querySchema = YUP_UTILS.object({
			q: YUP_UTILS.string().optional(),
			pageToken: YUP_UTILS.string().optional(),
			pageSize: YUP_UTILS.number().optional().default(10),
		});

		try {
			req.query = await querySchema.validate(req.query);
		} catch (error) {
			return catchValidationError(error, res);
		}

		try {
			const result = await driveService.list(req.query);
			return res.status(200).json(result);
		} catch (error) {
			return next(error);
		}
	},

	findFilesById: async (req, res, next) => {
		const idSchema = YUP_UTILS.string().required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(error, res);
		}

		try {
			const file = await driveService.get(req.params.id);
			return res.status(200).json(file);
		} catch (error) {
			return next(error);
		}
	},

	deleteById: async (req, res, next) => {
		const idSchema = YUP_UTILS.string().required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(error, res);
		}

		try {
			await driveService.deleteById(req.params.id);
			return res.status(200).json({
				message: "Đã xóa file thành công."
			});
		} catch (error) {
			return next(error);
		}
	},

	recoverableDeleteById: async (req, res, next) => {
		const idSchema = YUP_UTILS.string().required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(error, res);
		}

		try {
			await driveService.recoverableDeleteById(req.params.id);
			return res.status(200).json({
				message: "Đã đưa file vào thùng rác thành công."
			});
		} catch (error) {
			return next(error);
		}
	},

	recoverById: async (req, res, next) => {
		const idSchema = YUP_UTILS.string().required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(error, res);
		}

		try {
			await driveService.recoverById(req.params.id);
			return res.status(200).json({
				message: "Đã khôi phục file thành công."
			});
		} catch (error) {
			return next(error);
		}
	}
};

export default driveController;
