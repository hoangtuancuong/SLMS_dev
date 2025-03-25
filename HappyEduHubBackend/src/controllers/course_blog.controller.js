import * as Yup from "yup";
import { DataExistError, NotFoundError } from "../utils/ApiError.js";
import courseBlogDto from "../dto/course_blog.dto.js";
import { connection } from "../services/sequelize.service.js";
import { catchValidationError, YUP_UTILS } from "../utils/utils.js";

const courseBlogController = {
	findBlogsByCourseId: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const querySchema = YUP_UTILS.query({
			limit: YUP_UTILS.limit(),
			offset: YUP_UTILS.offset(),
			filter: YUP_UTILS.object({
				title: YUP_UTILS.string("title"),
				author_id: YUP_UTILS.number("author_id"),
				type: YUP_UTILS.string("type")
			}),
			sort: YUP_UTILS.object({
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
			const blogs = await courseBlogDto.findBlogsByCourseId(req.params.id, req.query, transaction);
			const total = await courseBlogDto.totalBlogsByCourseId(req.params.id, req.query, transaction);
			await transaction.commit();
			res.status(200).json({
				data: blogs,
				meta: {
					limit: req.query.limit,
					offset: req.query.offset,
					total
				}
			});
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	addBlogToCourse: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const bodySchema = YUP_UTILS.body({
			ids: Yup.array()
				.of(YUP_UTILS.number("ids"))
				.min(1, "`ids` phải có độ dài lớn hơn 0.")
				.required("Cần phải có `ids`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			for (const id of req.body.ids) {
				const blog = await courseBlogDto.findByCourseIdAndBlogId(req.params.id, id, transaction);
				if (blog) {
					await transaction.rollback();
					return next(new DataExistError("Blog có id là " + id + " đã tồn tại trong khóa học."));
				}
				await courseBlogDto.addBlogToCourse(req.params.id, id, transaction);
			}
			await transaction.commit();
			res.status(200).json({ message: "Thêm các blog vào khóa học thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	},

	removeBlogFromCourse: async (req, res, next) => {
		const idSchema = YUP_UTILS.number("id").required("Cần phải có `id`.");
		try {
			req.params.id = await idSchema.validate(req.params.id);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const bodySchema = YUP_UTILS.body({
			ids: Yup.array()
				.of(YUP_UTILS.number("ids"))
				.min(1, "`ids` phải có độ dài lớn hơn 0.")
				.required("Cần phải có `ids`.")
		});
		try {
			req.body = await bodySchema.validate(req.body);
		} catch (err) {
			return catchValidationError(next, err);
		}

		const transaction = await connection.transaction();
		try {
			for (const id of req.body.ids) {
				const blog = await courseBlogDto.findByCourseIdAndBlogId(req.params.id, id, transaction);
				if (!blog) {
					await transaction.rollback();
					return next(new NotFoundError("Blog có id là " + id + " không tồn tại trong khóa học."));
				}
				await courseBlogDto.removeBlogFromCourse(req.params.id, id, transaction);
			}
			await transaction.commit();
			res.status(200).json({ message: "Xóa các blog khỏi khóa học thành công." });
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	}
};

export default courseBlogController;
