import { AuthGet, AuthPost } from "../../utils/clients/requestAuth";
import { getCookie } from "../../helpers/cookie";

const checkToken = getCookie("token-user") || "";

// Lấy tất cả bài viết của một employer (employerId là tham số lọc, không phải ID từ token)
export const getEmployerPosts = async (employerId = "", token = "", page = 1) => {
    if (!employerId) {
        console.error("getEmployerPosts: Missing employerId parameter");
        return { code: 400, error: "Missing employerId parameter" };
    }
    
    console.log("Calling getEmployerPosts with employerId:", employerId);
    try {
        const result = await AuthGet(`/post/get-all/${employerId}?page=${page}`, token || checkToken); // Sử dụng token từ parameter hoặc từ cookie
        console.log("getEmployerPosts response status:", result?.code);
        return result;
    } catch (err) {
        console.error("getEmployerPosts error:", err);
        return { code: 500, error: err.message || "Failed to fetch posts" };
    }
};

// Lấy chi tiết một bài viết bao gồm danh sách người đã thích và bình luận
export const getPostDetail = async (postId = "", token = "") => {
  if (!postId) {
    console.error("getPostDetail: Missing postId parameter");
    return { code: 400, error: "Missing postId parameter" };
  }
  
  console.log("Calling getPostDetail with postId:", postId);
  try {
    const result = await AuthGet(`/post/detail/${postId}`, token || checkToken);
    console.log("getPostDetail response status:", result?.code);
    return result;
  } catch (err) {
    console.error("getPostDetail error:", err);
    return { code: 500, error: err.message || "Failed to fetch post details" };
  }
};

// Lấy tất cả bình luận của bài viết
export const getPostComments = async (postId = "", token = "") => {
  if (!postId) {
    console.error("getPostComments: Missing postId parameter");
    return { code: 400, error: "Missing postId parameter" };
  }
  
  console.log("Calling getPostComments with postId:", postId);
  try {
    const result = await AuthGet(`/post/comments/${postId}`, token || checkToken);
    console.log("getPostComments raw response:", result);
    
    // Xử lý các định dạng khác nhau của kết quả API
    if (result) {
      // Trường hợp 1: API trả về chuẩn { code: 200, data: [...] }
      if (result.code === 200 && Array.isArray(result.data)) {
        console.log("API returned standard format with code 200");
        return result;
      }
      
      // Trường hợp 2: API trả về trực tiếp mảng comments
      else if (Array.isArray(result)) {
        console.log("API returned direct array of comments, wrapping with code 200");
        return { 
          code: 200, 
          data: result 
        };
      }
      
      // Trường hợp 3: API trả về object có thuộc tính comments là mảng
      else if (result.comments && Array.isArray(result.comments)) {
        console.log("API returned object with comments array, extracting");
        return { 
          code: 200, 
          data: result.comments 
        };
      }
    }
    
    // Nếu không có format nào phù hợp, trả về lỗi
    console.warn("Unexpected response format for post comments:", result);
    return { code: 500, error: "Unexpected response format", rawResponse: result };
  } catch (err) {
    console.error("getPostComments error:", err);
    return { code: 500, error: err.message || "Failed to fetch comments" };
  }
};

// Like hoặc bỏ like bài viết
export const likePost = async (postId = "") => {
  if (!postId) {
    console.error("likePost: Missing postId parameter");
    return { code: 400, error: "Missing postId parameter" };
  }
  
  console.log("Calling likePost with postId:", postId);
  console.log("Using token:", checkToken ? "Valid token" : "No token");
  
  try {
    const result = await AuthPost(`/post/like/${postId}`, {}, checkToken);
    console.log("likePost response:", result);
    return result;
  } catch (error) {
    console.error("likePost error:", error);
    return { code: 500, error: error.message || "Failed to like post" };
  }
};

// Comment bài viết
export const commentOnPost = async (postId = "", content = "") => {
  if (!postId) {
    console.error("commentOnPost: Missing postId parameter");
    return { code: 400, error: "Missing postId parameter" };
  }

  if (!content || content.trim() === "") {
    console.error("commentOnPost: Empty comment content");
    return { code: 400, error: "Comment content cannot be empty" };
  }
  
  console.log("Calling commentOnPost with postId:", postId);
  try {
    const result = await AuthPost(`/post/comment/${postId}`, { content }, checkToken);
    console.log("commentOnPost response status:", result?.code);
    return result;
  } catch (error) {
    console.error("commentOnPost error:", error);
    return { code: 500, error: error.message || "Failed to comment on post" };
  }
};

// Kiểm tra trạng thái đã thích bài viết
export const checkLikedStatus = async (postIds = []) => {
  if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
    console.error("checkLikedStatus: Invalid or empty postIds array");
    return { code: 400, error: "Invalid or empty postIds array" };
  }
  
  console.log("Calling checkLikedStatus with postIds:", postIds);
  try {
    const result = await AuthPost(`/post/check-like-status`, { postIds }, checkToken);
    console.log("checkLikedStatus response status:", result?.code);
    return result;
  } catch (error) {
    console.error("checkLikedStatus error:", error);
    return { code: 500, error: error.message || "Failed to check like status" };
  }
};

// Kiểm tra trạng thái like của tất cả bài viết của một công ty
export const checkEmployerPostsLikeStatus = async (employerId = "", token = "") => {
  if (!employerId) {
    console.error("checkEmployerPostsLikeStatus: Missing employerId parameter");
    return { code: 400, error: "Missing employerId parameter" };
  }
  
  console.log("Calling checkEmployerPostsLikeStatus with employerId:", employerId);
  try {
    const result = await AuthGet(`/post/employer-like-status/${employerId}`, token || checkToken);
    console.log("checkEmployerPostsLikeStatus raw response:", result);
    
    // Kiểm tra xem kết quả có định dạng đúng như mong đợi không
    if (result && typeof result === 'object') {
      // Nếu API trả về object có code 200, sử dụng result.data
      if (result.code === 200 && result.data) {
        console.log("Using data from response with code 200");
        return result;
      } 
      // Nếu API trả về trực tiếp object chứa các cặp id:boolean
      else if (Object.values(result).every(val => typeof val === 'boolean')) {
        console.log("API returned direct mapping object, wrapping with code 200");
        return { 
          code: 200, 
          data: result 
        };
      }
    }
    
    // Nếu không đáp ứng các điều kiện trên, trả về lỗi
    console.warn("Unexpected response format for like status:", result);
    return { code: 500, error: "Unexpected response format", rawResponse: result };
  } catch (error) {
    console.error("checkEmployerPostsLikeStatus error:", error);
    return { code: 500, error: error.message || "Failed to check employer posts like status" };
  }
};


