import { getCookie } from "../../helpers/cookie";
import { DOMAIN } from "../../utils/api-domain";
import { Get, Post } from "../../utils/clients/request";
import { AuthPost } from "../../utils/clients/requestAuth";

const API_DOMAIN = `${DOMAIN}/api/v1/client`;

const checkToken = getCookie("token-user") || "";

export const getMyCv = async (idCv)=>{
    const result = await Get(`/my-cvs/${idCv}`);
    return result;
}

export const createMyCv = async (data)=>{
    const result = await AuthPost(`/my-cvs/`, data, checkToken);
    return result;
}

export const downloadMyCv = async (idCv) => {
    // const response = await fetch(`${API_DOMAIN}/my-cvs/${idCv}/download`, {
    //   method: "GET",
    // });

    // console.log(response.headers.get("Content-Type"));

    // const blob = await response.blob();
    // return blob;
    const result = await Get(`/my-cvs/${idCv}/download`);
    return result;
  };