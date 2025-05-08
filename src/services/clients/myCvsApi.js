import { getCookie } from "../../helpers/cookie";
import { Get } from "../../utils/clients/request";
import { AuthPost } from "../../utils/clients/requestAuth";

const checkToken = getCookie("token-user") || "";

export const getMyCv = async (idCv)=>{
    const result = await Get(`/my-cvs/${idCv}`);
    return result;
}

export const createMyCv = async (data)=>{
    const result = await AuthPost(`/my-cvs/`, data, checkToken);
    return result;
}