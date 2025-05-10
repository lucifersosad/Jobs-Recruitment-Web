import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  getMyPosts, 
  deletePost, 
  likePost, 
  getPostComments, 
  replyToComment, 
  getLikedList,
  updatePost,
  getAllPostsComments,
  checkLikeStatus
} from "../../../services/employers/postApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faPaperPlane, faTrash, faEdit, faReply, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ConfigProvider, Input, Modal, Form, message, Button, Upload, Spin, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getCookie } from "../../../helpers/cookie";
import { DOMAIN } from "../../../utils/api-domain";
import "./managementPost.scss";

// Thêm ảnh mặc định dạng base64 để tránh lỗi network
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiNEMUQxRDEiLz48cGF0aCBkPSJNMTYgMTdjMy4zMTM3IDAgNi0yLjY4NjMgNi02cy0yLjY4NjMtNi02LTYtNiAyLjY4NjMtNiA2IDIuNjg2MyA2IDYgNloiIGZpbGw9IiM5Nzk3OTciLz48cGF0aCBkPSJNMjQgMjYuNGMwLTQuNDE4My04LTQuNDE4My04LTQuNDE4M3MtOCAwLTggNC40MTgzQzggMjYuNDM3NyA4IDI3IDggMjdoMTZzMC0uNDM3NyAwLS42WiIgZmlsbD0iIzk3OTc5NyIvPjwvc3ZnPg==";

// Hàm helper để kiểm tra cấu trúc dữ liệu hợp lệ
const isValidCommentData = (data) => {
  // Kiểm tra xem data có phải là mảng không
  if (!Array.isArray(data)) {
    console.log("Data không phải là mảng:", data);
    return false;
  }
  
  // Kiểm tra mảng rỗng
  if (data.length === 0) {
    console.log("Mảng data rỗng");
    return true; // Mảng rỗng vẫn được coi là hợp lệ
  }
  
  // Kiểm tra xem các phần tử có những thuộc tính cần thiết không
  for (let i = 0; i < Math.min(data.length, 3); i++) { // Chỉ kiểm tra tối đa 3 phần tử đầu tiên
    const item = data[i];
    
    // Kiểm tra nội dung bình luận
    if (!item.content && typeof item.content !== 'string') {
      console.log(`Phần tử ${i} không có trường content hợp lệ:`, item);
      return false;
    }
    
    // Kiểm tra thông tin người dùng
    if (!item.userId) {
      console.log(`Phần tử ${i} không có trường userId:`, item);
      return false;
    }
    
    // Kiểm tra userId có cấu trúc phù hợp không
    if (typeof item.userId === 'object' && (!item.userId._id && !item.userId.fullName)) {
      console.log(`Phần tử ${i} có userId không hợp lệ:`, item.userId);
      return false;
    }
  }
  
  return true;
};

// Hàm để bình thường hóa dữ liệu bình luận từ nhiều cấu trúc khác nhau
const normalizeCommentData = (dataFromApi) => {
  if (!dataFromApi) {
    console.warn("normalizeCommentData nhận dữ liệu rỗng");
    return [];
  }
  
  try {
    console.log("normalizeCommentData nhận dữ liệu:", dataFromApi);
    
    // Nếu đã là mảng các comment
    if (Array.isArray(dataFromApi) && dataFromApi.length > 0) {
      console.log("Đang xử lý mảng bình luận với", dataFromApi.length, "phần tử");
      
      // Tạo một bản đồ các replies để xử lý
      const replyMap = {};
      const mainComments = [];
      
      // Bước 1: Phân loại comments và replies
      dataFromApi.forEach(comment => {
        try {
          // Xác định xem đây là bình luận chính hay trả lời
          if (comment.parentCommentId || comment.parentId) {
            const parentId = comment.parentCommentId || comment.parentId;
            if (!replyMap[parentId]) {
              replyMap[parentId] = [];
            }
            replyMap[parentId].push(comment);
          } else {
            mainComments.push(comment);
          }
        } catch (error) {
          console.error("Lỗi khi phân loại comment:", error, comment);
          mainComments.push(comment); // Thêm vào main comments để không bị mất
        }
      });
      
      // Bước 2: Xử lý từng main comment và thêm replies vào
      return mainComments.map(comment => {
        try {
          // Xác định id của comment
          const commentId = comment.id || comment._id || `comment-${Math.random().toString(36).substr(2, 9)}`;
          
          // Xác định thông tin người dùng
          let userId = comment.userId;
          let userName = "";
          let userAvatar = "";
          
          // Kiểm tra cấu trúc của userId
          if (typeof userId === 'object' && userId !== null) {
            // Trường hợp userId là object { _id, fullName, avatar }
            userName = userId.fullName || userId.name || "Người dùng";
            userAvatar = userId.avatar || DEFAULT_AVATAR;
            userId = userId._id;
          } else if (typeof userId === 'string') {
            // Trường hợp userId chỉ là string ID
            userName = comment.userName || "Người dùng";
            userAvatar = comment.userAvatar || DEFAULT_AVATAR;
          } else {
            // Trường hợp không có userId
            userName = comment.userName || "Người dùng";
            userAvatar = comment.userAvatar || DEFAULT_AVATAR;
            userId = commentId;
          }
          
          // Lấy các replies cho comment này
          const replies = replyMap[commentId] || comment.replies || [];
          
          // Chuẩn hóa các trường của comment
          return {
            id: commentId,
            content: comment.content || "Không có nội dung",
            userId: {
              _id: userId,
              fullName: userName,
              avatar: userAvatar
            },
            timeAgo: comment.timeAgo || "Vừa xong",
            parentCommentId: comment.parentCommentId || null,
            replies: Array.isArray(replies) 
              ? replies.map(reply => normalizeCommentReply(reply, commentId))
              : []
          };
        } catch (error) {
          console.error("Lỗi khi chuẩn hóa comment:", error, comment);
          // Trả về một comment mặc định để tránh lỗi
          return {
            id: `error-${Math.random().toString(36).substr(2, 9)}`,
            content: "Có lỗi khi tải bình luận này",
            userId: {
              _id: "error",
              fullName: "Người dùng",
              avatar: DEFAULT_AVATAR
            },
            timeAgo: "Vừa xong",
            parentCommentId: null,
            replies: []
          };
        }
      });
    }
    
    // Nếu API trả về { data: [...] }
    if (dataFromApi.data && Array.isArray(dataFromApi.data)) {
      console.log("Xử lý dữ liệu từ data:", dataFromApi.data.length, "bình luận");
      return normalizeCommentData(dataFromApi.data);
    }
    
    // Nếu API trả về { comments: [...] }
    if (dataFromApi.comments && Array.isArray(dataFromApi.comments)) {
      console.log("Xử lý dữ liệu từ comments:", dataFromApi.comments.length, "bình luận");
      return normalizeCommentData(dataFromApi.comments);
    }
    
    // Nếu dữ liệu không phải dạng mảng, thử tìm kiếm trong các trường
    if (typeof dataFromApi === 'object' && !Array.isArray(dataFromApi)) {
      for (const key in dataFromApi) {
        if (Array.isArray(dataFromApi[key])) {
          const possibleComments = dataFromApi[key];
          if (possibleComments.length > 0) {
            console.log(`Tìm thấy mảng trong trường '${key}' với ${possibleComments.length} phần tử`);
            return normalizeCommentData(possibleComments);
          }
        }
      }
    }
    
    // Trường hợp không tìm thấy dữ liệu phù hợp
    console.warn("Không thể bình thường hóa dữ liệu:", dataFromApi);
    return [];
  } catch (error) {
    console.error("Lỗi trong normalizeCommentData:", error);
    return [];
  }
};

