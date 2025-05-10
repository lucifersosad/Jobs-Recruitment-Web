import { getCookie } from "../../helpers/cookie";
import { AuthPost, AuthGet, AuthPatch, AuthDel } from "../../utils/employers/requestAuth";
import { DOMAIN } from "../../utils/api-domain";

const checkToken = getCookie("token-employer") || "";
const API_URL = `${DOMAIN}/api/v1/employer`;

// Lấy danh sách bài viết của employer đang đăng nhập
export const getMyPosts = async (token = "") => {
  console.log("Calling getMyPosts with token:", token ? "Custom token" : "Default token");
  try {
    // Sử dụng endpoint mới
    const endpoint = "/posts/my-posts";
    console.log("Using endpoint:", endpoint);
    console.log("API_URL:", API_URL);
    console.log("Current token available:", checkToken ? "Yes" : "No");
    
    const url = `${API_URL}${endpoint}`;
    console.log("getMyPosts URL:", url);
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token || checkToken}`
        }
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        console.error("getMyPosts fetch not OK:", response.status, response.statusText);
      } else {
        const result = await response.json();
        console.log("getMyPosts fetch response:", result);
        return result;
      }
    } catch (fetchError) {
      console.error("Fetch method error:", fetchError);
    }
    
    // Phương pháp dự phòng: Sử dụng AuthGet
    console.log("Trying AuthGet with endpoint:", endpoint);
    const result = await AuthGet(endpoint, token || checkToken);
    console.log("AuthGet result:", result);
    
    if (result && !result.error) {
      return result;
    }
    
    // Nếu tất cả đều thất bại, trả về lỗi generic
    return { 
      code: 500, 
      error: "Could not fetch posts"
    };
  } catch (error) {
    console.error("getMyPosts overall error:", error);
    return { code: 500, error: error.message || "Failed to fetch my posts" };
  }
};

// Lấy thông tin chi tiết bài viết
export const getPostById = async (id = "", token = "") => {
  if (!id) {
    console.error("getPostById: Missing id parameter");
    return { code: 400, error: "Missing id parameter" };
  }
  
  console.log("Calling getPostById with id:", id);
  try {
    const result = await AuthGet(`/posts/${id}`, token || checkToken);
    console.log("getPostById response status:", result?.code);
    return result;
  } catch (error) {
    console.error("getPostById error:", error);
    return { code: 500, error: error.message || "Failed to fetch post details" };
  }
};

// Tạo bài viết mới
export const createPost = async (formData) => {
  if (!formData) {
    console.error("createPost: Missing formData");
    return { code: 400, error: "Missing formData" };
  }
  
  console.log("Calling createPost");
  try {
    const url = `${API_URL}/posts/create`;
    console.log("createPost URL:", url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${checkToken}`
      },
      body: formData
    });
    
    const result = await response.json();
    console.log("createPost response status:", result?.code || "No code");
    return result;
  } catch (error) {
    console.error("createPost error:", error);
    return { code: 500, error: error.message || "Failed to create post" };
  }
};

