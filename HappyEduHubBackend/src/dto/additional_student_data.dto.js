import AdditionalStudentData from "../models/AdditionalStudentData.js";
import { DataExistError, NotFoundError, ForbiddenError } from "../utils/ApiError.js";
import { ROLE } from "../utils/const.js";

const additionalStudentDataDto = {
	create: async (data, userId, role, transaction) => {
		if (role === ROLE.STUDENT && userId !== data.user_id)
			throw new ForbiddenError("Bạn không đủ quyền để thực hiện thao tác này.");

		const additionalStudentData = await AdditionalStudentData.findByPk(data.user_id, { transaction });
		if (additionalStudentData) throw new DataExistError("Thông tin học sinh đã tồn tại.");

		return AdditionalStudentData.create(data, { transaction });
	},

	update: async (data, userId, role, transaction) => {
		if (role === ROLE.STUDENT && userId !== data.user_id)
			throw new ForbiddenError("Bạn không đủ quyền để thực hiện thao tác này.");

		const additionalStudentData = await AdditionalStudentData.findByPk(data.user_id, { transaction });
		if (!additionalStudentData) throw new NotFoundError("Thông tin học sinh không tồn tại.");

		return additionalStudentData.update(data, { transaction });
	}
};

export default additionalStudentDataDto;
