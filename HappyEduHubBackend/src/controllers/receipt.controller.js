import { connection } from "../services/sequelize.service.js";
import receiptDto from "../dto/receipt.dto.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";
import courseMemberDto from "../dto/course_member.dto.js";
import { ROLE } from "../utils/const.js";
import { ForbiddenError, NotFoundError } from "../utils/ApiError.js";
import courseDto from "../dto/course.dto.js";
import Receipt from "../models/Receipt.js";

const receiptController = {
	findAll: async (req, res, next) => {
		const transaction = await connection.transaction();
		try {
			const receipts = await receiptDto.findAll(transaction);
			await transaction.commit();
			res.status(200).json(receipts);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	findByCourseId: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("courseId").required("Cần phải có `courseId`.");
		try {
			req.params.courseId = await idSchema.validate(req.params.courseId);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const member = await courseMemberDto.findByCourseIdAndUserId(
				{ course_id: req.params.courseId, user_id: req.userId },
				transaction
			);
			if (req.role !== ROLE.ADMIN && req.role !== ROLE.ACADEMIC_AFFAIR && !member && req.role !== ROLE.KETOAN) {
				throw new ForbiddenError("Bạn không có quyền truy cập vào khoản thu của khóa học này này.");
			}
			const receipts = await receiptDto.findByCourseId(req.params.courseId, transaction);
			await transaction.commit();
			res.status(200).json(receipts);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	create: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			course_id: YUP_UTILS.number("course_id").required("Cần phải có `course_id`."),
			name: YUP_UTILS.string("name").required("Cần phải có `name`."),
			amount: YUP_UTILS.number("amount").required("Cần phải có `amount`."),
			deadline: YUP_UTILS.date("deadline").required("Cần phải có `deadline`."),
			document_url: YUP_UTILS.string("document_url"),
			note: YUP_UTILS.string("note")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			const course = await courseDto.findById(req.body.course_id, transaction);
			if (!course) {
				throw new NotFoundError("Không tìm thấy khóa học với id là " + req.body.course_id + ".");
			}

			const member = await courseMemberDto.findByCourseIdAndUserId(
				{ course_id: req.body.course_id, user_id: req.userId },
				transaction
			);
			if (req.role === ROLE.TEACHER && !member) {
				throw new ForbiddenError("Bạn không có quyền tạo khoản thu cho khóa học này.");
			}

			const receipt = await receiptDto.create(req.body, transaction);
			await transaction.commit();
			res.status(201).json(receipt);
		} catch (error) {
			await transaction.rollback();
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
			name: YUP_UTILS.string("name"),
			amount: YUP_UTILS.number("amount"),
			deadline: YUP_UTILS.date("deadline"),
			document_url: YUP_UTILS.string("document_url"),
			note: YUP_UTILS.string("note")
		}).test("AT_LEAST_ONE_FIELD_REQUIRED", "Ít nhất một trường là bắt buộc.", (value) => {
			return Object.keys(value).length > 0;
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (error) {
			return catchValidationError(next, error);
		}

		const transaction = await connection.transaction();
		try {
			let receipt = await receiptDto.findById(req.params.id, transaction);
			if (!receipt) {
				throw new NotFoundError("Không tìm thấy khoản thu với id là " + req.params.id + ".");
			}

			const member = await courseMemberDto.findByCourseIdAndUserId(
				{ course_id: receipt.course_id, user_id: req.userId },
				transaction
			);
			if (req.role === ROLE.TEACHER && !member) {
				throw new ForbiddenError("Bạn không có quyền cập nhật khoản thu này.");
			}

			await receiptDto.update(req.params.id, req.body, transaction);
			await transaction.commit();
			receipt = await Receipt.findByPk(req.params.id);
			res.status(200).json(receipt);
		} catch (error) {
			await transaction.rollback();
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

		const transaction = await connection.transaction();
		try {
			const numberOfDeletedReceipt = await receiptDto.delete(req.params.id, transaction);
			if (numberOfDeletedReceipt === 0) {
				throw new NotFoundError("Không tìm thấy khoản thu với id là " + req.params.id + ".");
			}
			await transaction.commit();
			res.status(200).json({ message: "Đã xóa khoản thu thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default receiptController;
