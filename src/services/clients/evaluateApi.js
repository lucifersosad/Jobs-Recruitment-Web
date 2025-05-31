import { getCookie } from "../../helpers/cookie";
import { AuthGet, AuthPost, AuthPostForm } from "../../utils/clients/requestAuth";

const checkToken = getCookie("token-user") || "";

export const getEvaluation = async (id) => {
    const result = await AuthGet(`/ai-review/${id}`, checkToken);
    return result;
}

export const evaluate = async (formData) => {
  const result = await AuthPostForm(`/ai-review`, formData, checkToken);
  return result;
}

export const checkEvaluate = async (value) => {
  const result = await AuthPost(`/ai-review/check`, value, checkToken);
  return result;
}