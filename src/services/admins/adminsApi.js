import { getCookie } from "../../helpers/cookie";
import { Post } from "../../utils/admins/request";
import {
  AuthDel,
  AuthGet,
  AuthPatch,
  AuthPost,
} from "../../utils/admins/requestAuth";
const API_PATCH = "/admins";

const token = getCookie("token-admin") || "";

export const loginAdmin = async (data) => {
  const result = await Post(API_PATCH + `/login`, data);
  return result;
};

export const checkAuthenAccountAdmin = async (data, token) => {
  const result = await AuthPost(API_PATCH + "/authen", data, token);
  return result;
};

export const getInfo = async (data = {}, token) => {
  const result = await AuthPost(API_PATCH + "/info", data, token);
  return result;
};

export const getAllAdmins = async (
  valueStatus = "",
  keyword = "",
  sortKey = "",
  sortValue = "",
  tree = "false"
) => {
  const result = await AuthGet(
    `${API_PATCH}?findAll=true&status=${valueStatus}&keyword=${keyword}&sortKey=${sortKey}&sortValue=${sortValue}&tree=${tree}`,
    token
  );
  return result;
};

export const addAdmins = async (data) => {
  const result = await AuthPost(`/admins/create`, data, token);
  return result;
};

export const editAdmins = async (id, data) => {
  const result = await AuthPatch(`/admins/edit/${id}`, data, token);
  return result;
};

export const deleteSingleAdmins = async (id) => {
  const result = await AuthDel(`/admins/delete/${id}`, token);
  return result;
};

export const changeStatusSingleAdmins = async (id, status) => {
  const result = await AuthPatch(`/admins/change-status/${id}`, status, token);
  return result;
};

export const changeMultipleAdmins = async (data) => {
  const result = await AuthPatch(`/admins/change-multi`, data, token);
  return result;
};
