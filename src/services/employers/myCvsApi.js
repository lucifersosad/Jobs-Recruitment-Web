import { getCookie } from "../../helpers/cookie";
import { AuthPost } from "../../utils/employers/requestAuth";
const checkToken = getCookie("token-employer") || "";

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

  const result = await AuthPost(`/my-cvs/${idCv}/file`, {}, checkToken);
  return result;
};