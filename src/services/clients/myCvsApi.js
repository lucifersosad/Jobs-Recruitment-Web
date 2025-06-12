import { getCookie } from "../../helpers/cookie";
import { DOMAIN } from "../../utils/api-domain";
import { Get, Post } from "../../utils/clients/request";
import { AuthGet, AuthPatch, AuthPost, AuthPostForm } from "../../utils/clients/requestAuth";

const API_DOMAIN = `${DOMAIN}/api/v1/client`;

const checkToken = getCookie("token-user") || "";

export const getMyCvs = async () => {
  const result = await AuthGet(`/my-cvs`, checkToken);
  return result;
};

export const getMyCv = async (idCv) => {
  const result = await AuthGet(`/my-cvs/${idCv}`, checkToken);
  return result;
};

export const getMyCvFile = async (idCv) => {
  // const link = API_DOMAIN

  // const path = `/my-cvs/${idCv}/file`

  // const response = await fetch(link + path, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // return response;

  const result = await AuthGet(`/my-cvs/${idCv}/file`, checkToken);
  return result;
};

export const editMyCv = async (value) => {
  const result = await AuthPatch(`/my-cvs/edit`, value, checkToken)
  return result;
}

export const uploadMyCv = async (valueForm)=>{
    const result = await AuthPostForm(`/my-cvs/upload`,valueForm,checkToken);
    return result;
}

export const createMyCv = async (data) => {
  const result = await AuthPost(`/my-cvs/`, data, checkToken);
  return result;
};

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

export const extractMyCv = async (valueForm) => {
  const result = await AuthPostForm(`/my-cvs/extract`,valueForm,checkToken);
  return result;
};

export const suggestBuildMyCv = async (value) => {
  const result = await AuthPost(`/my-cvs/suggest-builder`,value,checkToken);
  return result;
};
