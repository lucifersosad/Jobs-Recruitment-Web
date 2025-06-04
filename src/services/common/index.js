import { Get } from "../../utils/clients/request";

export async function getListSchool(keyword = "") {
    const result = await Get(`/schools?keyword=${keyword}`);
    return result;
}

export async function getListSkill(keyword = "") {
    const result = await Get(`/skills?keyword=${encodeURIComponent(keyword)}`);
    return result;
}