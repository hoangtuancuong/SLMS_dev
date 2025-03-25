import { connection } from "../services/sequelize.service.js";
import transactionDto from "../dto/transaction.dto.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";
import { TRANSACTION_STATUS } from "../utils/const.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import receiptDto from "../dto/receipt.dto.js";
import Transaction from "../models/Transaction.js";
import userDto from "../dto/user.dto.js";

const transactionController = {
	findAll: async (req, res, next) => {
		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.number("limit").min(1).max(100).default(10),
			offset: YUP_UTILS.number("offset").min(0).default(0)
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const txn = await connection.transaction();
		try {
			const transactions = await transactionDto.findAll(req.query, txn);
			const total = await transactionDto.total(txn);
			await txn.commit();
			res.status(200).json({
				data: transactions,
				meta: {
					limit: req.query.limit,
					offset: req.query.offset,
					total: total
				}
			});
		} catch (error) {
			await txn.rollback();
			return next(error);
		}
	},
	findByReceiptId: async (req, res, next) => {
		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.number("limit").min(1).max(100).default(10),
			offset: YUP_UTILS.number("offset").min(0).default(0)
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const idSchema = YUP_UTILS.number("receiptId").required("Cần phải có `receiptId`.");
		try {
			req.params.receiptId = await idSchema.validate(req.params.receiptId);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const txn = await connection.transaction();
		try {
			const receipt = await receiptDto.findById(req.params.receiptId, txn);
			if (!receipt) {
				throw new NotFoundError("Không tìm thấy khoản thu với id là " + req.params.receiptId + ".");
			}

			const transactions = await transactionDto.findByReceiptId(req.query, req.params.receiptId, txn);
			const total = await transactionDto.totalByReceiptId(req.params.receiptId, txn);
			await txn.commit();
			res.status(200).json({
				data: transactions,
				meta: {
					limit: req.query.limit,
					offset: req.query.offset,
					total: total
				}
			});
		} catch (error) {
			await txn.rollback();
			return next(error);
		}
	},
	create: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			receipt_id: YUP_UTILS.number("receipt_id").required("Cần phải có `receipt_id`."),
			user_id: YUP_UTILS.number("user_id").required("Cần phải có `user_id`."),
			transaction_code: YUP_UTILS.string("transaction_code").required("Cần phải có `transaction_code`."),
			payment_method: YUP_UTILS.string("payment_method").required("Cần phải có `payment_method`."),
			amount: YUP_UTILS.number("amount").required("Cần phải có `amount`."),
			status: YUP_UTILS.string("status").oneOf(TRANSACTION_STATUS.values).required("Cần phải có `status`."),
			raw_response_from_gateway: YUP_UTILS.string("raw_response_from_gateway"),
			note: YUP_UTILS.string("note"),
			paid_at: YUP_UTILS.date("paid_at"),
			refunded_at: YUP_UTILS.date("refunded_at")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (error) {
			return catchValidationError(next, error);
		}

		try {
			JSON.parse(req.body.raw_response_from_gateway);
		} catch {
			return next(new ValidationError("raw_response_from_gateway không hợp lệ."));
		}

		const txn = await connection.transaction();
		try {
			const receipt = await receiptDto.findById(req.body.receipt_id, txn);
			if (!receipt) {
				throw new NotFoundError("Không tìm thấy khoản thu với id là " + req.body.receipt_id + ".");
			}

			const user = await userDto.find(req.body.user_id, txn);
			if (!user) {
				throw new NotFoundError("Không tìm thấy người dùng với id là " + req.body.user_id + ".");
			}

			const transaction = await transactionDto.create(req.body, txn);
			await txn.commit();
			res.status(201).json(transaction);
		} catch (error) {
			await txn.rollback();
			return next(error);
		}
	},
	update: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const bodySchema = YUP_UTILS.body({
			transaction_code: YUP_UTILS.string("transaction_code"),
			payment_method: YUP_UTILS.string("payment_method"),
			amount: YUP_UTILS.number("amount"),
			status: YUP_UTILS.string("status").oneOf(TRANSACTION_STATUS.values),
			raw_response_from_gateway: YUP_UTILS.string("raw_response_from_gateway"),
			note: YUP_UTILS.string("note"),
			paid_at: YUP_UTILS.date("paid_at"),
			refunded_at: YUP_UTILS.date("refunded_at")
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Ít nhất một trường là bắt buộc.", (value) => {
			return Object.keys(value).length > 0;
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const txn = await connection.transaction();
		try {
			let transaction = await transactionDto.findById(req.params.id, txn);
			if (!transaction) {
				throw new NotFoundError("Không tìm thấy giao dịch với id là " + req.params.id + ".");
			}

			await transactionDto.update(req.params.id, req.body, txn);
			await txn.commit();
			transaction = await Transaction.findByPk(req.params.id);
			res.status(200).json(transaction);
		} catch (error) {
			await txn.rollback();
			return next(error);
		}
	},
	delete: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const txn = await connection.transaction();
		try {
			const numberOfDeletedTransaction = await transactionDto.delete(req.params.id, txn);
			if (numberOfDeletedTransaction === 0) {
				throw new NotFoundError("Không tìm thấy giao dịch với id là " + req.params.id + ".");
			}
			await txn.commit();
			res.status(200).json({ message: "Đã xóa giao dịch thành công." });
		} catch (error) {
			await txn.rollback();
			return next(error);
		}
	}
};

export default transactionController;
