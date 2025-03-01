import { getCookie } from "../../helpers/cookie";

import { AuthPost,AuthGet,AuthPatch } from "../../utils/employers/requestAuth";
const checkToken = getCookie("token-employer") || "";

export const getAllNotificationsEmployer = async (fromRecord = "", limit = "")=>{
    const result = await AuthGet(`/notifications?findAll=true&from_record=${fromRecord}&limit=${limit}`,checkToken);
    return result;
}

export const readAllNotifications = async () => {
    const result = await AuthPost(`/notifications/read-all`, {}, checkToken);
    return result;
}

export const readNotification = async (id) => {
    const result = await AuthPost(`/notifications/read/${id}`,{}, checkToken);
    return result;
}

export const countUnreadNotifications = async () => {
    const result = await AuthGet(`/notifications/count-unread`, checkToken);
    return result;
}