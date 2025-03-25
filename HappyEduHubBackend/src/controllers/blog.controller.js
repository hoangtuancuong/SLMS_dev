import * as Yup from "yup";

import { connection } from "../services/sequelize.service.js";
import blogDto from "../dto/blog.dto.js";
import { ROLE, BLOG_TYPE } from "../utils/const.js";
import { ForbiddenError, NotFoundError, BadRequestError } from "../utils/ApiError.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

const blogController = {
	find: async (req, res, next) => {
		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				title: YUP_UTILS.string("title"),
				author_id: YUP_UTILS.number("author_id"),
				from_created_at: YUP_UTILS.date("from_created_at"),
				to_created_at: YUP_UTILS.date("to_created_at"),
				is_approved: YUP_UTILS.boolean("is_approved"),
				type: YUP_UTILS.string("type").oneOf(
					BLOG_TYPE.values,
					"`type` cần phải là một trong các giá trị sau: " + BLOG_TYPE.values + "."
				),
				author_name: YUP_UTILS.string("author_name")
			}),
			sort: YUP_UTILS.object({
				title: YUP_UTILS.sort("title"),
				created_at: YUP_UTILS.sort("created_at")
			})
		});
		try {
			req.query = await querySchema.validate(req.query);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			const blogs = await blogDto.find(req.query, transaction);
			const total = await blogDto.total(req.query, transaction);
			res.status(200).json({
				data: blogs,
				meta: {
					limit: req.query.limit,
					offset: req.query.offset,
					total: total
				}
			});
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
			const blog = await blogDto.findById(req.params.id, transaction);
			if (blog === null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy bài viết có id là " + req.params.id + "."));
			}
			await transaction.commit();
			res.status(200).json(blog);
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	create: async (req, res, next) => {
		const bodySchema = YUP_UTILS.body({
			title: YUP_UTILS.string("title").required("Cần phải có `title`."),
			content: YUP_UTILS.string("content").required("Cần phải có `content`."),
			thumbnail_url: YUP_UTILS.string("thumbnail_url"),
			type: YUP_UTILS.string("type")
				.oneOf(BLOG_TYPE.values, "`type` cần phải là một trong các giá trị sau: " + BLOG_TYPE.values + ".")
				.required("Cần phải có `type`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			res.status(201).json(
				await blogDto.create(
					{
						author_id: req.userId,
						is_approved: req.role === ROLE.ADMIN,
						...req.body
					},
					transaction
				)
			);
			await transaction.commit();
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

		let blog;
		const transaction = await connection.transaction();
		try {
			blog = await blogDto.findById(req.params.id, transaction);
			if (blog === null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy bài viết có id là " + req.params.id + "."));
			} else if (req.userId !== blog.author_id && req.role !== ROLE.ADMIN) {
				await transaction.rollback();
				return next(new ForbiddenError("Bạn không được phép cập nhật bài viết này."));
			}
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}

		const bodySchema = YUP_UTILS.body({
			title: YUP_UTILS.string("title"),
			content: YUP_UTILS.string("content"),
			thumbnail_url: YUP_UTILS.string("thumbnail_url"),
			type: YUP_UTILS.string("type").oneOf(
				BLOG_TYPE.values,
				"`type` cần phải là một trong các giá trị sau: " + BLOG_TYPE.values + "."
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
			blog = await blogDto.update(blog, req.body, transaction);
			await transaction.commit();
			res.status(200).json(blog);
		} catch (error) {
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
			const blog = await blogDto.findById(req.params.id, transaction);
			if (blog === null) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy bài viết có id là " + req.params.id + "."));
			} else if (req.userId !== blog.author_id && req.role !== ROLE.ADMIN) {
				await transaction.rollback();
				return next(new ForbiddenError("Bạn không được phép xóa bài viết này."));
			}
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}

		try {
			let result = await blogDto.delete(req.params.id, transaction);
			if (result === 0) {
				await transaction.rollback();
				return next(new NotFoundError("Không tìm thấy bài viết có id là " + req.params.id + "."));
			}
			await transaction.commit();
			res.status(200).json({ message: "Bài viết đã được xóa thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},
	adminOnly: {
		approve: async (req, res, next) => {
			const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
			try {
				req.params.id = await idSchema.validate(req.params.id);
			} catch (err) {
				return catchValidationError(next, err);
			}

			const transaction = await connection.transaction();
			try {
				const blog = await blogDto.findById(req.params.id, transaction);
				if (blog === null) {
					await transaction.rollback();
					return next(new NotFoundError("Không tìm thấy bài viết có id là " + req.params.id + "."));
				} else if (blog.is_approved) {
					await transaction.rollback();
					return next(new BadRequestError("Bài viết có id là " + req.params.id + " đã được duyệt trước đó."));
				}
			} catch (error) {
				await transaction.rollback();
				return next(error);
			}

			try {
				await blogDto.admin.approve(req.params.id, transaction);
				res.status(200).json({ message: "Bài viết đã được duyệt thành công." });
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				return next(error);
			}
		},

		batchApprove: async (req, res, next) => {
			const bodySchema = YUP_UTILS.body({
				ids: Yup.array(YUP_UTILS.number("id")).required("Cần có `ids`.")
			});
			try {
				req.body = await bodySchema.validate(req.body);
			} catch (err) {
				console.log(err);
				return catchValidationError(next, err);
			}

			const transaction = await connection.transaction();
			try {
				for (const id of req.body.ids) {
					const blog = await blogDto.findById(id, transaction);
					if (blog === null) {
						await transaction.rollback();
						return next(new NotFoundError("Không tìm thấy bài viết có id là " + id + "."));
					} else if (blog.is_approved) {
						await transaction.rollback();
						return next(new BadRequestError("Bài viết có id là " + id + " đã được duyệt trước đó."));
					}
					await blogDto.admin.approve(id, transaction);
				}
				await transaction.commit();
				res.status(200).json({ message: "Các bài viết đã được duyệt thành công." });
			} catch (error) {
				console.log(error);
				await transaction.rollback();
				return next(error);
			}
		}
	}
};

export default blogController;
