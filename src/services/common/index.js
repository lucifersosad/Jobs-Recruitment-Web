import { Get } from "../../utils/clients/request";

export async function getListSchool(keyword = "") {
    const result = await Get(`/schools?keyword=${keyword}`);
    return result;
}