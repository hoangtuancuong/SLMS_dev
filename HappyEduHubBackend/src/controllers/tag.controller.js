import tagDto from "../dto/tag.dto.js";
import { connection } from "../services/sequelize.service.js";
import { NotFoundError } from "../utils/ApiError.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

const tagController = {
	find: async (req, res, next) => {
		const transaction = await connection.transaction();
		try {
			res.status(200).json(await tagDto.findAll(transaction));
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	findById: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const tag = await tagDto.findById(req.params.id, transaction);
			if (tag == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy tag có id là " + req.params.id + "."));
			}
			await transaction.commit();
			res.status(200).json(tag);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	create: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			name: YUP_UTILS.string("name").required("Cần phải có `name`."),
			type: YUP_UTILS.tag("type").required("Cần phải có `type`."),
			note: YUP_UTILS.string("note").required("Cần phải có `note`."),
			code_fragment: YUP_UTILS.string("code_fragment").required("Cần phải có `code_fragment`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const tag = await tagDto.create(req.body, transaction);
			await transaction.commit();
			res.status(201).json(tag);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	update: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		let tag;
		try {
			tag = await tagDto.findById(req.params.id, transaction);
			if (tag == null) {
				await transaction.rollback();
				return next(new NotFoundError("Can't find tag of which id is " + req.params.id + "."));
			}
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}

		const bodySchema = YUP_UTILS.body({
			name: YUP_UTILS.string("name"),
			type: YUP_UTILS.tag("type"),
			note: YUP_UTILS.string("note"),
			code_fragment: YUP_UTILS.string("code_fragment")
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Ít nhất một trường là bắt buộc.", (value) => {
			return Object.keys(value).length > 0;
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		try {
			let tag = await tagDto.findById(req.params.id, transaction);
			if (tag == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy tag có id là " + req.params.id + "."));
			}
			tag = await tagDto.update(tag, req.body, transaction);
			await transaction.commit();
			res.status(200).json(tag);
		} catch (error) {
			console.log(error);
			await transaction.rollback();
			return next(error);
		}
	},
	delete: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const result = await tagDto.delete(req.params.id, transaction);
			if (result == 0) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy tag có id là " + req.params.id + "."));
			}
			await transaction.commit();
			res.status(200).json({ message: "Tag đã được xóa thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default tagController;
