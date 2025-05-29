import { getCookie } from "../../helpers/cookie";
import { AuthGet, AuthPost } from "../../utils/clients/requestAuth";

const checkToken = getCookie("token-user") || "";

export const getEvaluation = async (id) => {
    const result = await AuthGet(`/ai-review/${id}`, checkToken);
    return result;
}

export const evaluate = async (value) => {
  const result = await AuthPost(`/ai-review`, value, checkToken);
  return result;
}