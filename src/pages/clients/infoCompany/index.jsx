import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompany } from "../../../services/clients/employersApi";
import { getEmployerPosts, likePost, commentOnPost, checkLikedStatus, getPostComments, checkEmployerPostsLikeStatus } from "../../../services/clients/postApi";
import { decData } from "../../../helpers/decData";
import { getCookie } from "../../../helpers/cookie";
import "./infoCompany.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faLink,
  faLocationDot,
  faMap,
  faPhone,
  faUserGroup,
  faHeart,
  faComment,
  faPaperPlane,
  faXmark,
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faExpand,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import MemoizedJobByCompany from "../../../components/clients/jobByCompany";
import { ConfigProvider, Input, message, Image } from "antd";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faFacebook,
  faSquareInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import MemoizedBoxGoogleMap from "../../../components/clients/boxGoogleMap";
import { getCoordinateAddress } from "../../../services/locations/locationsApi";
import { useSelector } from "react-redux";

import { dataNumberOfWorkers } from "./js/options";

function InfoCompany() {
  const { Search } = Input;
  const [currentPath] = useState(window.location);
  const [isExpanded, setIsExpanded] = useState(false);
  const [location, setLocation] = useState([0, 0]);
  const { slug } = useParams();
  const [recordItem, setRecordItem] = useState([]);
  const [employersWithJobCounts, setEmployersWithJobCounts] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [commentContent, setCommentContent] = useState({});
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [imageViewer, setImageViewer] = useState({
    postId: null,
    visible: false,
    images: [],
    currentIndex: 0
  });

  const authUser = useSelector((state) => state.authenticationReducerClient?.infoUser);

  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    const fetchCompanyData = async () => {
      const result = await getCompany(slug);
      if (result.code !== 200) return;

      const dectDataConvert = decData(result.data);
      console.log("Thông tin công ty:", dectDataConvert);
      handleAddress(dectDataConvert);
      handleNumberOfWorkers(dectDataConvert);
      setRecordItem(dectDataConvert);
      setEmployersWithJobCounts(result.employersWithJobCounts);
    };

    const handleNumberOfWorkers = (data) => {
      data.numberOfWorkers = dataNumberOfWorkers.find((item) => item?.value === data?.numberOfWorkers)?.label;
    };
      
    const handleAddress = async (data) => {
      if (!isAddressValid(data?.specificAddressCompany)) return;

      const placeId = getPlaceIdFromAddress(data.specificAddressCompany);
      const location = await fetchLocation(placeId);
      if (location) setLocation(location);

      const address = getAddressFromAddressString(data.specificAddressCompany);
      data.specificAddressCompany = address;
    };

    const isAddressValid = (address) => {
      return typeof address === "string" && address.includes("-");
    };

    const getPlaceIdFromAddress = (address) => {
      return address.split("-")[1];
    };

    const fetchLocation = async (placeId) => {
      const result = await getCoordinateAddress({ placeid: placeId });
      if (result.code !== 200) return null;
      return [result?.data?.location?.lat, result?.data?.location?.lng];
    };

    const getAddressFromAddressString = (address) => {
      return address.split("-")[0];
    };

    fetchCompanyData();
  }, [slug]);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    
    if (activeTab === 'posts' && recordItem?.slug) {
      fetchPosts();
    }
  }, [activeTab, recordItem]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    const token = getCookie("token-user") || "";

    if (!token) {
      setPostsError("Vui lòng đăng nhập để xem bài viết.");
      setPostsLoading(false);
      return;
    }

    try {
      const employerId = recordItem?._id || recordItem?.slug;
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
        
        setPosts(postsWithDefaults);
        
        if (result.length > 0) {
          console.log(`Fetching details for ${result.length} posts...`);
          
          const postIds = postsWithDefaults.map(post => post.id).filter(Boolean);
          
          if (postIds.length > 0) {
            try {
              const likeStatusResult = await checkEmployerPostsLikeStatus(employerId, token);
              
              if (likeStatusResult?.code === 200 && likeStatusResult.data) {
                console.log("Like status for employer posts:", likeStatusResult.data);
                
                setPosts(prevPosts => 
                  prevPosts.map(post => ({
                    ...post,
                    isLiked: likeStatusResult.data[post.id] === true
                  }))
                );
              } else {
                console.log("Trying individual like status check for each post");
                const batchLikeStatus = await checkLikedStatus(postIds);
                if (batchLikeStatus?.code === 200 && batchLikeStatus.data) {
                  setPosts(prevPosts => 
                    prevPosts.map(post => ({
                      ...post,
                      isLiked: batchLikeStatus.data[post.id] === true
                    }))
                  );
                }
              }
            } catch (likeError) {
              console.error("Error checking like status:", likeError);
            }
          }
          
          for (const post of postsWithDefaults) {
            if (post.id) {
              try {
                const commentsResult = await getPostComments(post.id);
                
                if (commentsResult?.code === 200 && commentsResult.data && Array.isArray(commentsResult.data)) {
                  console.log(`Comments for post ${post.id}:`, commentsResult.data);
                  
                  setPosts(prevPosts => 
                    prevPosts.map(p => 
                      p.id === post.id ? { ...p, comments: commentsResult.data } : p
                    )
                  );
                }
              } catch (commentsError) {
                console.error(`Error fetching comments for post ${post.id}:`, commentsError);
              }
            }
          }
        }
      } else if (result?.error) {
        console.log("InfoCompany - Posts Error:", result.error);
        setPostsError(result.error || "Không tìm thấy bài viết.");
      } else {
        setPostsError("Dữ liệu bài viết không hợp lệ.");
      }
    } catch (err) {
      console.error("InfoCompany - Posts Error:", err);
      setPostsError("Lỗi khi tải bài viết: " + (err.message || "Không rõ nguyên nhân."));
    } finally {
      setPostsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      console.log("Liking post:", postId);
      
      const currentPost = posts.find(p => p.id === postId);
      if (!currentPost) {
        console.error("Post not found:", postId);
        return;
      }
      
      const wasLiked = currentPost.isLiked;
      console.log("Current like status before API call:", wasLiked);
      
      // Đảo ngược trạng thái like trước, để UI phản hồi ngay lập tức
      const newIsLiked = !wasLiked;
      
      // Cập nhật UI ngay lập tức - Sử dụng biến tạm để tránh hiệu ứng trở về
      const tempPostId = `temp-${postId}`;
      setPosts((prevPosts) => {
        // Tạo bản sao mới của mảng bài viết
        const newPosts = prevPosts.map((post) => {
          if (post.id === postId) {
            const newLikes = newIsLiked 
              ? (post.likes || 0) + 1 
              : Math.max(0, (post.likes || 0) - 1);
            
            console.log(`Updating post UI - isLiked: ${wasLiked} -> ${newIsLiked}, likes: ${post.likes} -> ${newLikes}`);
            
            return {
              ...post,
              likes: newLikes,
              isLiked: newIsLiked,
              tempId: tempPostId, // Đánh dấu bài viết này đã được cập nhật
            };
          }
          return post;
        });
        
        return newPosts;
      });
      
      // Gọi API - Sử dụng async/await để đảm bảo xử lý tuần tự
      const result = await likePost(postId);
      console.log("Like API response:", result);
      
      // Kiểm tra xem đã có sự thay đổi UI từ lúc gửi request đến lúc nhận response không
      const currentUIPost = posts.find(p => p.id === postId);
      const hasUIChanged = currentUIPost && currentUIPost.tempId === tempPostId;
      
      // Nếu API thành công và UI đã được cập nhật
      if (result?.code === 200 && hasUIChanged) {
        let finalLikeStatus = newIsLiked; // Mặc định giữ trạng thái UI hiện tại
        
        // Nếu API trả về trạng thái rõ ràng
        if (result.data && result.data.isLiked !== undefined) {
          finalLikeStatus = result.data.isLiked;
        } 
        // Hoặc nếu có thông điệp trả về
        else if (result.message) {
          const unlikeMessage = result.message.includes("Bỏ like");
          const likeMessage = result.message.includes("đã like");
          
          if (likeMessage) {
            finalLikeStatus = true;
          } else if (unlikeMessage) {
            finalLikeStatus = false;
          }
        }
        
        // Nếu trạng thái cuối cùng khác với trạng thái UI hiện tại
        if (finalLikeStatus !== newIsLiked) {
          console.log("Updating UI with final like status:", finalLikeStatus);
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post.id === postId) {
                const finalLikes = finalLikeStatus 
                  ? (wasLiked ? post.likes : post.likes + 1) 
                  : (wasLiked ? post.likes - 1 : post.likes);
                
                return {
                  ...post,
                  likes: finalLikes,
                  isLiked: finalLikeStatus,
                  tempId: null, // Xóa tempId
                };
              }
              return post;
            })
          );
        } else {
          // Xóa tempId để hoàn tất quá trình cập nhật
          setPosts((prevPosts) =>
            prevPosts.map((post) => 
              post.id === postId 
                ? {...post, tempId: null} 
                : post
            )
          );
        }
        
        // Thông báo thành công
        const actionText = finalLikeStatus ? "Đã thích" : "Đã bỏ thích";
        showNotification(`${actionText} bài viết`, 'success');
      } 
      // Nếu API thất bại nhưng UI đã cập nhật
      else if (hasUIChanged) {
        console.error("Like API failed, reverting to previous state");
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likes: wasLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
                isLiked: wasLiked,
                tempId: null, // Xóa tempId
              };
            }
            return post;
          })
        );
        
        showNotification('Không thể cập nhật trạng thái thích', 'error');
      }
      
      // Sau khi like/dislike thành công, cập nhật lại thông tin chi tiết (đã được chuyển vào xử lý success)
      if (result?.code === 200) {
        setTimeout(() => {
          fetchPostDetails(postId);
        }, 500);
      }
    } catch (err) {
      console.error("InfoCompany - Error liking post:", err);
      showNotification('Đã xảy ra lỗi', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const openImageViewer = (postId, images, index = 0) => {
    if (!images || images.length === 0) return;

    const validImages = images.filter(img => img && img.trim() !== '');

    if (validImages.length === 0) return;

    console.log("Opening image viewer for post:", postId);
    console.log("Images:", validImages);
    console.log("Starting at index:", index);

    setImageViewer({
      postId,
      visible: true,
      images: validImages,
      currentIndex: index >= validImages.length ? 0 : index
    });
  };

  const closeImageViewer = () => {
    console.log("Closing image viewer");
    setImageViewer(prev => ({ ...prev, visible: false }));
    
    setTimeout(() => {
      setImageViewer({
        postId: null,
        visible: false,
        images: [],
        currentIndex: 0
      });
    }, 300);
  };

  const navigateImage = (direction) => {
    const { images, currentIndex } = imageViewer;
    let newIndex;

    if (direction === 'next') {
      newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    }

    console.log(`Navigating ${direction} from index ${currentIndex} to ${newIndex}`);
    setImageViewer({ ...imageViewer, currentIndex: newIndex });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imageViewer.visible) return;

      switch (e.key) {
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'Escape':
          closeImageViewer();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageViewer]);

  const getLikeButtonColor = (isLiked) => {
    console.log("getLikeButtonColor called with:", isLiked);
    return isLiked ? "text-blue-500" : "";
  };

  const handleComment = async (postId) => {
    if (!commentContent[postId]?.trim()) {
      return;
    }

    try {
      // Xóa nội dung input ngay lập tức
      setCommentContent((prev) => ({ ...prev, [postId]: "" }));

      // Gửi bình luận
      const result = await commentOnPost(postId, commentContent[postId]);
      
      if (result?.code === 200) {
        // Đợi một chút để server xử lý xong
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch lại bình luận mới nhất
        const commentsResult = await getPostComments(postId);
        if (commentsResult?.code === 200 && commentsResult.data) {
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === postId
                ? { ...post, comments: commentsResult.data }
                : post
            )
          );
        }
      }
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  // Thêm hàm mới để xử lý việc gửi bình luận khi nhấn Enter
  const handleCommentKeyPress = (e, postId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment(postId);
    }
  };

  const renderPostImages = (postId, images) => {
    if (!images || images.length === 0) return null;
    const validImages = images.filter(img => img && img.trim() !== '');
    const total = validImages.length;

    // 2 ảnh: chia đôi ngang, mỗi ô vuông
    if (total === 2) {
      return (
        <div className="post-images">
          <Image.PreviewGroup items={validImages}>
            <div style={{ display: 'flex', gap: 4 }}>
              {validImages.map((img, idx) => (
                <div key={idx} style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden' }}>
                  <Image src={img} alt={`Post ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preview={{ src: img }} />
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        </div>
      );
    }

    // 3 ảnh: bên trái 1 ô vuông, bên phải 2 ô vuông dọc
    if (total === 3) {
      return (
        <div className="post-images">
          <Image.PreviewGroup items={validImages}>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden' }}>
                <Image src={validImages[0]} alt="Post 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} preview={{ src: validImages[0] }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden' }}>
                  <Image src={validImages[1]} alt="Post 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} preview={{ src: validImages[1] }} />
                </div>
                <div style={{ flex: 1, aspectRatio: '1/1', overflow: 'hidden' }}>
                  <Image src={validImages[2]} alt="Post 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} preview={{ src: validImages[2] }} />
                </div>
              </div>
            </div>
          </Image.PreviewGroup>
        </div>
      );
    }

    // 4 ảnh trở lên: grid 2x2, ô thứ 4 overlay dấu +, preview đủ ảnh
    if (total >= 4) {
      // Chỉ render 4 ô, nhưng preview đủ toàn bộ ảnh
      return (
        <div className="post-images">
          <Image.PreviewGroup items={validImages}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4 }}>
              {validImages.slice(0, 3).map((img, idx) => (
                <div key={idx} style={{ aspectRatio: '1/1', width: '100%', overflow: 'hidden' }}>
                  <Image src={img} alt={`Post ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preview={{ src: img }} />
                </div>
              ))}
              <div style={{ aspectRatio: '1/1', width: '100%', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                <Image src={validImages[3]} alt="Post 4" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: total > 4 ? 'brightness(0.4) blur(2px)' : undefined }} preview={{ src: validImages[3] }} />
                {total > 4 && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 32, fontWeight: 'bold', background: 'rgba(0,0,0,0.4)',
                    pointerEvents: 'none',
                  }}>
                    +{total - 4}
                  </div>
                )}
              </div>
            </div>
          </Image.PreviewGroup>
        </div>
      );
    }

    // 1 ảnh (mặc định)
    if (total === 1) {
      return (
        <div className="post-images single-image">
          <Image.PreviewGroup items={validImages}>
            <div className="image-wrapper" style={{ aspectRatio: '1/1', width: '100%', overflow: 'hidden' }}>
              <Image
                src={validImages[0]}
                alt="Post image"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                preview={{ src: validImages[0] }}
              />
            </div>
          </Image.PreviewGroup>
        </div>
      );
    }

    return null;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const updatePostLikeStatus = async () => {
      if (posts.length === 0 || !recordItem?.slug || activeTab !== 'posts') return;
      
      try {
        const employerId = recordItem?._id || recordItem?.slug;
        console.log("Periodically checking like status for posts");
        const likeStatusResult = await checkEmployerPostsLikeStatus(employerId);
        
        if (likeStatusResult?.code === 200 && likeStatusResult.data) {
          console.log("Refreshing like statuses:", likeStatusResult.data);
          
          setPosts(prevPosts => 
            prevPosts.map(post => ({
              ...post,
              isLiked: likeStatusResult.data[post.id] === true
            }))
          );
        }
      } catch (err) {
        console.error("Error updating like status:", err);
      }
    };

    if (activeTab === 'posts' && posts.length > 0) {
      updatePostLikeStatus();
    }

    return () => {};
  }, [activeTab, posts.length, recordItem?.slug]);

  const fetchPostDetails = async (postId) => {
    if (!postId) return;
    
    try {
      console.log("Fetching details for post:", postId);
      
      try {
        const likeStatusResult = await checkLikedStatus([postId]);
        if (likeStatusResult?.code === 200 && likeStatusResult.data) {
          const isLiked = likeStatusResult.data[postId] === true;
          console.log(`Post ${postId} like status:`, isLiked);
          
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === postId
                ? { ...post, isLiked: isLiked }
                : post
            )
          );
        }
      } catch (likeError) {
        console.error(`Error checking like status for post ${postId}:`, likeError);
      }
      
      try {
        const commentsResult = await getPostComments(postId);
        if (commentsResult?.code === 200 && commentsResult.data) {
          console.log(`Refreshed comments for post ${postId}:`, commentsResult.data);
          
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === postId
                ? { ...post, comments: commentsResult.data }
                : post
            )
          );
        }
      } catch (commentsError) {
        console.error(`Error fetching comments for post ${postId}:`, commentsError);
      }
      
    } catch (err) {
      console.error(`Error fetching details for post ${postId}:`, err);
    }
  };

  const refreshAllPosts = async () => {
    if (posts.length === 0 || !recordItem?.slug) return;
    console.log("Refreshing all posts data");
    
    try {
      const employerId = recordItem?._id || recordItem?.slug;
      const likeStatusResult = await checkEmployerPostsLikeStatus(employerId);
      
      if (likeStatusResult?.code === 200 && likeStatusResult.data) {
        console.log("Refreshed all posts like status");
        setPosts(prevPosts => 
          prevPosts.map(post => ({
            ...post,
            isLiked: likeStatusResult.data[post.id] === true
          }))
        );
      }
      
      for (const post of posts) {
        fetchPostDetails(post.id);
      }
      
      showNotification('Đã cập nhật dữ liệu bài viết', 'info');
    } catch (error) {
      console.error("Error refreshing all posts:", error);
    }
  };

  const renderRefreshButton = () => (
    <button
      className="refresh-button"
      onClick={refreshAllPosts}
      title="Làm mới dữ liệu"
    >
      <FontAwesomeIcon icon={faRotate} className="refresh-icon" />
    </button>
  );

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const renderComments = (comments, postId) => {
    const parentComments = comments.filter(comment => !comment.parentCommentId);
    const replyComments = comments.filter(comment => comment.parentCommentId);
    
    const replyMap = {};
    replyComments.forEach(reply => {
      if (!replyMap[reply.parentCommentId]) {
        replyMap[reply.parentCommentId] = [];
      }
      replyMap[reply.parentCommentId].push(reply);
    });

    const isExpanded = expandedComments[postId];
    const initialComments = parentComments.slice(0, 3);
    const remainingComments = parentComments.slice(3);
    const displayedComments = isExpanded ? parentComments : initialComments;
    
    return (
      <div className="comments-container">
        {displayedComments.map((comment, index) => (
          <div key={`parent-${comment.id || index}`} className="comment-thread">
            <div className="comment-item">
              <div className="avatar">
                <img
                  src={comment.userId?.avatar || "https://via.placeholder.com/32"}
                  alt="User Avatar"
                />
              </div>
              <div className="comment-content">
                <div className="name">
                  {comment.userId?.fullName || "Người dùng"}
                </div>
                <div className="text">
                  {comment.content || "Không có nội dung"}
                </div>
                <div className="comment-time">
                  {comment.timeAgo || ""}
                </div>
              </div>
            </div>
            
            {replyMap[comment.id]?.map((reply, replyIndex) => (
              <div key={`reply-${reply.id || replyIndex}`} className="comment-item reply-comment">
                <div className="avatar">
                  <img
                    src={reply.userId?.avatar || recordItem?.logoCompany || "https://via.placeholder.com/32"}
                    alt="Reply Avatar"
                  />
                </div>
                <div className="comment-content">
                  <div className="name">
                    {reply.userId?.fullName || recordItem?.companyName || "Công ty"}
                    {!reply.userId && <span className="company-badge">Công ty</span>}
                  </div>
                  <div className="text">
                    {reply.content || "Không có nội dung"}
                  </div>
                  <div className="comment-time">
                    {reply.timeAgo || ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {parentComments.length > 3 && (
          <div className="view-more-comments" onClick={() => toggleComments(postId)}>
            {isExpanded ? (
              <div className="view-more-button">
                <span>Ẩn bớt</span>
                <FontAwesomeIcon icon={faChevronUp} />
              </div>
            ) : (
              <div className="view-more-button">
                <span>Xem thêm {parentComments.length - 3} bình luận</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="cb-section cb-section-padding-bottom bg-grey2">
      <div className="container">
        <div className="full-info-company">
          <div className="box-info-company mb-3">
            <div className="header-company">
              <div className="banner">
                <img src={recordItem?.bannerCompany} alt="" />
              </div>
              <div className="comapany-logo">
                <div className="company-image-logo">
                  <img src={recordItem?.logoCompany} alt="logo" />
                </div>
              </div>
              <div className="company-detail">
                <div className="box-detail">
                  <h1>CÔNG TY {recordItem?.companyName}</h1>
                  <div className="box-icon">
                    <div className="item">
                      <FontAwesomeIcon icon={faLink} />
                      <span>{recordItem?.website}</span>
                    </div>
                    <div className="item">
                      <FontAwesomeIcon icon={faUserGroup} />
                      <span>{recordItem?.numberOfWorkers} nhân viên</span>
                    </div>
                    <div className="item">
                      <FontAwesomeIcon icon={faPhone} />
                      <span>{recordItem?.phoneCompany}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="company-tabs">
                <div
                  className={`tab-item ${activeTab === 'intro' ? 'active' : ''}`}
                  onClick={() => setActiveTab('intro')}
                >
                  Giới thiệu công ty
                </div>
                <div
                  className={`tab-item ${activeTab === 'jobs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('jobs')}
                >
                  Tuyển dụng
                </div>
                <div
                  className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  Bài viết
                </div>
              </div>

              {activeTab === 'intro' && (
              <div className="description-box mb-3">
                <div className="title-header1">
                  <h2>Giới thiệu công ty</h2>
                </div>
                <div className="box-item-content">
                  <div
                    className={"dest " + (isExpanded ? "expanded " : "")}
                    dangerouslySetInnerHTML={{
                      __html: recordItem?.descriptionCompany,
                    }}
                  />
                  {!isExpanded && <div className="filter-blue"></div>}

                    <div className="view" onClick={toggleExpand}>
                    {isExpanded ? (
                      <div>
                        <span>Thu gọn</span>
                        <FontAwesomeIcon icon={faChevronUp} />
                      </div>
                    ) : (
                      <div>
                        <span>Xem thêm</span>
                        <FontAwesomeIcon icon={faChevronDown} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}

              {activeTab === 'jobs' && (
              <div className="job-box mb-4">
                <div className="title-header1">
                  <h2>Tuyển dụng</h2>
                </div>
                <div className="box-item-content">
                  <MemoizedJobByCompany slug={recordItem?.slug} />
                </div>
              </div>
              )}

              {activeTab === 'posts' && (
                <div className="posts-box mb-4">
                  <div className="title-header1">
                    <h2>Bài viết của công ty</h2>
                    {renderRefreshButton()}
                  </div>
                  <div className="box-item-content" style={{ maxHeight: '800px', overflowY: 'auto' }}>
                    {postsLoading ? (
                      <div className="text-center text-gray-600 p-4">Đang tải bài viết...</div>
                    ) : postsError ? (
                      <div className="text-center text-red-500 p-4">{postsError}</div>
                    ) : (
                      <div className="posts-container">
                        {posts.length > 0 ? (
                          posts.map((post) => (
                            <div
                              key={`post-${post.id}`}
                              className="post-item"
                            >
                              <div className="post-header">
                                <div className="avatar" style={{ cursor: 'pointer' }} onClick={() => window.location.reload()}>
                                  <img
                                    src={recordItem?.logoCompany || "https://via.placeholder.com/40"}
                                    alt="Company Logo"
                                  />
                                </div>
                                <div className="info">
                                  <div className="name" style={{ cursor: 'pointer' }} onClick={() => window.location.reload()}>
                                    {post.companyName || recordItem?.companyName || "Công ty ẩn danh"}
                                  </div>
                                  <div className="time">
                                    {post.timeAgo || "Không rõ thời gian"}
                                  </div>
                                </div>
                              </div>

                              <div className="post-content">
                                {post.caption && (
                                  <div className="text">{post.caption}</div>
                                )}
                              </div>

                              {post.images && post.images.length > 0 && renderPostImages(post.id, post.images)}

                              <div className="post-stats">
                                <span>{post.likes || 0} lượt thích</span>
                                <span>{post.comments?.length || 0} bình luận</span>
                              </div>

                              <div className="post-actions">
                                <button 
                                  className={`action-button ${post.isLiked ? 'liked' : ''}`}
                                  onClick={() => handleLike(post.id)}
                                  style={{ color: post.isLiked ? '#1877f2' : '' }}
                                >
                                  <FontAwesomeIcon 
                                    icon={faHeart} 
                                    className={post.isLiked ? 'liked-icon' : ''}
                                    style={{ color: post.isLiked ? '#1877f2' : '#65676b' }}
                                  />
                                  <span>{post.isLiked ? 'Đã thích' : 'Thích'}</span>
                                </button>
                                <button className="action-button">
                                  <FontAwesomeIcon icon={faComment} />
                                  <span>Bình luận</span>
                                </button>
                              </div>
                              
                              <div className="post-comments">
                                {post.comments?.length > 0 ? (
                                  <div className="comments-wrapper" style={{ 
                                    maxHeight: expandedComments[post.id] ? '400px' : 'auto',
                                    overflowY: expandedComments[post.id] ? 'auto' : 'visible'
                                  }}>
                                    {renderComments(post.comments, post.id)}
                                  </div>
                                ) : (
                                  <div className="no-comments">Chưa có bình luận nào</div>
                                )}
                                
                                <div className="comment-form">
                                  <div className="avatar">
                                    <img
                                      src={authUser?.avatar || "https://via.placeholder.com/32"}
                                      alt="Current User Avatar"
                                    />
                                  </div>
                                  <Input
                                    value={commentContent[post.id] || ""}
                                    onChange={(e) =>
                                      setCommentContent((prev) => ({
                                        ...prev,
                                        [post.id]: e.target.value,
                                      }))
                                    }
                                    onKeyPress={(e) => handleCommentKeyPress(e, post.id)}
                                    placeholder="Viết bình luận..."
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    suffix={
                                      <FontAwesomeIcon
                                        icon={faPaperPlane}
                                        onClick={() => handleComment(post.id)}
                                        className="send-button"
                                      />
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-600 p-4">Chưa có bài viết nào.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {employersWithJobCounts.length > 0 && (
                <div className="job-box-cutstom">
                  <div className="mb-3">
                    <h3>Công ty cùng lĩnh vực</h3>
                  </div>
                  <div className="record-with-job">
                    {employersWithJobCounts.length > 0 &&
                      employersWithJobCounts.map((item, index) => (
                        <div key={index} className="record mb-4">
                          <div className="flex">
                            <div className="logo-company">
                              <img src={item?.logoCompany} alt="" />
                            </div>
                            <div className="content">
                              <div>
                                <a href={item?.slug} className="name-company">
                                  CÔNG TY {item?.companyName}
                                </a>
                              </div>

                              <div className="count-job">
                                {item?.countJobs} việc làm
                              </div>
                            </div>
                          </div>
                          <div className="tag-tag">Cùng lĩnh vực</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-4">
              <div className="info-contact">
                <div className="box-contact mb-2">
                  <div className="title-header1">
                    <h2>Thông tin liên hệ</h2>
                  </div>
                  <div className="box-item-content">
                    <div className="box-address">
                      <div className="item-grid mb-2">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>Địa chỉ công ty</span>
                      </div>
                      <div className="content-grid">
                        {recordItem?.specificAddressCompany}
                      </div>
                    </div>
                    <hr />
                    <div className="box-map">
                      <div className="item-grid mb-2">
                        <FontAwesomeIcon icon={faMap} />
                        <span>Xem bản đồ</span>
                      </div>
                      <div className="content-grid">
                        <div
                          style={{ borderRadius: "10px", overflow: "hidden" }}
                        >
                          <MemoizedBoxGoogleMap
                          height={300}
                            latitude={location[0]}
                            longitude={location[1]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="info-contact">
                <div className="box-contact mb-2">
                  <div className="title-header1">
                    <h2>Chia sẻ công ty tới bạn bè</h2>
                  </div>
                  <div className="box-item-content">
                    <div className="share-box mb-3">
                      <div className="p-content mb-2">Sao chép đường dẫn</div>
                      <div className="input">
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: "#5dcaf9",
                            },
                            components: {
                              Input: {
                                paddingInlineLG: 16,
                                paddingBlockLG: 7,
                              },
                            },
                          }}
                        >
                          <Search
                            defaultValue={currentPath}
                            placeholder="Text..."
                            allowClear
                            enterButton={<FontAwesomeIcon icon={faCopy} />}
                            size="large"
                            onSearch={(value) => {
                              navigator.clipboard.writeText(value);
                            }}
                          />
                        </ConfigProvider>
                      </div>
                    </div>
                    <div className="box-icon">
                      <div className="p-content mb-2">
                        Chia sẻ qua mạng xã hội
                      </div>
                      <div className="icon-icon">
                        <div className="facebook">
                          <FontAwesomeIcon icon={faFacebook} />
                        </div>
                        <div className="twitter">
                          <FontAwesomeIcon icon={faTwitter} />
                        </div>
                        <div className="instagram">
                          <FontAwesomeIcon icon={faSquareInstagram} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          {notification.type === 'success' && <FontAwesomeIcon icon={faCheckCircle} className="icon" />}
          {notification.message}
        </div>
      )}
    </div>
  );
}
export default InfoCompany;