// Cập nhật bài viết
export const updatePost = async (id, formData) => {
  if (!id) {
    console.error("updatePost: Missing id parameter");
    return { code: 400, error: "Missing id parameter" };
  }
  
  if (!formData) {
    console.error("updatePost: Missing formData");
    return { code: 400, error: "Missing formData" };
  }
  
  console.log("Calling updatePost with id:", id);
  try {
    const url = `${API_URL}/posts/update/${id}`;
    console.log("updatePost URL:", url);
    
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${checkToken}`
      },
      body: formData
    });
    
    const result = await response.json();
    console.log("updatePost response status:", result?.code || "No code");
    return result;
  } catch (error) {
    console.error("updatePost error:", error);
    return { code: 500, error: error.message || "Failed to update post" };
  }
};

// Xoá bài viết
export const deletePost = async (id = "", token = "") => {
  if (!id) {
    console.error("deletePost: Missing id parameter");
    return { code: 400, error: "Missing id parameter" };
  }
  
  console.log("Calling deletePost with id:", id);
  try {
    const result = await AuthDel(`/posts/delete/${id}`, token || checkToken);
    console.log("deletePost response status:", result?.code);
    return result;
  } catch (error) {
    console.error("deletePost error:", error);
    return { code: 500, error: error.message || "Failed to delete post" };
  }
};

// Like/Unlike bài viết
export const likePost = async (id = "", token = "") => {
  if (!id) {
    console.error("likePost: Missing id parameter");
    return { code: 400, error: "Missing id parameter" };
  }
  
  console.log("Calling likePost with id:", id);
  try {
    const result = await AuthPost(`/posts/${id}/like`, {}, token || checkToken);
    console.log("likePost response status:", result?.code);
    return result;
  } catch (error) {
    console.error("likePost error:", error);
    return { code: 500, error: error.message || "Failed to like/unlike post" };
  }
};

// Thêm bình luận vào bài viết
export const commentPost = async (id = "", content = "", token = "") => {
  if (!id) {
    console.error("commentPost: Missing id parameter");
    return { code: 400, error: "Missing id parameter" };
  }
  
  if (!content || content.trim() === "") {
    console.error("commentPost: Empty comment content");
    return { code: 400, error: "Comment content cannot be empty" };
  }
  
  console.log("Calling commentPost with id:", id);
  try {
    const result = await AuthPost(`/posts/${id}/comments`, { content }, token || checkToken);
    console.log("commentPost response status:", result?.code);
    return result;
  } catch (error) {
    console.error("commentPost error:", error);
    return { code: 500, error: error.message || "Failed to comment on post" };
  }
};

// Trả lời bình luận
export const replyToComment = async (postId = "", commentId = "", content = "", token = "") => {
  if (!postId) {
    console.error("replyToComment: Missing postId parameter");
    return { code: 400, error: "Missing postId parameter" };
  }
  
  if (!commentId) {
    console.error("replyToComment: Missing commentId parameter");
    return { code: 400, error: "Missing commentId parameter" };
  }
  
  if (!content || content.trim() === "") {
    console.error("replyToComment: Empty reply content");
    return { code: 400, error: "Reply content cannot be empty" };
  }
  
  console.log("Calling replyToComment with postId:", postId, "and commentId:", commentId);
  try {
    const result = await AuthPost(`/posts/${postId}/comments/${commentId}/reply`, { content }, token || checkToken);
    console.log("replyToComment response status:", result?.code);
    return result;
  } catch (error) {
    console.error("replyToComment error:", error);
    return { code: 500, error: error.message || "Failed to reply to comment" };
  }
};

// Lấy danh sách bình luận của bài viết
export const getPostComments = async (id = "", token = "") => {
  if (!id) {
    console.error("getPostComments: Missing id parameter");
    return { code: 400, error: "Missing id parameter" };
  }
  
  console.log(`%c getPostComments: Bắt đầu lấy bình luận cho bài viết ${id}`, 'background: #122543; color: #59e6c7; padding: 2px 5px; border-radius: 3px;');
  console.log("Token được sử dụng:", token ? token.substring(0, 15) + "..." : checkToken.substring(0, 15) + "...");
  
  try {
    // Sử dụng URL chính xác đã xác nhận hoạt động
    const url = `${API_URL}/posts/${id}/comments`;
 
    
    try {
      console.log("Bắt đầu gọi fetch");
      
      // Lấy token mới nhất
      const currentToken = token || getCookie("token-employer") || checkToken;
      console.log("Sử dụng token mới nhất:", currentToken ? "Có" : "Không");
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${currentToken}`
        }
      });
      
      console.log("Kết quả HTTP:", response.status, response.statusText);
      
      if (!response.ok) {
        console.error(`getPostComments HTTP error: ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dữ liệu thô từ API:", data);
      
      // Xử lý kết quả
      if (data) {
        // Trường hợp 1: API trả về chuẩn { code: 200, data: [...] }
        if (data.code === 200 && Array.isArray(data.data)) {
          console.log("API trả về cấu trúc { code: 200, data: [...] } với", data.data.length, "bình luận");
          return data;
        }
        
        // Trường hợp 2: API trả về trực tiếp mảng comments
        else if (Array.isArray(data)) {
          console.log("API trả về mảng trực tiếp với", data.length, "bình luận");
          return { 
            code: 200, 
            data: data 
          };
        }
        
        // Trường hợp 3: API trả về object có thuộc tính comments là mảng
        else if (data.comments && Array.isArray(data.comments)) {
          console.log("API trả về cấu trúc { comments: [...] } với", data.comments.length, "bình luận");
          return { 
            code: 200, 
            data: data.comments 
          };
        }
        
        // Trường hợp 4: API trả về object nhưng dữ liệu không phải là mảng
        else {
          console.log("API trả về định dạng khác, đang xử lý");
          // Duyệt qua tất cả các thuộc tính để tìm mảng
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`Tìm thấy mảng trong thuộc tính '${key}' với ${data[key].length} phần tử`);
              return {
                code: 200,
                data: data[key]
              };
            }
          }
          
          // Nếu không tìm thấy mảng, trả về object gốc
          console.log("Không tìm thấy mảng nào, trả về toàn bộ object");
          return { 
            code: 200, 
            data: data 
          };
        }
      }
    } catch (fetchError) {
      console.error("Lỗi khi fetch dữ liệu:", fetchError);
      console.log("Stack trace:", fetchError.stack);
    }
    
    // Phương pháp dự phòng: Sử dụng AuthGet
    console.log("Đang thử phương pháp dự phòng với AuthGet");
    const result = await AuthGet(`/posts/${id}/comments`, token || checkToken);
    console.log("Kết quả từ AuthGet:", result);
    
    if (result) {
      if (Array.isArray(result)) {
        console.log("AuthGet trả về mảng trực tiếp với", result.length, "bình luận");
        return { code: 200, data: result };
      } else if (result.code === 200 && Array.isArray(result.data)) {
        console.log("AuthGet trả về { code: 200, data } với", result.data.length, "bình luận");
        return result;
      } else if (result.comments && Array.isArray(result.comments)) {
        console.log("AuthGet trả về { comments: [...] } với", result.comments.length, "bình luận");
        return { code: 200, data: result.comments };
      } else {
        console.log("AuthGet trả về định dạng khác, trả về toàn bộ kết quả");
        return { code: 200, data: result };
      }
    }
    
    // Thử phương pháp cuối cùng: Không có baseURL
    console.log("Đang thử gọi API không qua base URL");
    const directUrl = `${DOMAIN}/api/v1/employer/posts/${id}/comments`;
    console.log("URL trực tiếp:", directUrl);
    
    try {
      const directResponse = await fetch(directUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token || checkToken}`
        }
      });
      
      console.log("Kết quả HTTP từ URL trực tiếp:", directResponse.status, directResponse.statusText);
      
      if (!directResponse.ok) {
        console.error(`Direct URL HTTP error: ${directResponse.status}`);
      } else {
        const directData = await directResponse.json();
        console.log("Dữ liệu từ URL trực tiếp:", directData);
        
        if (Array.isArray(directData)) {
          return { code: 200, data: directData };
        } else if (directData.code === 200 && Array.isArray(directData.data)) {
          return directData;
        } else if (directData.comments && Array.isArray(directData.comments)) {
          return { code: 200, data: directData.comments };
        } else {
          return { code: 200, data: directData };
        }
      }
    } catch (directError) {
      console.error("Lỗi với URL trực tiếp:", directError);
    }
    
    // Nếu không có dữ liệu hợp lệ, trả về mảng rỗng
    console.warn("Không thể lấy dữ liệu bình luận sau khi thử tất cả phương pháp, trả về mảng rỗng");
    return { code: 200, data: [] };
  } catch (error) {
    console.error("getPostComments overall error:", error);
    console.log("Stack trace:", error.stack);
    return { code: 500, error: error.message || "Failed to fetch comments" };
  }
};

