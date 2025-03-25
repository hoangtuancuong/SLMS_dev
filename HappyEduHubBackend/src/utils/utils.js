import { ValidationError } from "./ApiError.js";
import { SORT, TAG_TYPE } from "./const.js";
import * as Yup from "yup";

export const catchValidationError = (next, err) => {
	if (err instanceof Yup.ValidationError) return next(new ValidationError(err.errors.join("\n")));
	return next(new ValidationError("Hãy kiểm tra lại dữ liệu đầu vào."));
};

export const YUP_UTILS = {
	limit() {
		return Yup.number()
			.default(10)
			.integer("`limit` phải là số nguyên.")
			.max(100, "`limit` phải nhỏ hơn 100.")
			.min(1, "`limit` phải lớn hơn 0.")
			.typeError("`limit` phải là số nguyên.");
	},

	offset() {
		return Yup.number()
			.default(0)
			.integer("`limit` phải là số nguyên.")
			.min(0, "`offset` phải lớn hơn 0.")
			.typeError("`offset` phải là số nguyên.");
	},

	object(shape) {
		return Yup.object().shape(shape).unknown(false);
	},

	params(shape) {
		return Yup.object().shape(shape).unknown(false).required("Cần có params của request.");
	},

	body(shape) {
		return Yup.object().shape(shape).unknown(false).required("Cần có body của request.");
	},

	query(shape) {
		return Yup.object().shape(shape).unknown(false).required("Cần có query của request.");
	},

	string(fieldName) {
		return Yup.string().typeError(`\`${fieldName}\` phải là string.`);
	},

	number(fieldName) {
		return Yup.number().typeError(`\`${fieldName}\` phải là số.`);
	},

	date(fieldName) {
		return Yup.date().typeError(`\`${fieldName}\` phải là ngày.`);
	},

	boolean(fieldName) {
		return Yup.boolean().typeError(`\`${fieldName}\` phải là boolean.`);
	},

	sort(fieldName) {
		return Yup.string()
			.oneOf(SORT.values, `\`sort.${fieldName}\` phải là một trong các giá trị sau: ${SORT.values}`)
			.typeError(`\`sort.${fieldName}\` phải là string.`);
	},

	rate(fieldName) {
		return Yup.number()
			.integer(`\`${fieldName}\` phải là số nguyên.`)
			.min(1, `\`${fieldName}\` phải lớn hơn 0.`)
			.max(5, `\`${fieldName}\` phải nhỏ hơn 5.`)
			.typeError(`\`${fieldName}\` phải là số nguyên.`);
	},

	tag(fieldName) {
		return Yup.string()
			.oneOf(TAG_TYPE.values, `\`${fieldName}\` phải là một trong các giá trị sau: ${TAG_TYPE.values}`)
			.typeError(`\`${fieldName}\` phải là string.`);
	}
};