// Hàm hỗ trợ bình thường hóa câu trả lời cho bình luận
const normalizeCommentReply = (reply, parentId) => {
  try {
    // Xác định id
    const replyId = reply.id || reply._id || `reply-${Math.random().toString(36).substr(2, 9)}`;
    
    // Xác định parentId từ dữ liệu nếu có hoặc sử dụng tham số
    const replyParentId = reply.parentCommentId || reply.parentId || parentId;
    
    // Xác định thông tin người dùng
    let userId = reply.userId;
    let userName = "";
    let userAvatar = "";
    
    // Kiểm tra cấu trúc của userId
    if (typeof userId === 'object' && userId !== null) {
      // Trường hợp userId là object { _id, fullName, avatar }
      userName = userId.fullName || userId.name || "Người dùng";
      userAvatar = userId.avatar || DEFAULT_AVATAR;
      userId = userId._id;
    } else if (typeof userId === 'string') {
      // Trường hợp userId chỉ là string ID
      userName = reply.userName || "Người dùng";
      userAvatar = reply.userAvatar || DEFAULT_AVATAR;
    } else {
      // Trường hợp không có userId - Có thể là reply từ công ty
      userName = reply.userName || "Người dùng";
      userAvatar = reply.userAvatar || DEFAULT_AVATAR;
      userId = replyId;
    }
    
    return {
      id: replyId,
      content: reply.content || "Không có nội dung",
      userId: {
        _id: userId,
        fullName: userName,
        avatar: userAvatar
      },
      timeAgo: reply.timeAgo || "Vừa xong",
      parentCommentId: replyParentId,
      isCompanyReply: reply.isCompanyReply || (!reply.userId && !reply.userName)
    };
  } catch (error) {
    console.error("Lỗi khi xử lý reply:", error, reply);
    return {
      id: `error-reply-${Math.random().toString(36).substr(2, 9)}`,
      content: "Có lỗi khi tải bình luận trả lời này",
      userId: {
        _id: "error",
        fullName: "Người dùng",
        avatar: DEFAULT_AVATAR
      },
      timeAgo: "Vừa xong",
      parentCommentId: parentId
    };
  }
};

// Thêm hàm kiểm tra trạng thái like của tất cả bài viết
const checkPostsLikeStatus = async (postsArray) => {
  if (!Array.isArray(postsArray) || postsArray.length === 0) return [];
  
  try {
    console.log("Kiểm tra trạng thái like cho", postsArray.length, "bài viết");
    
    // Gọi API một lần duy nhất để lấy trạng thái của tất cả bài viết
    const result = await checkLikeStatus();
    console.log("Kết quả kiểm tra like status:", result);
    
    if (result && result.code === 200 && result.allStatus) {
      const likeStatus = result.allStatus;
      console.log("Dữ liệu trạng thái like:", likeStatus);
      
      // Cập nhật trạng thái like cho tất cả bài viết
      const updatedPosts = postsArray.map(post => {
        // Đảm bảo giá trị boolean đúng bằng cách so sánh chính xác
        const postId = post.id;
        const isLiked = likeStatus[postId] === true;
        console.log(`Bài viết ${postId}: isLiked = ${isLiked}, Giá trị gốc = ${likeStatus[postId]}`);
        return {
          ...post,
          isLiked: isLiked
        };
      });
      
      console.log("Đã cập nhật trạng thái like cho tất cả bài viết", updatedPosts);
      return updatedPosts;
    }
    
    // Nếu không có dữ liệu hoặc API thất bại, giữ nguyên mảng ban đầu
    console.warn("Không thể lấy được trạng thái like từ API, giữ nguyên dữ liệu");
    return postsArray;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái like:", error);
    return postsArray;
  }
};

