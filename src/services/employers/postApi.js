// import { getCookie } from "../../helpers/cookie";
// import { AuthPost, AuthGet, AuthPatch, AuthDelete } from "../../utils/employers/request";

// const checkToken = getCookie("token-employer") || "";

// // Lấy danh sách bài viết của employer hiện tại
// export const getMyPosts = async () => {
//   const result = await AuthGet(`/post/my-posts`, checkToken);
//   return result;
// };

// // Tạo bài viết mới (formData có images và caption)
// export const createPost = async (formData) => {
//   const result = await AuthPost(`/post/create`, formData, checkToken, true); // `true` nếu AuthPost hỗ trợ multipart/form-data
//   return result;
// };

// // Cập nhật bài viết theo id
// export const updatePost = async (id, formData) => {
//   const result = await AuthPatch(`/post/update/${id}`, formData, checkToken, true); // `true` nếu multipart/form-data
//   return result;
// };

// // Xóa bài viết
// export const deletePost = async (id) => {
//   const result = await AuthDelete(`/post/delete/${id}`, checkToken);
//   return result;
// };

// // Trả lời bình luận của người dùng trên bài viết
// export const replyToComment = async (postId, commentId, content) => {
//   const result = await AuthPost(`/post/${postId}/comment/${commentId}/reply`, { content }, checkToken);
//   return result;
// };

// // Lấy danh sách người đã like bài viết
// export const getLikedList = async (postId) => {
//   const result = await AuthGet(`/post/liked-list/${postId}`, checkToken);
//   return result;
// };
