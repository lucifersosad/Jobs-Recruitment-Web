import { getCookie } from "../../helpers/cookie";
import { DOMAIN } from "../../utils/api-domain";
import { Get, Post } from "../../utils/clients/request";
import { AuthGet, AuthPost } from "../../utils/clients/requestAuth";

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

  const result = await AuthPost(`/my-cvs/${idCv}/file`, checkToken);
  return result;
};

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

export const extractMyCv = async (formData) => {
  const response = await fetch(`${API_DOMAIN}/my-cvs/extract`, {
    method: "POST",
    body: formData
  });

  const result = await response.json();
  return result;
};