function ManagementPost() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isLikeListVisible, setIsLikeListVisible] = useState(false);
  const [currentLikeList, setCurrentLikeList] = useState([]);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [currentCommentingPostId, setCurrentCommentingPostId] = useState(null);
  const [allComments, setAllComments] = useState({});
  const [loadingAllComments, setLoadingAllComments] = useState(false);
  const [visibleCommentsMap, setVisibleCommentsMap] = useState({});
  const [avatarCache, setAvatarCache] = useState({}); // Cache avatar đã kiểm tra
  
  // Lấy thông tin công ty từ Redux store
  const authenMainEmployer = useSelector(state => state.authenticationReducerEmployer);
  const [companyInfo, setCompanyInfo] = useState({
    name: "Công ty của bạn",
    avatar: DEFAULT_AVATAR
  });
  
  // Cập nhật thông tin công ty khi Redux store thay đổi
  useEffect(() => {
    if (authenMainEmployer?.status && authenMainEmployer?.infoUserEmployer) {
      const employerInfo = authenMainEmployer.infoUserEmployer;
      setCompanyInfo({
        name: employerInfo.companyName || "Công ty của bạn",
        avatar: employerInfo.logoCompany || DEFAULT_AVATAR
      });
    }
  }, [authenMainEmployer]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0 && !loadingAllComments) {
      // Chỉ tải thông tin tóm tắt bình luận (số lượng) không phải chi tiết
      const fetchCommentCounts = async () => {
        try {
          console.log("Đang tải tổng số bình luận cho tất cả bài viết...");
          const result = await getAllPostsComments();
          
          if (result && typeof result === 'object') {
            // Cập nhật commentCount cho các bài viết
            setPosts(prevPosts => 
              prevPosts.map(post => {
                const postId = post.id;
                if (result[postId] && result[postId].comments) {
                  const comments = result[postId].comments || [];
                  
                  // Tính tổng số bình luận bao gồm cả replies
                  let totalCount = 0;
                  if (Array.isArray(comments)) {
                    totalCount = comments.reduce((total, comment) => {
                      const replyCount = comment && comment.replies && Array.isArray(comment.replies) 
                        ? comment.replies.length 
                        : 0;
                      return total + 1 + replyCount;
                    }, 0);
                  }
                  
                  return {
                    ...post,
                    commentCount: totalCount,
                    // Không cập nhật comments chi tiết, chỉ cập nhật số lượng
                  };
                }
                return post;
              })
            );
          }
        } catch (error) {
          console.error("Lỗi khi tải số lượng bình luận:", error);
        }
      };
      
      // Sử dụng setTimeout để tránh blocking UI khi trang vừa tải
      setTimeout(fetchCommentCounts, 1000);
    }
  }, [posts.length, loadingAllComments]);

  useEffect(() => {
    const initialVisibleComments = {};
    posts.forEach(post => {
      initialVisibleComments[post.id] = 3; // Mặc định hiển thị 3 bình luận
    });
    setVisibleCommentsMap(initialVisibleComments);
  }, [posts]);

  // Tự động tải bình luận cho bài viết đang xem
  useEffect(() => {
    if (currentCommentingPostId) {
      const post = posts.find(p => p.id === currentCommentingPostId);
      if (post && !post.commentsLoaded && !post.commentsLoading) {
        // Thêm timeout để tránh fetch quá nhanh
        const timer = setTimeout(() => {
          loadComments(currentCommentingPostId);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentCommentingPostId, posts]);

  // Cải thiện cơ chế tải bình luận để không tải tự động tất cả
  useEffect(() => {
    // Chỉ tải tất cả bình luận nếu cần thiết
    if (posts.length > 0 && !loadingAllComments && currentCommentingPostId === "all") {
      setLoadingAllComments(true);
      
      // Đặt timeout để không fetch quá nhanh
      const timer = setTimeout(() => {
        // Tải bình luận cho tất cả bài viết một lần duy nhất
        const unbatchedLoadComments = async () => {
          // Đánh dấu đang tải bình luận
          setPosts(prevPosts => 
            prevPosts.map(post => ({
              ...post,
              commentsLoading: !post.commentsLoaded
            }))
          );
          
          try {
            // Tải tất cả bình luận từ API
            const allCommentsData = await getAllPostsComments();
            console.log("Đã tải tất cả bình luận:", allCommentsData);
            
            if (allCommentsData && typeof allCommentsData === 'object' && !Array.isArray(allCommentsData)) {
              // Cập nhật state allComments
              setAllComments(allCommentsData);
              
              // Cập nhật state posts với dữ liệu bình luận
              setPosts(prevPosts => 
                prevPosts.map(post => {
                  const postId = post.id;
                  if (allCommentsData[postId]) {
                    const postInfo = allCommentsData[postId].postInfo || {};
                    const postComments = allCommentsData[postId].comments || [];
                    
                    // Chuẩn hóa bình luận để đảm bảo hiển thị đúng
                    const normalizedComments = normalizeCommentData(postComments);
                    
                    return {
                      ...post,
                      comments: normalizedComments,
                      commentCount: normalizedComments.length,
                      commentsLoaded: true,
                      commentsLoading: false,
                      ...(postInfo.caption && { caption: postInfo.caption }),
                      ...(postInfo.likesCount && { likes: postInfo.likesCount }),
                      ...(postInfo.timeAgo && { timeAgo: postInfo.timeAgo })
                    };
                  }
                  return {
                    ...post,
                    commentsLoaded: true,
                    commentsLoading: false,
                    comments: post.comments || []
                  };
                })
              );
            }
          } catch (error) {
            console.error("Lỗi khi tải tất cả bình luận:", error);
            // Đặt lại trạng thái loading
            setPosts(prevPosts => 
              prevPosts.map(post => ({
                ...post,
                commentsLoading: false
              }))
            );
          } finally {
            setLoadingAllComments(false);
          }
        };
        
        // Tải bình luận
        unbatchedLoadComments();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [posts.length, loadingAllComments, currentCommentingPostId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Gọi API lấy bài viết
      console.log("Đang tải danh sách bài viết...");
      const result = await getMyPosts();
      console.log("Kết quả API getMyPosts:", result);
      
      // Kiểm tra nhiều dạng response có thể có
      let fetchedPosts = [];
      if (Array.isArray(result)) {
        // Trường hợp API trả về mảng trực tiếp
        console.log("API trả về mảng trực tiếp với", result.length, "bài viết");
        fetchedPosts = result;
      } else if (result?.code === 200 && Array.isArray(result.data)) {
        // Trường hợp API trả về { code: 200, data: [...] }
        console.log("API trả về cấu trúc { code: 200, data: [...] }");
        fetchedPosts = result.data;
      } else if (result?.posts && Array.isArray(result.posts)) {
        // Trường hợp API trả về { posts: [...] }
        console.log("API trả về cấu trúc { posts: [...] }");
        fetchedPosts = result.posts;
      } else {
        console.error("Không nhận dạng được cấu trúc dữ liệu:", result);
        message.error("Dữ liệu từ API không đúng định dạng");
        fetchedPosts = [];
      }
      
      // Nếu có bài viết, kiểm tra trạng thái like
      if (fetchedPosts.length > 0) {
        console.log("Tải trạng thái like cho", fetchedPosts.length, "bài viết");
        
        try {
          // Gọi API kiểm tra trạng thái like
          const checkResult = await checkLikeStatus();
          console.log("Kết quả kiểm tra like status:", checkResult);
          
          if (checkResult?.code === 200 && checkResult.allStatus) {
            const likeStatus = checkResult.allStatus;
            console.log("Trạng thái like từ API:", likeStatus);
            
            // Áp dụng trạng thái like vào bài viết
            const postsWithLikeStatus = fetchedPosts.map(post => {
              const isLiked = likeStatus[post.id] === true;
              console.log(`Bài viết ${post.id}: isLiked = ${isLiked}, Giá trị gốc = ${likeStatus[post.id]}`);
              
              return {
                ...post,
                isLiked: isLiked
              };
            });
            
            console.log("Đã cập nhật trạng thái like cho tất cả bài viết:", postsWithLikeStatus);
            setPosts(postsWithLikeStatus);
          } else {
            console.warn("Không thể lấy trạng thái like, hiển thị bài viết không có trạng thái");
            setPosts(fetchedPosts);
          }
        } catch (error) {
          console.error("Lỗi khi tải trạng thái like:", error);
          setPosts(fetchedPosts); // Vẫn hiển thị bài viết dù không có trạng thái like
        }
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Có lỗi xảy ra khi tải bài viết");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const result = await deletePost(postId);
      if (result?.code === 200 || result?.message) {
        message.success("Xóa bài viết thành công");
        setPosts(posts.filter(post => post.id !== postId));
        setTimeout(fetchPosts, 1000);
      } else {
        message.error(result?.error || "Không thể xóa bài viết");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Không thể xóa bài viết");
    }
  };

  const handleLike = async (postId) => {
    try {
      console.log("Liking post:", postId);
      
      // Tìm post hiện tại để log trạng thái
      const currentPost = posts.find(p => p.id === postId);
      console.log(`Trạng thái like hiện tại của post ${postId}:`, currentPost?.isLiked);
      
      // Hiển thị trạng thái loading hoặc thông báo
      message.loading({ content: "Đang xử lý...", key: "likeLoading", duration: 0 });
      
      // Thay đổi trạng thái thích ngay lập tức cho UX tốt hơn
      setPosts(prevPosts => {
        const updatedPosts = prevPosts.map(post => {
          if (post.id === postId) {
            const newIsLiked = !post.isLiked;
            const newLikes = newIsLiked 
              ? (post.likes || 0) + 1 
              : Math.max(0, (post.likes || 0) - 1);
            
            console.log(`Cập nhật UI post ${postId}: isLiked = ${newIsLiked}, likes = ${newLikes}`);
            
            return { 
              ...post, 
              isLiked: newIsLiked,
              likes: newLikes,
              justLiked: newIsLiked // Thêm flag để trigger animation
            };
          }
          return post;
        });
        
        return updatedPosts;
      });
      
      // Sau đó gọi API để thực hiện like/unlike
      const result = await likePost(postId);
      console.log("Like result:", result);
      
      // Ẩn thông báo loading
      message.destroy("likeLoading");
      
      if (result?.code === 200 || result?.message) {
        // Thành công, hiện thông báo nhanh
        const newIsLiked = !currentPost?.isLiked;
        message.success({
          content: newIsLiked ? "Đã thích bài viết" : "Đã bỏ thích",
          duration: 1
        });
        
        // Tải lại trạng thái like sau 1 giây
        setTimeout(async () => {
          // Gọi API kiểm tra trạng thái like để đồng bộ lại
          try {
            const checkResult = await checkLikeStatus();
            if (checkResult?.code === 200 && checkResult.allStatus) {
              const likeStatus = checkResult.allStatus;
              setPosts(prevPosts => 
                prevPosts.map(post => {
                  const isLiked = likeStatus[post.id] === true;
                  console.log(`Cập nhật trạng thái like cho post ${post.id}: ${isLiked}`);
                  return {
                    ...post,
                    isLiked: isLiked
                  };
                })
              );
            }
          } catch (error) {
            console.error("Lỗi khi kiểm tra lại trạng thái like:", error);
          }
        }, 1000);
      } else {
        // Nếu có lỗi, cập nhật lại trạng thái với dữ liệu từ server
        message.error(result?.error || "Không thể thích bài viết");
        
        // Gọi API kiểm tra trạng thái like để đồng bộ lại
        try {
          const checkResult = await checkLikeStatus();
          if (checkResult?.code === 200 && checkResult.allStatus) {
            const likeStatus = checkResult.allStatus;
            setPosts(prevPosts => 
              prevPosts.map(post => ({
                ...post,
                isLiked: likeStatus[post.id] === true
              }))
            );
          } else {
            // Nếu không lấy được trạng thái mới, tải lại toàn bộ bài viết
            fetchPosts();
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái like:", error);
          fetchPosts();
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
      message.error("Không thể thích bài viết");
      
      // Ẩn thông báo loading nếu vẫn còn
      message.destroy("likeLoading");
      
      // Tải lại dữ liệu để đảm bảo đồng bộ
      fetchPosts();
    }
  };

  // Hàm kiểm tra ảnh có tồn tại
  const checkImageExists = (url) => {
    if (!url || url.startsWith('data:')) return url; // Nếu là base64 hoặc rỗng, không cần kiểm tra
    
    // Nếu đã kiểm tra, dùng kết quả từ cache
    if (avatarCache[url] !== undefined) {
      return avatarCache[url] ? url : DEFAULT_AVATAR;
    }
    
    // Mặc định trả về URL gốc và để onError xử lý
    return url;
  };

  // Xử lý avatar trong các đối tượng comment để tránh lỗi
  const processComments = (comments) => {
    if (!Array.isArray(comments)) return [];
    
    const processedComments = comments.map(comment => {
      // Clone comment để không thay đổi dữ liệu gốc
      const newComment = { ...comment };
      
      // Xử lý avatar cho comment
      if (newComment.userId && typeof newComment.userId === 'object') {
        if (newComment.userId.avatar) {
          newComment.userId = {
            ...newComment.userId,
            avatar: checkImageExists(newComment.userId.avatar)
          };
        }
      } else if (newComment.userAvatar) {
        newComment.userAvatar = checkImageExists(newComment.userAvatar);
      }
      
      // Xử lý avatar cho replies
      if (Array.isArray(newComment.replies)) {
        newComment.replies = newComment.replies.map(reply => {
          const newReply = { ...reply };
          
          if (newReply.userId && typeof newReply.userId === 'object') {
            if (newReply.userId.avatar) {
              newReply.userId = {
                ...newReply.userId,
                avatar: checkImageExists(newReply.userId.avatar)
              };
            }
          } else if (newReply.userAvatar) {
            newReply.userAvatar = checkImageExists(newReply.userAvatar);
          }
          
          return newReply;
        });
      }
      
      return newComment;
    });
    
    return processedComments;
  };

  const loadComments = async (postId) => {
    try {
      // Hiển thị trạng thái loading chỉ khi chưa có comments
      const post = posts.find(p => p.id === postId);
      const shouldShowLoading = !post.comments || post.comments.length === 0;
      
      // Đặt trạng thái loading
      if (shouldShowLoading) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, commentsLoading: true } 
              : post
          )
        );
      }
      
      // Kiểm tra xem đã có comments trong allComments chưa
      if (allComments[postId] && allComments[postId].comments && allComments[postId].comments.length > 0) {
        console.log("Sử dụng comments đã cached cho post", postId);
        const normalizedComments = normalizeCommentData(allComments[postId].comments);
        
        // Xử lý avatar cho các comment đã cached
        const processedComments = processComments(normalizedComments);
        
        // Thêm log chi tiết về cấu trúc bình luận
        console.log("Số lượng bình luận chính:", processedComments.length);
        processedComments.forEach((comment, idx) => {
          console.log(`Bình luận #${idx+1} ID=${comment.id}, có ${comment.replies?.length || 0} trả lời`);
        });
        
        // Tính tổng số bình luận kể cả replies
        const totalCount = processedComments.reduce((total, comment) => {
          const replyCount = comment && Array.isArray(comment.replies) ? comment.replies.length : 0;
          return total + 1 + replyCount;
        }, 0);
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  comments: processedComments,
                  commentCount: totalCount,
                  commentsLoading: false,
                  commentsLoaded: true,
                } 
              : post
          )
        );
        
        return;
      }
      
      // Gọi API để lấy bình luận
      const token = getCookie("token-employer") || "";
      const API_URL = `${DOMAIN}/api/v1/employer`;
      const url = `${API_URL}/posts/${postId}/comments`;
      
      console.log("Gọi API tải bình luận cho post:", postId);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Kết quả API bình luận:", result);
      
      // Thêm timeout để mô phỏng thời gian tải cho trải nghiệm người dùng tốt hơn
      setTimeout(() => {
        try {
          // Bình thường hóa dữ liệu bình luận
          const normalizedComments = normalizeCommentData(result);
          console.log("Bình luận sau khi chuẩn hóa:", normalizedComments);
          
          // Xử lý avatar validation
          const processedComments = processComments(normalizedComments);
          
          // Thêm log chi tiết về cấu trúc bình luận
          console.log("Số lượng bình luận chính:", processedComments.length);
          processedComments.forEach((comment, idx) => {
            console.log(`Bình luận #${idx+1} ID=${comment.id}, có ${comment.replies?.length || 0} trả lời`);
          });
          
          // Tính tổng số bình luận kể cả replies
          const totalCount = processedComments.reduce((total, comment) => {
            const replyCount = comment && Array.isArray(comment.replies) ? comment.replies.length : 0;
            return total + 1 + replyCount;
          }, 0);
          
          // Cập nhật state với dữ liệu bình luận
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === postId 
                ? { 
                    ...post, 
                    comments: processedComments,
                    commentCount: totalCount,
                    commentsLoading: false,
                    commentsLoaded: true,
                  } 
                : post
            )
          );
          
          // Lưu vào allComments để sử dụng sau
          setAllComments(prev => ({
            ...prev,
            [postId]: {
              comments: processedComments
            }
          }));
        } catch (timeoutError) {
          console.error("Lỗi xử lý bình luận:", timeoutError);
          
          // Đặt lại trạng thái loading và thêm thông tin lỗi
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === postId 
                ? { ...post, commentsLoading: false, commentsError: timeoutError.message } 
                : post
            )
          );
        }
      }, 300);
      
    } catch (error) {
      console.error("Error in loadComments:", error);
      
      // Đặt lại trạng thái loading
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, commentsLoading: false, commentsError: error.message } 
            : post
        )
      );
      
      // Thông báo lỗi
      message.error("Không thể tải bình luận. Vui lòng thử lại sau.");
    }
  };

  const handleCommentClick = (postId) => {
    try {
      // Tìm post trong danh sách
      const post = posts.find(p => p.id === postId);
      if (!post) {
        console.error("Không tìm thấy bài viết với ID:", postId);
        message.error("Không thể tải bình luận cho bài viết này");
        return;
      }
      
      // Nếu đang chọn bài viết này, đóng phần bình luận
      if (currentCommentingPostId === postId) {
        setCurrentCommentingPostId(null);
      } 
      // Nếu chưa chọn hoặc đang chọn bài viết khác, mở bình luận của bài viết này
      else {
        // Trước tiên, đặt trạng thái loading nếu chưa có comments
        if (!post.commentsLoaded && !post.commentsLoading) {
          console.log(`Đặt trạng thái loading cho bài viết ${postId}`);
          setPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === postId 
                ? { ...p, commentsLoading: true } 
                : p
            )
          );
        }
        
        // Sau đó đặt post hiện tại
        setCurrentCommentingPostId(postId);
        
        // Đặt timeout để tránh tình trạng giật gật UI
        if (!post.commentsLoaded && !post.commentsLoading) {
          console.log(`Chuẩn bị tải bình luận cho bài viết ${postId} sau 250ms`);
          setTimeout(() => {
            try {
              console.log(`Bắt đầu tải bình luận cho bài viết ${postId}`);
              loadComments(postId);
            } catch (error) {
              console.error(`Lỗi khi tải bình luận cho bài viết ${postId}:`, error);
              message.error("Có lỗi xảy ra khi tải bình luận");
              
              // Đặt lại trạng thái loading
              setPosts(prevPosts => 
                prevPosts.map(p => 
                  p.id === postId 
                    ? { ...p, commentsLoading: false, commentsError: error.message } 
                    : p
                )
              );
            }
          }, 250);
        } else {
          console.log(`Bài viết ${postId} đã ${post.commentsLoaded ? 'tải' : 'đang tải'} bình luận`);
        }
      }
    } catch (error) {
      console.error("Lỗi trong handleCommentClick:", error);
      message.error("Có lỗi xảy ra khi hiển thị bình luận");
    }
  };

  const handleReply = async (postId, commentId) => {
    const replyKey = `${postId}-${commentId}`;
    const content = replyContent[replyKey]?.trim();
    
    if (!content) {
      message.warning("Vui lòng nhập nội dung trả lời");
      return;
    }
    
    try {
      // Lưu nội dung trước khi xóa để gửi API
      const replyText = content;
      
      // Xóa nội dung ngay lập tức để UX tốt hơn
      setReplyContent(prev => {
        const newState = { ...prev };
        newState[replyKey] = ""; // Xóa nội dung
        newState[`${replyKey}-loading`] = true; // Bật trạng thái loading
        return newState;
      });
      
      // Tìm post để lấy thông tin
      const post = posts.find(p => p.id === postId);
      if (!post) {
        throw new Error("Không tìm thấy bài viết");
      }
      
      // Sử dụng thông tin công ty từ Redux thay vì từ post
      console.log("Gửi reply với thông tin công ty:", companyInfo.name);
      const result = await replyToComment(postId, commentId, replyText);
      
      if (result?.code === 200 || result?.message || result?.reply) {
        message.success("Đã trả lời bình luận");
        
        // Xóa trạng thái loading và đóng form trả lời
        setReplyContent(prev => {
          const newState = { ...prev };
          delete newState[replyKey]; // Đóng form trả lời
          delete newState[`${replyKey}-loading`]; // Xóa trạng thái loading
          return newState;
        });
        
        // Thêm trả lời mới vào state nếu API trả về reply
        if (result.reply) {
          const normalizedReply = normalizeCommentReply(result.reply, commentId);
          
          // Thêm thông tin công ty vào dữ liệu reply
          if (!normalizedReply.userId || typeof normalizedReply.userId !== 'object') {
            normalizedReply.userId = {
              _id: 'company',
              fullName: companyInfo.name,
              avatar: companyInfo.avatar
            };
          }
          
          // Thêm thuộc tính đánh dấu đây là reply từ công ty
          normalizedReply.isCompanyReply = true;
          
          console.log("Thêm reply mới:", normalizedReply, "vào comment có id:", commentId);
          
          setPosts(prevPosts => 
            prevPosts.map(post => {
              if (post.id === postId) {
                const updatedComments = post.comments?.map(comment => {
                  if (comment.id === commentId || comment._id === commentId) {
                    // Tạo một mảng replies mới nếu chưa có
                    const existingReplies = Array.isArray(comment.replies) ? comment.replies : [];
                    
                    // Thêm reply vào comment
                    return {
                      ...comment,
                      replies: [...existingReplies, normalizedReply]
                    };
                  }
                  return comment;
                }) || [];
                
                return {
                  ...post,
                  comments: updatedComments,
                  // Cập nhật commentCount để bao gồm cả replies
                  commentCount: updatedComments.reduce((total, comment) => {
                    // Đếm số lượng replies một cách an toàn
                    const replyCount = comment && comment.replies && Array.isArray(comment.replies) 
                      ? comment.replies.length 
                      : 0;
                    return total + 1 + replyCount;
                  }, 0)
                };
              }
              return post;
            })
          );
        } else {
          // Nếu API không trả về reply trực tiếp, tải lại bình luận
          await loadComments(postId);
        }
      } else {
        message.error(result?.error || "Không thể trả lời bình luận");
        // Tắt trạng thái loading nhưng giữ form trả lời
        setReplyContent(prev => {
          const newState = { ...prev };
          delete newState[`${replyKey}-loading`];
          return newState;
        });
      }
    } catch (error) {
      console.error("Error replying:", error);
      message.error("Không thể trả lời bình luận");
      
      // Tắt trạng thái loading trong trường hợp lỗi
      const replyKey = `${postId}-${commentId}`;
      setReplyContent(prev => {
        const newState = { ...prev };
        delete newState[`${replyKey}-loading`];
        return newState;
      });
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    form.setFieldsValue({
      caption: post.caption,
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("caption", values.caption);
      if (values.images) {
        values.images.forEach(file => {
          formData.append("images", file);
        });
      }

      const result = await updatePost(editingPost.id, formData);
      if (result?.code === 200) {
        message.success("Cập nhật bài viết thành công");
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === editingPost.id ? { ...post, ...result.data } : post
          )
        );
        setIsModalVisible(false);
        setEditingPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Không thể cập nhật bài viết");
    }
  };

  const openImagePreview = (images, index) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setPreviewImage(images[index]);
    setPreviewTitle(`Ảnh ${index + 1}/${images.length}`);
    setPreviewVisible(true);
  };

  const handlePrevImage = () => {
    const newIndex = (previewIndex - 1 + previewImages.length) % previewImages.length;
    setPreviewIndex(newIndex);
    setPreviewImage(previewImages[newIndex]);
    setPreviewTitle(`Ảnh ${newIndex + 1}/${previewImages.length}`);
  };

  const handleNextImage = () => {
    const newIndex = (previewIndex + 1) % previewImages.length;
    setPreviewIndex(newIndex);
    setPreviewImage(previewImages[newIndex]);
    setPreviewTitle(`Ảnh ${newIndex + 1}/${previewImages.length}`);
  };

  const renderImages = (images) => {
    if (!images || images.length === 0) return null;
    
    // Xử lý cả trường hợp ảnh là mảng đường dẫn hoặc mảng đối tượng
    const imageUrls = images.map(img => {
      if (typeof img === 'string') return img;
      if (img.url) return img.url;
      return null;
    }).filter(Boolean);
    
    if (imageUrls.length === 0) return null;
    
    console.log("Rendering images:", imageUrls);
    const maxDisplay = 4;
    const remaining = imageUrls.length > maxDisplay ? imageUrls.length - maxDisplay : 0;

    return (
      <div className="post-images">
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {imageUrls.slice(0, maxDisplay).map((image, index) => {
            const isLastWithMore = index === maxDisplay - 1 && remaining > 0;
            
            return (
              <div 
                key={`image-${index}`} 
                className="relative aspect-w-1 aspect-h-1 cursor-pointer"
                onClick={() => !isLastWithMore && openImagePreview(imageUrls, index)}
              >
                <img
                  src={image}
                  alt={`Post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isLastWithMore && (
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold cursor-pointer"
                    onClick={() => openImagePreview(imageUrls, 0)}
                  >
                    +{remaining}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const viewLikeList = async (postId) => {
    try {
      console.log("Viewing like list for post:", postId);
      setCurrentPostId(postId);
      setIsLikeListVisible(true);
      
      // Thiết lập trạng thái loading cho danh sách like
      setCurrentLikeList([]);
      
      const result = await getLikedList(postId);
      console.log("Like list result:", result);
      
      if (Array.isArray(result)) {
        setCurrentLikeList(result);
      } else if (result?.code === 200 && Array.isArray(result.data)) {
        setCurrentLikeList(result.data);
      } else if (result?.likedUsers && Array.isArray(result.likedUsers)) {
        // Thêm kiểm tra trường hợp API trả về { likedUsers: [...] }
        setCurrentLikeList(result.likedUsers);
      } else {
        setCurrentLikeList([]);
        message.info("Không có ai thích bài viết này");
      }
    } catch (error) {
      console.error("Error getting like list:", error);
      message.error("Không thể tải danh sách thích");
      setCurrentLikeList([]);
    }
  };

  // Khai báo useEffect ở cấp độ component, không phải trong hàm renderComments
  useEffect(() => {
    // Cập nhật số lượng bình luận cho mỗi bài viết dựa trên comments hiện tại
    posts.forEach(post => {
      if (Array.isArray(post.comments) && !post.commentsLoading) {
        // Tính tổng số bình luận bao gồm cả replies
        let totalCount = 0;
        try {
          totalCount = post.comments.reduce((total, comment) => {
            const replyCount = comment && Array.isArray(comment.replies) ? comment.replies.length : 0;
            return total + 1 + replyCount;
          }, 0);
        } catch (error) {
          console.error("Lỗi khi tính tổng bình luận:", error);
          totalCount = post.comments.length;
        }
        
        // Cập nhật commentCount nếu khác với giá trị hiện tại
        if (post.commentCount !== totalCount) {
          setPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === post.id ? { ...p, commentCount: totalCount } : p
            )
          );
        }
      }
    });
  }, [posts]);

  // Hiển thị bình luận theo cấu trúc dữ liệu mới
  const renderComments = (post) => {
    const postId = post.id;
    
    // Kiểm tra xem có dữ liệu bình luận cho bài viết này không
    const postComments = post.comments || [];
    const isLoading = post.commentsLoading || false;
    
    // State để quản lý số lượng bình luận hiển thị
    const visibleComments = visibleCommentsMap[postId] || 3;
    
    // Tính tổng số bình luận bao gồm cả replies
    const calculateTotalComments = (comments) => {
      if (!Array.isArray(comments)) return 0;
      
      try {
        let total = comments.length;
        comments.forEach(comment => {
          if (comment && Array.isArray(comment.replies)) {
            total += comment.replies.length;
          }
        });
        
        return total;
      } catch (error) {
        console.error("Lỗi khi tính tổng số bình luận:", error);
        return comments.length; // Fallback an toàn
      }
    };
    
    const totalCommentsCount = calculateTotalComments(postComments);
    
    if (isLoading) {
      return (
        <div className="text-center py-3">
          <Spin size="small" tip="Đang tải bình luận..." />
        </div>
      );
    }
    
    if (!Array.isArray(postComments) || postComments.length === 0) {
      return (
        <div className="text-center text-gray-500 text-sm mt-2 py-3">
          Chưa có bình luận nào
        </div>
      );
    }

    // Số lượng bình luận để hiển thị
    const commentsToShow = postComments.slice(0, visibleComments);
    
    return (
      <div className="comments-container">
        <div className="comments-count text-gray-500 text-sm mb-3">
          {typeof totalCommentsCount === 'number' ? totalCommentsCount : postComments.length} bình luận
        </div>
        
        {commentsToShow.map((comment, index) => {
          try {
            // Kiểm tra cấu trúc của comment và lấy thông tin
            const userId = comment.userId;
            
            // Xác định thông tin người dùng từ cấu trúc mới
            let userAvatar, userName, userId_id;
            
            if (typeof userId === 'object' && userId !== null) {
              // Cấu trúc mới: comment.userId là object
              userAvatar = userId.avatar || DEFAULT_AVATAR;
              userName = userId.fullName || "Người dùng";
              userId_id = userId._id;
            } else {
              // Cấu trúc cũ
              userAvatar = comment.userAvatar || DEFAULT_AVATAR;
              userName = comment.userName || "Người dùng";
              userId_id = comment.userId;
            }
            
            const commentId = comment.id || comment._id || `temp-${index}`;
            const content = comment.content || "Không có nội dung";
            const hasReplies = comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0;
            
            return (
              <div key={`comment-${commentId}`} className="mb-4 comment-thread">
                {/* Bình luận chính */}
                <div className="flex items-start space-x-2">
                  <img
                    src={userAvatar}
                    alt={`${userName} Avatar`}
                    className="w-8 h-8 rounded-full border border-gray-200"
                    onError={(e) => {
                      if (e.target.src !== DEFAULT_AVATAR) {
                        e.target.src = DEFAULT_AVATAR;
                      }
                      e.target.onerror = null; // Tránh vòng lặp vô hạn
                    }}
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-2">
                      <div className="font-semibold text-sm text-gray-800">
                        {userName}
                      </div>
                      <div className="text-gray-700 text-sm">
                        {content}
                      </div>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                      <span>{comment.timeAgo || "Vừa xong"}</span>
                      <button
                        onClick={() => setReplyContent(prev => ({ 
                          ...prev, 
                          [`${post.id}-${commentId}`]: "" 
                        }))}
                        className="text-blue-500 hover:underline"
                      >
                        Trả lời
                      </button>
                      {hasReplies && (
                        <span>{comment.replies.length} phản hồi</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phần hiển thị form trả lời và các replies - đều cùng là con của comment-thread */}
                <div className="comment-responses">
                  {/* Form trả lời bình luận */}
                  {replyContent[`${post.id}-${commentId}`] !== undefined && (
                    <div className="ml-8 mt-2 mb-2 flex items-start space-x-2 reply-form">
                      <img
                        src={companyInfo.avatar}
                        alt="Company Avatar"
                        className="w-7 h-7 rounded-full border border-gray-200"
                        onError={(e) => {
                          if (e.target.src !== DEFAULT_AVATAR) {
                            e.target.src = DEFAULT_AVATAR;
                          }
                          e.target.onerror = null;
                        }}
                      />
                      <div className="flex-1 flex flex-col">
                        <ConfigProvider
                          theme={{
                            token: { colorPrimary: "#5dcaf9" },
                            components: { Input: { paddingInlineLG: 12, paddingBlockLG: 6 } },
                          }}
                        >
                          <Input
                            value={replyContent[`${post.id}-${commentId}`] || ""}
                            onChange={(e) =>
                              setReplyContent(prev => ({
                                ...prev,
                                [`${post.id}-${commentId}`]: e.target.value,
                              }))
                            }
                            placeholder={`${companyInfo.name} đang trả lời...`}
                            className="flex-1 rounded-full reply-input"
                            disabled={replyContent[`${post.id}-${commentId}-loading`]}
                            suffix={
                              replyContent[`${post.id}-${commentId}-loading`] ? (
                                <Spin size="small" />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faPaperPlane}
                                  onClick={() => handleReply(post.id, commentId)}
                                  className="text-gray-500 cursor-pointer hover:text-blue-500"
                                />
                              )
                            }
                            onPressEnter={(e) => {
                              e.preventDefault(); // Ngăn chặn hành vi mặc định
                              if (!replyContent[`${post.id}-${commentId}-loading`]) {
                                handleReply(post.id, commentId);
                              }
                            }}
                            autoFocus // Tự động focus vào input khi hiển thị
                          />
                        </ConfigProvider>
                        <div className="text-right mt-1">
                          <Button 
                            type="text" 
                            size="small" 
                            onClick={() => {
                              // Xóa state trả lời cho bình luận này
                              setReplyContent(prev => {
                                const newState = { ...prev };
                                delete newState[`${post.id}-${commentId}`];
                                delete newState[`${post.id}-${commentId}-loading`];
                                return newState;
                              });
                            }}
                            className="text-gray-500 hover:text-red-500"
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hiển thị các trả lời cho bình luận theo kiểu Facebook */}
                  {hasReplies && (
                    <div className="comment-replies">
                      {comment.replies.map((reply, replyIndex) => {
                        try {
                          // Xác định thông tin người dùng từ cấu trúc mới cho reply
                          let replyUserAvatar, replyUserName;
                          
                          // Kiểm tra xem reply có phải là reply từ công ty không
                          const isCompanyReply = !reply.userId || (reply.userId === null);
                          
                          if (isCompanyReply) {
                            // Nếu là reply từ công ty, sử dụng thông tin công ty
                            replyUserAvatar = companyInfo.avatar;
                            replyUserName = companyInfo.name;
                          } else if (typeof reply.userId === 'object' && reply.userId !== null) {
                            // Cấu trúc mới: reply.userId là object
                            replyUserAvatar = reply.userId.avatar || DEFAULT_AVATAR;
                            replyUserName = reply.userId.fullName || "Người dùng";
                          } else {
                            // Cấu trúc cũ
                            replyUserAvatar = reply.userAvatar || DEFAULT_AVATAR;
                            replyUserName = reply.userName || "Người dùng";
                          }
                          
                          const replyId = reply.id || reply._id || `reply-${replyIndex}`;
                          const replyContent = reply.content || "Không có nội dung";
                          
                          return (
                            <div key={`reply-${replyId}`} className="ml-8 pl-3 border-l-2 border-gray-200 mb-2 reply-item">
                              <div className="flex items-start space-x-2">
                                <img
                                  src={replyUserAvatar}
                                  alt={`${replyUserName} Avatar`}
                                  className="w-7 h-7 rounded-full border border-gray-200"
                                  onError={(e) => {
                                    if (e.target.src !== DEFAULT_AVATAR) {
                                      e.target.src = DEFAULT_AVATAR;
                                    }
                                    e.target.onerror = null; // Tránh vòng lặp vô hạn
                                  }}
                                />
                                <div className="flex-1">
                                  <div className="bg-gray-100 rounded-lg p-2">
                                    <div className="font-semibold text-sm text-gray-800">
                                      {replyUserName}
                                      {isCompanyReply && <span className="ml-1 text-xs text-blue-500">(Công ty)</span>}
                                    </div>
                                    <div className="text-gray-700 text-sm">
                                      {replyContent}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {reply.timeAgo || "Vừa xong"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } catch (error) {
                          console.error("Lỗi khi hiển thị reply:", error);
                          return null; // Trả về null để tránh lỗi
                        }
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          } catch (error) {
            console.error("Lỗi khi hiển thị bình luận:", error);
            return null; // Trả về null để tránh lỗi
          }
        })}
        
        {/* Nút xem thêm bình luận */}
        {postComments.length > visibleComments && (
          <div className="text-center mt-2">
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleLoadMoreComments(postId)}
              className="text-blue-500 hover:text-blue-700"
            >
              {visibleComments === 3 
                ? `Xem thêm ${Math.min(postComments.length - visibleComments, 2)} bình luận` 
                : `Xem tất cả ${postComments.length - visibleComments} bình luận`}
            </Button>
          </div>
        )}
        
        {visibleComments > 5 && postComments.length > 5 && (
          <div className="text-center mt-2">
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleCollapseComments(postId)}
              className="text-gray-500 hover:text-gray-700"
            >
              Thu gọn
            </Button>
          </div>
        )}
      </div>
    );
  };

  const handleLoadMoreComments = (postId) => {
    setVisibleCommentsMap(prev => {
      const currentVisible = prev[postId] || 3;
      if (currentVisible === 3) {
        return { ...prev, [postId]: 5 }; // Hiển thị 5 bình luận
      } else {
        const post = posts.find(p => p.id === postId);
        const totalComments = post?.comments?.length || 0;
        return { ...prev, [postId]: totalComments }; // Hiển thị tất cả bình luận
      }
    });
  };

  const handleCollapseComments = (postId) => {
    setVisibleCommentsMap(prev => ({ ...prev, [postId]: 5 }));
  };

  // Thêm hàm mới để xử lý xác nhận xóa
  const showDeleteConfirm = (post) => {
    setPostToDelete(post);
    setIsDeleteModalVisible(true);
  };

  // Xác nhận xóa bài viết
  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      setLoading(true);
      const result = await deletePost(postToDelete.id);
      if (result?.code === 200 || result?.message) {
        message.success("Xóa bài viết thành công");
        setPosts(posts.filter(post => post.id !== postToDelete.id));
        setTimeout(fetchPosts, 1000);
      } else {
        message.error(result?.error || "Không thể xóa bài viết");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Không thể xóa bài viết");
    } finally {
      setIsDeleteModalVisible(false);
      setPostToDelete(null);
      setLoading(false);
    }
  };

  // Hủy xóa bài viết
  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setPostToDelete(null);
  };

  // Thêm hàm debug để kiểm tra trạng thái like
  useEffect(() => {
    // Kiểm tra và in trạng thái like của tất cả bài viết
    if (posts.length > 0) {
      console.log("=== KIỂM TRA TRẠNG THÁI LIKE CỦA TẤT CẢ BÀI VIẾT ===");
      posts.forEach(post => {
        console.log(`Bài viết ID=${post.id}, isLiked=${post.isLiked === true ? 'TRUE' : 'FALSE'}, Likes count=${post.likes || 0}`);
      });
      console.log("===================================================");
    }
  }, [posts]);

  // Thêm hàm renderLikeButton để hiển thị nút like với trạng thái rõ ràng hơn
  const renderLikeButton = (post) => {
    // Xác định trạng thái like từ post
    const isLiked = post.isLiked === true;
    
    return (
      <button
        onClick={() => handleLike(post.id)}
        className={`flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
          isLiked ? "post-liked" : "text-gray-600"
        }`}
        data-is-liked={isLiked ? "true" : "false"}
        data-post-id={post.id}
      >
        <FontAwesomeIcon 
          icon={faHeart} 
          className={isLiked ? "text-red-500" : ""} 
        />
        <span>{isLiked ? "Đã thích" : "Thích"}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h2>
          <Button 
            type="primary" 
            onClick={() => navigate("/nha-tuyen-dung/app/create-post")}
            style={{ background: "#5dcaf9", borderColor: "#5dcaf9" }}
          >
            Tạo bài viết mới
          </Button>
        </div>

        {loading ? (
          <div className="text-center p-8">
            <Spin size="large" tip="Đang tải bài viết..." />
          </div>
        ) : (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={`post-${post.id}`} className="bg-white rounded-lg shadow-md p-4 post-item">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <img
                        src={post.companyLogo || companyInfo.avatar}
                        alt="Company Logo"
                        className="w-10 h-10 rounded-full mr-3 border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {post.companyName || companyInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.timeAgo}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => showDeleteConfirm(post)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 whitespace-pre-line">{post.caption}</p>
                    {renderImages(post.images)}
                  </div>

                  <div className="flex justify-between text-gray-500 text-sm mb-2">
                    <span 
                      className="cursor-pointer hover:text-blue-500" 
                      onClick={() => viewLikeList(post.id)}
                    >
                      {post.likes || 0} lượt thích
                    </span>
                    <span>{typeof post.commentCount === 'number' ? post.commentCount : 0} bình luận</span>
                  </div>

                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-around text-gray-600">
                      {renderLikeButton(post)}
                      <button 
                        onClick={() => handleCommentClick(post.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
                          currentCommentingPostId === post.id ? "text-blue-500 bg-blue-50" : ""
                        }`}
                      >
                        <FontAwesomeIcon icon={faComment} />
                        <span>Bình luận ({typeof post.commentCount === 'number' ? post.commentCount : 0})</span>
                      </button>
                    </div>
                  </div>

                  {/* Hiển thị phần bình luận cho bài viết đang được chọn */}
                  {currentCommentingPostId === post.id && (
                    <div className={`mt-4 comments-section custom-scrollbar ${post.commentsLoading ? 'loading' : ''}`}>
                      {renderComments(post)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 bg-white p-8 rounded-lg shadow">
                <p className="mb-4">Chưa có bài viết nào</p>
                <Button 
                  type="primary" 
                  onClick={() => navigate("/nha-tuyen-dung/app/create-post")}
                  style={{ background: "#5dcaf9", borderColor: "#5dcaf9" }}
                >
                  Tạo bài viết đầu tiên
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        title="Chỉnh sửa bài viết"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPost(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="caption"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: "#5dcaf9", borderColor: "#5dcaf9" }}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa bài viết"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: loading }}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      <Modal
        title="Danh sách người đã thích"
        open={isLikeListVisible}
        onCancel={() => setIsLikeListVisible(false)}
        footer={null}
      >
        {currentLikeList.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {currentLikeList.map((user, index) => (
              <div key={`like-${index}`} className="flex items-center py-2 border-b">
                <img
                  src={user.avatar || DEFAULT_AVATAR}
                  alt={`${user.fullName || 'User'} Avatar`}
                  className="w-10 h-10 rounded-full mr-3 border border-gray-200"
                  onError={(e) => {
                    if (e.target.src !== DEFAULT_AVATAR) {
                      e.target.src = DEFAULT_AVATAR;
                    }
                    e.target.onerror = null; // Tránh vòng lặp vô hạn
                  }}
                />
                <div className="font-medium">{user.fullName || user.name || "Người dùng"}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">Không có ai thích bài viết này</div>
        )}
      </Modal>

      {/* Modal xem ảnh với nút chuyển qua lại */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
      >
        <div className="relative">
          <img 
            alt={previewTitle} 
            src={previewImage} 
            style={{ width: '100%' }} 
          />
          
          {previewImages.length > 1 && (
            <>
              <Button 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
                icon={<FontAwesomeIcon icon={faChevronLeft} />} 
                onClick={handlePrevImage}
                shape="circle"
                style={{ background: 'rgba(255, 255, 255, 0.8)' }}
              />
              
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                icon={<FontAwesomeIcon icon={faChevronRight} />} 
                onClick={handleNextImage}
                shape="circle"
                style={{ background: 'rgba(255, 255, 255, 0.8)' }}
              />
            </>
          )}
        </div>
        
        {/* Hiển thị các ảnh nhỏ bên dưới để dễ chuyển */}
        {previewImages.length > 1 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto py-2">
            {previewImages.map((image, index) => (
              <div 
                key={`thumb-${index}`}
                className={`cursor-pointer border-2 ${index === previewIndex ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => {
                  setPreviewIndex(index);
                  setPreviewImage(image);
                  setPreviewTitle(`Ảnh ${index + 1}/${previewImages.length}`);
                }}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`}
                  className="h-16 w-16 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ManagementPost;
