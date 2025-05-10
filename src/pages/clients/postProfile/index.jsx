import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployerPosts, likePost, commentOnPost } from "../../../services/clients/postApi";
import { getCompany } from "../../../services/clients/employersApi";
import { getCookie } from "../../../helpers/cookie";
import { decData } from "../../../helpers/decData";
import "./postProfile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faPaperPlane, faChevronLeft, faChevronRight, faSearch, faSearchMinus, faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { ConfigProvider, Input, Modal, Button, Image } from "antd";

function PostProfile() {
  const { employerId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [commentContent, setCommentContent] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({});
  
  // State cho chức năng xem ảnh
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  
  // State cho chức năng zoom và pan
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const maxZoomLevel = 3;
  const minZoomLevel = 0.5;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      const token = getCookie("token-user") || "";
      console.log("PostProfile - Token:", token);
      console.log("PostProfile - employerId:", employerId);

      if (!token) {
        setError("Vui lòng đăng nhập để xem bài viết.");
        setLoading(false);
        navigate("/login");
        return;
      }

      if (!employerId || employerId === "undefined") {
        setError("ID công ty không hợp lệ. Vui lòng thử lại.");
        setLoading(false);
        navigate("/");
        return;
      }

      try {
        // Lấy thông tin công ty
        const companyRes = await getCompany(employerId);
        console.log("PostProfile - CompanyRes:", companyRes);
        
        if (companyRes && companyRes.code === 200) {
          try {
            // Kiểm tra data có tồn tại và là chuỗi không rỗng
            if (companyRes.data && typeof companyRes.data === 'string' && companyRes.data.trim() !== '') {
              const companyData = decData(companyRes.data);
              console.log("PostProfile - CompanyData sau giải mã:", companyData);
              setCompanyInfo(companyData || {});
            } else {
              console.warn("PostProfile - Dữ liệu công ty không hợp lệ:", companyRes.data);
              setCompanyInfo({});
            }
          } catch (decError) {
            console.error("PostProfile - Lỗi giải mã dữ liệu công ty:", decError);
            setCompanyInfo({});
          }
        }
        
        // Lấy bài viết
        const result = await getEmployerPosts(employerId, token);
        console.log("PostProfile - API Response:", result);

        if (result && Array.isArray(result)) {
          setPosts(result);
          setError(null);
        } else if (result?.error) {
          console.log("PostProfile - API Error:", result.error);
          setError(result.error || "Không tìm thấy bài viết.");
          if (result.error === "Bạn Không Có Quyền Truy Cập!") {
            setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            navigate("/login");
          }
        } else {
          setError("Dữ liệu từ server không hợp lệ.");
        }
      } catch (err) {
        console.error("PostProfile - Error:", err);
        setError("Lỗi khi tải bài viết: " + (err.message || "Không rõ nguyên nhân."));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [employerId, navigate]);

  const handleLike = async (postId) => {
    try {
      const result = await likePost(postId);
      console.log("PostProfile - Like Response:", result);
      if (result?.code === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: result.data.isLiked ? post.likes + 1 : post.likes - 1,
                  isLiked: result.data.isLiked,
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error("PostProfile - Error liking post:", err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentContent[postId]?.trim()) return;
    try {
      const result = await commentOnPost(postId, commentContent[postId]);
      console.log("PostProfile - Comment Response:", result);
      if (result?.code === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...(post.comments || []), result.data] }
              : post
          )
        );
        setCommentContent((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error("PostProfile - Error commenting on post:", err);
    }
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

    // Sử dụng Ant Design Image component
    return (
      <div className="post-images">
        {imageUrls.length === 1 ? (
          // Một ảnh
          <div className="post-profile-single-image" style={{ width: '100%', overflow: 'hidden' }}>
            <Image
              src={imageUrls[0]}
              alt="Post 1"
              preview={{
                onVisibleChange: (visible) => {
                  if (visible) {
                    setPreviewImages(imageUrls);
                    setPreviewIndex(0);
                    setPreviewImage(imageUrls[0]);
                    setPreviewTitle(`Ảnh 1/${imageUrls.length}`);
                    setZoomLevel(1);
                    setPanPosition({ x: 0, y: 0 });
                  }
                }
              }}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : imageUrls.length === 2 ? (
          // Hai ảnh
          <div className="post-profile-grid" style={{ display: 'flex', gap: '4px' }}>
            {imageUrls.map((image, index) => (
              <div 
                key={`image-${index}`} 
                style={{ flex: '1 1 0%', aspectRatio: '1 / 1', overflow: 'hidden' }}
              >
                <Image
                  src={image}
                  alt={`Post ${index + 1}`}
                  preview={{
                    onVisibleChange: (visible) => {
                      if (visible) {
                        setPreviewImages(imageUrls);
                        setPreviewIndex(index);
                        setPreviewImage(image);
                        setPreviewTitle(`Ảnh ${index + 1}/${imageUrls.length}`);
                        setZoomLevel(1);
                        setPanPosition({ x: 0, y: 0 });
                      }
                    }
                  }}
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        ) : imageUrls.length === 3 ? (
          // Ba ảnh
          <div className="post-profile-grid" style={{ display: 'flex', gap: '4px' }}>
            <div 
              style={{ flex: '1 1 0%', aspectRatio: '1 / 1', overflow: 'hidden' }}
            >
              <Image
                src={imageUrls[0]}
                alt="Post 1"
                preview={{
                  onVisibleChange: (visible) => {
                    if (visible) {
                      setPreviewImages(imageUrls);
                      setPreviewIndex(0);
                      setPreviewImage(imageUrls[0]);
                      setPreviewTitle(`Ảnh 1/${imageUrls.length}`);
                      setZoomLevel(1);
                      setPanPosition({ x: 0, y: 0 });
                    }
                  }
                }}
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ flex: '1 1 0%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                <Image
                  src={imageUrls[1]}
                  alt="Post 2"
                  preview={{
                    onVisibleChange: (visible) => {
                      if (visible) {
                        setPreviewImages(imageUrls);
                        setPreviewIndex(1);
                        setPreviewImage(imageUrls[1]);
                        setPreviewTitle(`Ảnh 2/${imageUrls.length}`);
                        setZoomLevel(1);
                        setPanPosition({ x: 0, y: 0 });
                      }
                    }
                  }}
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: '1 1 0%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                <Image
                  src={imageUrls[2]}
                  alt="Post 3"
                  preview={{
                    onVisibleChange: (visible) => {
                      if (visible) {
                        setPreviewImages(imageUrls);
                        setPreviewIndex(2);
                        setPreviewImage(imageUrls[2]);
                        setPreviewTitle(`Ảnh 3/${imageUrls.length}`);
                        setZoomLevel(1);
                        setPanPosition({ x: 0, y: 0 });
                      }
                    }
                  }}
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        ) : (
          // Bốn ảnh trở lên
          <div className="post-profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            {imageUrls.slice(0, 4).map((image, index) => {
              const isLastWithMore = index === 3 && remaining > 0;
              
              return (
                <div
                  key={`image-${index}`}
                  style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}
                >
                  <Image
                    src={image}
                    alt={`Post ${index + 1}`}
                    preview={!isLastWithMore ? {
                      onVisibleChange: (visible) => {
                        if (visible) {
                          setPreviewImages(imageUrls);
                          setPreviewIndex(index);
                          setPreviewImage(image);
                          setPreviewTitle(`Ảnh ${index + 1}/${imageUrls.length}`);
                          setZoomLevel(1);
                          setPanPosition({ x: 0, y: 0 });
                        }
                      }
                    } : false}
                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  />
                  {isLastWithMore && (
                    <div
                      className="absolute inset-0"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setPreviewImages(imageUrls);
                        setPreviewIndex(0);
                        setPreviewImage(imageUrls[0]);
                        setPreviewTitle(`Ảnh 1/${imageUrls.length}`);
                        setPreviewVisible(true);
                        setZoomLevel(1);
                        setPanPosition({ x: 0, y: 0 });
                      }}
                    >
                      +{remaining}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Hàm mở modal xem trước ảnh
  const openImagePreview = (images, index) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setPreviewImage(images[index]);
    setPreviewTitle(`Ảnh ${index + 1}/${images.length}`);
    setZoomLevel(1); // Reset zoom về mức mặc định
    setPanPosition({ x: 0, y: 0 }); // Reset vị trí pan
    setPreviewVisible(true);
  };

  // Hàm chuyển đến ảnh trước đó
  const handlePrevImage = () => {
    const newIndex = (previewIndex - 1 + previewImages.length) % previewImages.length;
    setPreviewIndex(newIndex);
    setPreviewImage(previewImages[newIndex]);
    setPreviewTitle(`Ảnh ${newIndex + 1}/${previewImages.length}`);
    setZoomLevel(1); // Reset zoom khi chuyển ảnh
    setPanPosition({ x: 0, y: 0 }); // Reset vị trí pan
  };

  // Hàm chuyển đến ảnh tiếp theo
  const handleNextImage = () => {
    const newIndex = (previewIndex + 1) % previewImages.length;
    setPreviewIndex(newIndex);
    setPreviewImage(previewImages[newIndex]);
    setPreviewTitle(`Ảnh ${newIndex + 1}/${previewImages.length}`);
    setZoomLevel(1); // Reset zoom khi chuyển ảnh
    setPanPosition({ x: 0, y: 0 }); // Reset vị trí pan
  };
  
  // Các hàm xử lý phóng to/thu nhỏ
  const handleZoomIn = () => {
    if (zoomLevel < maxZoomLevel) {
      setZoomLevel(prev => Math.min(prev + 0.25, maxZoomLevel));
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > minZoomLevel) {
      const newZoomLevel = Math.max(zoomLevel - 0.25, minZoomLevel);
      setZoomLevel(newZoomLevel);
      
      // Nếu thu nhỏ về 1x, reset vị trí pan
      if (newZoomLevel <= 1) {
        setPanPosition({ x: 0, y: 0 });
      }
    }
  };
  
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };
  
  // Hàm xử lý phóng to/thu nhỏ bằng bánh xe chuột
  const handleWheel = (e) => {
    if (previewVisible) {
      e.preventDefault();
      
      // Xác định hướng cuộn (lên là phóng to, xuống là thu nhỏ)
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      const newZoomLevel = Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel + delta));
      
      if (newZoomLevel !== zoomLevel) {
        // Nếu thu nhỏ về mức 1 hoặc nhỏ hơn, reset vị trí
        if (newZoomLevel <= 1) {
          setPanPosition({ x: 0, y: 0 });
        }
        
        setZoomLevel(newZoomLevel);
      }
    }
  };
  
  // Các hàm xử lý di chuyển ảnh (pan)
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      // Tính toán vị trí mới
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Giới hạn khoảng di chuyển dựa vào tỷ lệ zoom
      const maxPanX = (zoomLevel - 1) * 150;
      const maxPanY = (zoomLevel - 1) * 150;
      
      // Áp dụng giới hạn và cập nhật vị trí
      setPanPosition({
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY))
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Bài viết từ công ty</h2>
        {loading ? (
          <div className="text-center text-gray-600">Đang tải bài viết...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={`post-${post.id}`}
                  className="post-container mb-5"
                  style={{ 
                    borderWidth: '1px', 
                    borderStyle: 'solid', 
                    borderColor: '#e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Banner công ty */}
                  {companyInfo.bannerCompany && (
                    <div className="mb-3">
                      <img
                        src={companyInfo.bannerCompany}
                        alt="Banner Công ty"
                        className="w-full h-36 object-cover rounded-t-lg"
                        style={{objectPosition: 'center'}}
                      />
                    </div>
                  )}
                  <div className="post-header mb-4">
                    <img
                      src={companyInfo.logoCompany || "https://via.placeholder.com/40"}
                      alt="Company Avatar"
                      className="avatar"
                    />
                    <div className="post-info">
                      <div className="company-name">
                        {post.companyName || companyInfo.companyName || "Công ty ẩn danh"}
                      </div>
                      <div className="post-time">
                        {post.timeAgo || "Không rõ thời gian"}
                      </div>
                    </div>
                  </div>
                  <div className="post-content mb-4">
                    <p className="post-caption">{post.caption || "Không có nội dung"}</p>
                    {post.images && post.images.length > 0 && (
                      <div className="post-image-container" style={{padding: 0, marginTop: '12px', marginBottom: '12px'}}>
                        {renderImages(post.images)}
                      </div>
                    )}
                  </div>
                  <div className="post-stats mb-3">
                    <span>{post.likes || 0} lượt thích</span>
                    <span>{post.comments?.length || 0} bình luận</span>
                  </div>
                  <div className="post-actions">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`action-button ${post.isLiked ? "post-liked" : ""}`}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>Thích</span>
                    </button>
                    <button
                      className="action-button"
                    >
                      <FontAwesomeIcon icon={faComment} />
                      <span>Bình luận</span>
                    </button>
                  </div>
                  <div className="post-comments">
                    {post.comments?.map((comment, index) => (
                      <div key={index} className="comment mb-3">
                        <img
                          src={comment.userAvatar || "https://via.placeholder.com/32"}
                          alt="User Avatar"
                          className="commenter-avatar"
                        />
                        <div className="comment-content">
                          <div className="commenter-name">
                            {comment.userName || "Ẩn danh"}
                          </div>
                          <div className="comment-text">
                            {comment.content || "Không có nội dung"}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="comment-input-container">
                      <img
                        src="https://via.placeholder.com/32"
                        alt="Current User Avatar"
                        className="commenter-avatar"
                      />
                      <ConfigProvider
                        theme={{
                          token: { colorPrimary: "#5dcaf9" },
                          components: { Input: { paddingInlineLG: 12, paddingBlockLG: 6 } },
                        }}
                      >
                        <Input
                          value={commentContent[post.id] || ""}
                          onChange={(e) =>
                            setCommentContent((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Viết bình luận..."
                          className="flex-1 rounded-full"
                          suffix={
                            <FontAwesomeIcon
                              icon={faPaperPlane}
                              onClick={() => handleComment(post.id)}
                              className="send-icon"
                            />
                          }
                        />
                      </ConfigProvider>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">Chưa có bài viết nào.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostProfile;