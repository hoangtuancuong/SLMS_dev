import * as Yup from "yup";

import awardDto from "../dto/award.dto.js";
import userDto from "../dto/user.dto.js";
import { connection } from "../services/sequelize.service.js";
import { NotFoundError } from "../utils/ApiError.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";
import { AWARD_TYPE } from "../utils/const.js";

const awardController = {
	find: async (req, res, next) => {
		let querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				user_id: YUP_UTILS.number("user_id"),
				from_time: YUP_UTILS.date("from_time"),
				to_time: YUP_UTILS.date("to_time"),
				type: YUP_UTILS.string("type").oneOf(
					AWARD_TYPE.values,
					"`type` cần phải là một trong các giá trị sau: " + AWARD_TYPE.values + "."
				)
			}),
			sort: YUP_UTILS.object({
				time: YUP_UTILS.sort("time")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const awards = await awardDto.find(req.query, transaction);
			const total = await awardDto.total({ filter: req.query.filter }, transaction);
			await transaction.commit();
			res.status(200).json({
				data: awards,
				meta: {
					limit: req.query.limit,
					offset: req.query.offset,
					total: total
				}
			});
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	findById: async (req, res, next) => {
		let idSchema = YUP_UTILS.number("id").required("Id là bắt buộc.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			let award = await awardDto.findById(req.params.id, transaction);
			if (award == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy giải thưởng có id là " + req.params.id + "."));
			}
			await transaction.commit();
			res.status(200).json(award);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	create: async (req, res, next) => {
		let bodySchema = YUP_UTILS.body({
			user_id: YUP_UTILS.number("user_id").required("Cần phải có `user_id`."),
			time: YUP_UTILS.date("time"),
			description: YUP_UTILS.string("description"),
			image: YUP_UTILS.string("image"),
			type: YUP_UTILS.string("type").oneOf(
				AWARD_TYPE.values,
				"`type` cần phải là một trong các giá trị sau: " + AWARD_TYPE.values + "."
			)
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			let user = await userDto.find({ id: req.body.user_id }, transaction);
			if (user == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy người dùng có id là " + req.body.user_id + "."));
			}
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}

		try {
			let award = await awardDto.create(req.body, transaction);
			res.status(201).json(await awardDto.findById(award.id, transaction));
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	update: async (req, res, next) => {
		let idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		let award;
		try {
			award = await awardDto.findById(req.params.id, transaction);
			if (award == null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy giải thưởng có id là " + req.params.id + "."));
			}
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}

		const bodySchema = YUP_UTILS.body({
			user_id: YUP_UTILS.number("user_id"),
			time: YUP_UTILS.date("time"),
			description: YUP_UTILS.string("description"),
			image: YUP_UTILS.string("image"),
			type: YUP_UTILS.string("type").oneOf(
				AWARD_TYPE.values,
				"`type` cần phải là một trong các giá trị sau: " + AWARD_TYPE.values + "."
			)
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Ít nhất một trường là bắt buộc.", (value) => {
			return Object.keys(value).length > 0;
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		try {
			award = await awardDto.update(award, req.body, transaction);
			await transaction.commit();
			res.status(200).json(award);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	delete: async (req, res, next) => {
		let idSchema = Yup.number().required("Id là bắt buộc.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const result = await awardDto.delete(req.params.id, transaction);
			if (result == 0) {
				return next(new NotFoundError("Không tìm thấy giải thưởng có id là " + req.params.id + "."));
			}
			await transaction.commit();
			res.status(200).json({ message: "Giải thưởng đã được xóa thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default awardController;
