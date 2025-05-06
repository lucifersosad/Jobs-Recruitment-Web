import { getEmployerPosts, likePost, commentOnPost, checkLikedStatus, getPostComments, checkEmployerPostsLikeStatus } from "../../../../services/clients/postApi";
import { getCookie } from "../../../../helpers/cookie";

export const fetchPostsData = async (employerId, onSuccess, onError) => {
  const token = getCookie("token-user") || "";

  if (!token) {
    if (onError) onError("Vui lòng đăng nhập để xem bài viết.");
    return;
  }

  try {
    console.log("Fetching posts for employer:", employerId);
    
    const result = await getEmployerPosts(employerId, token);
    console.log("InfoCompany - Posts Response:", result);

    if (result && Array.isArray(result)) {
      const postsWithDefaults = result.map(post => ({
        ...post,
        isLiked: false,
        likes: post.likes || 0,
        comments: []
      }));
      
      if (onSuccess) onSuccess(postsWithDefaults);
      
      if (result.length > 0) {
        console.log(`Fetching details for ${result.length} posts...`);
        
        const postIds = postsWithDefaults.map(post => post.id).filter(Boolean);
        
        if (postIds.length > 0) {
          try {
            const likeStatusResult = await checkEmployerPostsLikeStatus(employerId, token);
            
            if (likeStatusResult?.code === 200 && likeStatusResult.data) {
              console.log("Like status for employer posts:", likeStatusResult.data);
              return likeStatusResult.data;
            }
          } catch (likeError) {
            console.error("Error checking like status:", likeError);
          }
        }
      }
    } else if (result?.error) {
      console.log("InfoCompany - Posts Error:", result.error);
      if (onError) onError(result.error || "Không tìm thấy bài viết.");
    } else {
      if (onError) onError("Dữ liệu bài viết không hợp lệ.");
    }
  } catch (err) {
    console.error("InfoCompany - Posts Error:", err);
    if (onError) onError("Lỗi khi tải bài viết: " + (err.message || "Không rõ nguyên nhân."));
  }
  return null;
};

export const fetchPostComments = async (postId) => {
  if (!postId) return null;
  
  try {
    const commentsResult = await getPostComments(postId);
    
    if (commentsResult?.code === 200 && commentsResult.data && Array.isArray(commentsResult.data)) {
      console.log(`Comments for post ${postId}:`, commentsResult.data);
      return commentsResult.data;
    }
  } catch (commentsError) {
    console.error(`Error fetching comments for post ${postId}:`, commentsError);
  }
  
  return null;
};

export const checkPostLikedStatus = async (postIds) => {
  if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
    return null;
  }
  
  try {
    const likeStatusResult = await checkLikedStatus(postIds);
    if (likeStatusResult?.code === 200 && likeStatusResult.data) {
      return likeStatusResult.data;
    }
  } catch (error) {
    console.error("Error checking post like status:", error);
  }
  
  return null;
}; 