// Lấy danh sách người dùng đã thích bài viết
export const getLikedList = async (id = "", token = "") => {
  if (!id) {
    console.error("getLikedList: Missing id parameter");
    return { code: 400, error: "Missing id parameter" };
  }
  
  console.log("Calling getLikedList with id:", id);
  try {
    const result = await AuthGet(`/posts/liked-list/${id}`, token || checkToken);
    console.log("getLikedList response status:", result?.code);
    return result;
  } catch (error) {
    console.error("getLikedList error:", error);
    return { code: 500, error: error.message || "Failed to fetch liked users" };
  }
};

// Lấy tất cả bình luận cho tất cả bài viết
export const getAllPostsComments = async (token = "") => {
  console.log("Gọi API lấy tất cả bình luận cho tất cả bài viết");
  try {
    // Sử dụng URL xác nhận từ người dùng
    const url = `${API_URL}/posts/all-comments`;
    console.log("URL lấy tất cả bình luận:", url);
    
    // Lấy token mới nhất
    const currentToken = token || getCookie("token-employer") || checkToken;
    console.log("Sử dụng token:", currentToken ? "Có" : "Không");
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${currentToken}`
      }
    });
    
    console.log("Kết quả HTTP:", response.status, response.statusText);
    
    if (!response.ok) {
      console.error(`getAllPostsComments HTTP error: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Dữ liệu thô từ API getAllPostsComments:", data);
    
    // Trả về dữ liệu gốc từ API
    return data;
  } catch (error) {
    console.error("getAllPostsComments error:", error);
    return { code: 500, error: error.message || "Failed to fetch all comments" };
  }
};

