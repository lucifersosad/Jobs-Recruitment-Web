import { getCookie } from "../../helpers/cookie";

import { AuthPost,AuthGet,AuthPatch } from "../../utils/employers/requestAuth";
const checkToken = getCookie("token-employer") || "";

export const getAllNotificationsEmployer = async (valueStatus = "",keyword="")=>{
    const result = await AuthGet(`/notifications?findAll=true&status=${valueStatus}&keyword=${keyword}`,checkToken);
    return result;
}