// Kiểm tra trạng thái like của bài viết
export const checkLikeStatus = async (postId = "", token = "") => {
  console.log("Calling checkLikeStatus API");
  try {
    // Gọi API để kiểm tra trạng thái like - API trả về object với key là postId và giá trị là boolean
    const result = await AuthGet(`/posts/my-posts-like-status`, token || checkToken);
    console.log("checkLikeStatus raw response:", result);
    
    // Kiểm tra xem kết quả có định dạng đúng như mong đợi không
    if (result && typeof result === 'object') {
      // Nếu API trả về object có code 200, sử dụng result.data
      if (result.code === 200 && result.data) {
        console.log("Using data from response with code 200");
        return {
          code: 200,
          allStatus: result.data,
          isLiked: postId ? result.data[postId] === true : false
        };
      } 
      // Nếu API trả về trực tiếp object chứa các cặp id:boolean
      else if (!Array.isArray(result) && Object.keys(result).length > 0) {
        console.log("API returned direct mapping object, wrapping with code 200");
        // Convert tất cả giá trị trong kết quả sang đúng boolean
        const processedResult = {};
        
        // Xử lý tất cả các key trong result
        Object.keys(result).forEach(key => {
          // Chuyển đổi giá trị thành boolean chính xác
          processedResult[key] = result[key] === true || result[key] === 'true' || result[key] === 1;
        });
        
        console.log("Processed like status:", processedResult);
        
        return { 
          code: 200, 
          allStatus: processedResult,
          isLiked: postId ? processedResult[postId] === true : false
        };
      }
    }
    
    return { code: 200, isLiked: false, allStatus: {} };
  } catch (error) {
    console.error("checkLikeStatus error:", error);
    return { code: 500, error: error.message || "Failed to check like status", allStatus: {} };
  }
};
