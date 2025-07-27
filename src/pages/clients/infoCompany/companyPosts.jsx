import {
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronDown,
  faChevronUp,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Image, Input } from "antd";
import { useGetPostsInfinite } from "../../../hooks/usePosts";
import { useCommentOnPost, useLikePost } from "../../../hooks/useComments";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useInView } from 'react-intersection-observer'

// Thêm hằng số cho avatar mặc định
const DEFAULT_AVATAR = "https://via.placeholder.com/32";

const CompanyPosts = ({ recordItem }) => {
  const { ref, inView } = useInView()
  const authUser = useSelector(
    (state) => state.authenticationReducerClient?.infoUser
  );
  
  // React Query mutations
  const commentMutation = useCommentOnPost();
  const likeMutation = useLikePost();

  const {
    data,
    status,
    isLoading: postsLoading,
    isFetching,
    postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetPostsInfinite(recordItem?._id);

  console.log("🚀 ~ CompanyPosts ~ data:", data);

  const posts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const [commentDisplayMode, setCommentDisplayMode] = useState({});
  const [commentContent, setCommentContent] = useState({});

  // Cập nhật hàm getUserNameFromComment để xử lý tất cả các trường hợp
  const getUserInfoFromComment = (comment) => {
    // Đối tượng kết quả trả về (tên và avatar)
    let result = {
      name: "Người dùng",
      avatar: DEFAULT_AVATAR,
    };

    try {
      // Kiểm tra xem comment có hợp lệ không
      if (!comment || typeof comment !== "object") {
        console.warn("Invalid comment object:", comment);
        return result;
      }

      // Kiểm tra userId trong comment - Bước 1 (Ưu tiên cao nhất)
      if (comment.userId) {
        if (typeof comment.userId === "object" && comment.userId !== null) {
          // Case 1: userId là object
          if (comment.userId.fullName) {
            result.name = comment.userId.fullName;
          } else if (comment.userId.name) {
            result.name = comment.userId.name;
          }

          if (comment.userId.avatar) {
            result.avatar = comment.userId.avatar;
          } else if (comment.userId.avatarUrl) {
            result.avatar = comment.userId.avatarUrl;
          }
        } else if (typeof comment.userId === "string") {
          // Case 2: userId là string, thường là ID của user
          // Trong trường hợp này, cần kiểm tra các trường khác
          if (comment.userName) {
            result.name = comment.userName;
          }
          if (comment.userAvatar) {
            result.avatar = comment.userAvatar;
          }
        }
      }

      // Kiểm tra các trường thường gặp cho tên - Bước 2
      if (comment.userName) {
        result.name = comment.userName;
      } else if (comment.user && comment.user.name) {
        result.name = comment.user.name;
      } else if (comment.user && comment.user.fullName) {
        result.name = comment.user.fullName;
      } else if (comment.name) {
        result.name = comment.name;
      } else if (comment.fullName) {
        result.name = comment.fullName;
      }

      // Kiểm tra các trường thường gặp cho avatar - Bước 3
      if (comment.userAvatar) {
        result.avatar = comment.userAvatar;
      } else if (comment.user && comment.user.avatar) {
        result.avatar = comment.user.avatar;
      } else if (comment.user && comment.user.avatarUrl) {
        result.avatar = comment.user.avatarUrl;
      } else if (comment.avatar) {
        result.avatar = comment.avatar;
      } else if (comment.avatarUrl) {
        result.avatar = comment.avatarUrl;
      }

      // Kiểm tra và tìm kiếm trong tất cả các thuộc tính của comment - Bước 4
      for (const key in comment) {
        if (typeof comment[key] === "object" && comment[key] !== null) {
          // Tìm tên từ đối tượng lồng nhau
          if (comment[key].fullName && result.name === "Người dùng") {
            result.name = comment[key].fullName;
          } else if (comment[key].name && result.name === "Người dùng") {
            result.name = comment[key].name;
          }

          // Tìm avatar từ đối tượng lồng nhau
          if (comment[key].avatar && result.avatar === DEFAULT_AVATAR) {
            result.avatar = comment[key].avatar;
          } else if (
            comment[key].avatarUrl &&
            result.avatar === DEFAULT_AVATAR
          ) {
            result.avatar = comment[key].avatarUrl;
          }
        }
      }

      // Xử lý trường hợp đặc biệt - nếu reply từ công ty
      const isCompanyReply =
        comment.isCompanyReply === true ||
        (!comment.userId && recordItem?.companyName) ||
        comment.fromCompany === true;

      if (isCompanyReply) {
        result.name = recordItem?.companyName || "Công ty";
        result.avatar = recordItem?.logoCompany || result.avatar;
        result.isCompany = true;
      }
    } catch (error) {
      console.error("Error extracting user info from comment:", error);
    }

    return result;
  };

  const toggleComments = (postId, mode) => {
    // Nếu mode là 'hide', đặt về trạng thái mặc định (ban đầu)
    if (mode === "hide") {
      setCommentDisplayMode((prev) => ({
        ...prev,
        [postId]: "default",
      }));
      return;
    }

    // Nếu mode là 'all', đặt trạng thái hiển thị tất cả với scroll
    if (mode === "all") {
      setCommentDisplayMode((prev) => ({
        ...prev,
        [postId]: "all",
      }));
      return;
    }

    // Chế độ xem thêm - hiển thị tối đa 5 bình luận
    setCommentDisplayMode((prev) => ({
      ...prev,
      [postId]: "more",
    }));
  };

  const handleComment = async (postId) => {
    const content = commentContent[postId];
    if (!content || content.trim() === "") {
      return;
    }

    try {
      await commentMutation.mutateAsync({ postId, content });
      // Clear comment input after successful submission
      setCommentContent(prev => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Failed to comment:", error);
    }
  };

  // Thêm hàm mới để xử lý việc gửi bình luận khi nhấn Enter
  const handleCommentKeyPress = (e, postId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment(postId);
    }
  };



  const refreshAllPosts = () => {
    refetch();
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

  const renderPostImages = (postId, images) => {
    if (!images || images.length === 0) return null;
    const validImages = images.filter((img) => img && img.trim() !== "");
    const total = validImages.length;

    // 2 ảnh: chia đôi ngang, mỗi ô vuông
    if (total === 2) {
      return (
        <div className="post-images" style={{ marginTop: "4px" }}>
          <Image.PreviewGroup items={validImages}>
            <div style={{ display: "flex", gap: 4 }}>
              {validImages.map((img, idx) => (
                <div
                  key={idx}
                  style={{ flex: 1, aspectRatio: "1/1", overflow: "hidden" }}
                >
                  <Image
                    src={img}
                    alt={`Post ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    preview={{ src: img }}
                  />
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
        <div className="post-images" style={{ marginTop: "4px" }}>
          <Image.PreviewGroup items={validImages}>
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ flex: 1, aspectRatio: "1/1", overflow: "hidden" }}>
                <Image
                  src={validImages[0]}
                  alt="Post 1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  preview={{ src: validImages[0] }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{ flex: 1, aspectRatio: "1/1", overflow: "hidden" }}
                >
                  <Image
                    src={validImages[1]}
                    alt="Post 2"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    preview={{ src: validImages[1] }}
                  />
                </div>
                <div
                  style={{ flex: 1, aspectRatio: "1/1", overflow: "hidden" }}
                >
                  <Image
                    src={validImages[2]}
                    alt="Post 3"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    preview={{ src: validImages[2] }}
                  />
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
        <div className="post-images" style={{ marginTop: "4px" }}>
          <Image.PreviewGroup items={validImages}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: 4,
              }}
            >
              {validImages.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    aspectRatio: "1/1",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={img}
                    alt={`Post ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    preview={{ src: img }}
                  />
                </div>
              ))}
              <div
                style={{
                  aspectRatio: "1/1",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={validImages[3]}
                  alt="Post 4"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: total > 4 ? "brightness(0.4) blur(2px)" : undefined,
                  }}
                  preview={{ src: validImages[3] }}
                />
                {total > 4 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 32,
                      fontWeight: "bold",
                      background: "rgba(0,0,0,0.4)",
                      pointerEvents: "none",
                    }}
                  >
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
        <div className="post-images single-image" style={{ marginTop: "4px" }}>
          <Image.PreviewGroup items={validImages}>
            <div
              className="image-wrapper"
              style={{ aspectRatio: "1/1", width: "100%", overflow: "hidden" }}
            >
              <Image
                src={validImages[0]}
                alt="Post image"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                preview={{ src: validImages[0] }}
              />
            </div>
          </Image.PreviewGroup>
        </div>
      );
    }

    return null;
  };

  // Hàm xử lý hiển thị bình luận, cập nhật theo mẫu
  const renderComments = (comments, postId) => {
    // Tách bình luận gốc và bình luận trả lời
    const parentComments = comments.filter(
      (comment) => !comment.parentCommentId
    );
    const replyComments = comments.filter((comment) => comment.parentCommentId);

    // Tạo map lưu trữ các bình luận trả lời theo parentCommentId
    const replyMap = {};
    replyComments.forEach((reply) => {
      if (!replyMap[reply.parentCommentId]) {
        replyMap[reply.parentCommentId] = [];
      }
      replyMap[reply.parentCommentId].push(reply);
    });

    // Lấy chế độ hiển thị hiện tại, mặc định là 'default'
    const displayMode = commentDisplayMode[postId] || "default";

    // Xác định số lượng bình luận gốc hiển thị dựa trên chế độ
    let commentsToShow;
    const totalComments = [...parentComments];

    if (displayMode === "default") {
      commentsToShow = totalComments.slice(0, 3); // Hiển thị 3 bình luận gốc
    } else if (displayMode === "more") {
      commentsToShow = totalComments.slice(0, 5); // Hiển thị 5 bình luận gốc
    } else {
      commentsToShow = totalComments; // Hiển thị tất cả bình luận gốc
    }

    // Kiểm tra xem còn bình luận nào không được hiển thị
    const hasMoreComments = totalComments.length > commentsToShow.length;

    // Xác định chiều cao tối đa của container bình luận và các thuộc tính khác
    const containerStyle = {
      maxHeight: displayMode === "default" ? "160px" : "450px",
      overflowY: displayMode === "default" ? "hidden" : "auto",
      transition: "max-height 0.3s ease, opacity 0.2s ease",
      opacity: 1,
      padding: displayMode !== "default" ? "0 5px 0 0" : "0", // Thêm padding bên phải khi có scrollbar
    };

    // Thêm style cho comments-container để đảm bảo không bị overflow
    const commentsContainerStyle = {
      position: "relative",
      overflow: "hidden",
      marginBottom: "10px",
      border: displayMode !== "default" ? "1px solid #f0f2f5" : "none",
      borderRadius: displayMode !== "default" ? "8px" : "0",
    };

    return (
      <div className="comments-container" style={commentsContainerStyle}>
        <div style={containerStyle}>
          {commentsToShow.map((comment, index) => {
            try {
              // Lấy thông tin người dùng từ bình luận
              const userInfo = getUserInfoFromComment(comment);

              return (
                <div
                  key={`parent-${comment.id || index}`}
                  className="comment-thread"
                  style={{
                    marginBottom: "12px",
                    padding:
                      displayMode === "default" ? "0 0 8px 0" : "0 0 10px 0",
                    borderBottom:
                      index < commentsToShow.length - 1
                        ? "1px solid #f0f2f5"
                        : "none",
                  }}
                >
                  <div className="comment-item">
                    <div className="avatar" style={{ marginRight: "12px" }}>
                      <img src={userInfo.avatar} alt="User Avatar" />
                    </div>
                    <div className="comment-content">
                      <div
                        className="name"
                        style={{
                          fontWeight: "bold",
                          color: "#050505",
                          marginTop: "-3px",
                        }}
                      >
                        {userInfo.name}
                        {userInfo.isCompany && (
                          <span
                            className="company-badge"
                            style={{
                              marginLeft: "5px",
                              fontSize: "0.7rem",
                              padding: "1px 4px",
                              backgroundColor: "#eaf3ff",
                              color: "#1877f2",
                              borderRadius: "3px",
                              display: "inline-block",
                              fontWeight: "normal",
                            }}
                          >
                            Công ty
                          </span>
                        )}
                      </div>
                      <div className="text">
                        {comment.content || "Không có nội dung"}
                      </div>
                                                <div className="comment-time">
                            {comment.timeAgo || ""}
                          </div>
                        </div>
                      </div>

                      {/* Hiển thị các bình luận trả lời */}
                  {replyMap[comment.id]?.map((reply, replyIndex) => {
                    // Lấy thông tin người dùng trả lời từ hàm cải tiến
                    const replyUserInfo = getUserInfoFromComment(reply);

                    return (
                      <div
                        key={`reply-${reply.id || replyIndex}`}
                        className="comment-item reply-comment"
                      >
                        <div className="avatar" style={{ marginRight: "12px" }}>
                          <img src={replyUserInfo.avatar} alt="Reply Avatar" />
                        </div>
                        <div className="comment-content">
                          <div
                            className="name"
                            style={{
                              fontWeight: "bold",
                              color: "#050505",
                              marginTop: "-3px",
                            }}
                          >
                            {replyUserInfo.name}
                            {replyUserInfo.isCompany && (
                              <span
                                className="company-badge"
                                style={{
                                  marginLeft: "5px",
                                  fontSize: "0.7rem",
                                  padding: "1px 4px",
                                  backgroundColor: "#eaf3ff",
                                  color: "#1877f2",
                                  borderRadius: "3px",
                                  display: "inline-block",
                                  fontWeight: "normal",
                                }}
                              >
                                Công ty
                              </span>
                            )}
                          </div>
                          <div className="text">
                            {reply.content || "Không có nội dung"}
                          </div>
                          <div className="comment-time">
                            {reply.timeAgo || ""}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            } catch (error) {
              console.error("Error rendering comment:", error, comment);
              return null; // Nếu có lỗi, bỏ qua hiển thị comment này
            }
          })}
        </div>

        {parentComments.length > 0 && (
          <div
            className="view-more-comments"
            style={{
              textAlign: "center",
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            {displayMode === "default" && parentComments.length > 3 && (
              <div
                className="view-more-button"
                onClick={() => toggleComments(postId, "more")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                  color: "#1877f2",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  padding: "6px 12px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  backgroundColor: "rgba(24, 119, 242, 0.05)",
                }}
              >
                <span>Xem thêm bình luận</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            )}

            {displayMode === "more" && hasMoreComments && (
              <div
                className="view-more-button"
                onClick={() => toggleComments(postId, "all")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                  color: "#1877f2",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  padding: "6px 12px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  backgroundColor: "rgba(24, 119, 242, 0.05)",
                }}
              >
                <span>Xem tất cả {totalComments.length} bình luận</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            )}

            {displayMode !== "default" && (
              <div
                className="view-more-button"
                onClick={() => toggleComments(postId, "hide")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                  color: "#1877f2",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  padding: "6px 12px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  backgroundColor: "rgba(24, 119, 242, 0.05)",
                }}
              >
                <span>Thu gọn</span>
                <FontAwesomeIcon icon={faChevronUp} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleLike = async (postId) => {
    try {
      await likeMutation.mutateAsync({ postId });
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <>
      <div className="posts-box mb-4">
        <div className="title-header1">
          <h2>Bài viết của công ty</h2>
          {renderRefreshButton()}
        </div>
        <div
          className="box-item-content"
          style={{ maxHeight: "800px", overflowY: "auto" }}
        >
          {postsLoading ? (
            <div className="text-center text-gray-600 p-4">
              Đang tải bài viết...
            </div>
          ) : postsError ? (
            <div className="text-center text-red-500 p-4">{postsError}</div>
          ) : (
            <div className="posts-container">
              {posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <div key={`post-${post.id}`} className="post-item">
                      <div
                        className="post-header"
                        style={{ marginBottom: "10px" }}
                      >
                        <div
                          className="avatar"
                          style={{ cursor: "pointer", marginRight: "12px" }}
                          onClick={() => window.location.reload()}
                        >
                          <img
                            src={
                              recordItem?.logoCompany ||
                              "https://via.placeholder.com/40"
                            }
                            alt="Company Logo"
                          />
                        </div>
                        <div className="info">
                          <div
                            className="name"
                            style={{
                              cursor: "pointer",
                              fontWeight: "bold",
                              color: "#050505",
                              marginTop: "-3px",
                            }}
                            onClick={() => window.location.reload()}
                          >
                            {post.companyName ||
                              recordItem?.companyName ||
                              "Công ty ẩn danh"}
                          </div>
                          <div className="time">
                            {post.timeAgo || "Không rõ thời gian"}
                          </div>
                        </div>
                      </div>

                      <div
                        className="post-content"
                        style={{ marginBottom: "3px" }}
                      >
                        {post.caption && (
                          <div className="text" style={{ marginBottom: "0px" }}>
                            {post.caption}
                          </div>
                        )}
                      </div>

                      {post.images &&
                        post.images.length > 0 &&
                        renderPostImages(post.id, post.images)}

                      <div className="post-stats" style={{ marginTop: "12px" }}>
                        <span>{post.likes || 0} lượt thích</span>
                        <span>{post.comments?.length || 0} bình luận</span>
                      </div>

                      <div className="post-actions">
                        <button
                          className={`action-button ${
                            post.isLiked ? "liked" : ""
                          }`}
                          onClick={() => handleLike(post.id)}
                          style={{ 
                            color: post.isLiked ? "#1877f2" : "",
                            opacity: likeMutation.isPending ? 0.7 : 1
                          }}
                          disabled={likeMutation.isPending}
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={post.isLiked ? "liked-icon" : ""}
                            style={{
                              color: post.isLiked ? "#1877f2" : "#65676b",
                            }}
                          />
                          <span>{post.isLiked ? "Đã thích" : "Thích"}</span>
                        </button>
                        <button className="action-button">
                          <FontAwesomeIcon icon={faComment} />
                          <span>Bình luận</span>
                        </button>
                      </div>

                      <div className="post-comments">
                        {post.comments?.length > 0 ? (
                          <div className="comments-wrapper">
                            {renderComments(post.comments, post.id)}
                          </div>
                        ) : (
                          <div className="no-comments">
                            Chưa có bình luận nào
                          </div>
                        )}

                        <div className="comment-form">
                          <div
                            className="avatar"
                            style={{ marginRight: "12px" }}
                          >
                            <img
                              src={
                                authUser?.avatar ||
                                "https://via.placeholder.com/32"
                              }
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
                            onKeyPress={(e) =>
                              handleCommentKeyPress(e, post.id)
                            }
                            placeholder="Viết bình luận..."
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            loading={commentMutation.isPending}
                            suffix={
                              <FontAwesomeIcon
                                icon={faPaperPlane}
                                onClick={() => handleComment(post.id)}
                                className="send-button"
                                style={{ 
                                  cursor: "pointer", 
                                  color: "#1877f2",
                                  opacity: commentMutation.isPending ? 0.5 : 1 
                                }}
                              />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{display: 'flex'}}>
                    <Button
                      ref={ref}
                      onClick={() => fetchNextPage()}
                      disabled={!hasNextPage || isFetchingNextPage}
                      type="link"
                      style={{margin: "0 auto"}}
                    >
                      {isFetchingNextPage
                        ? "Đang tải...."
                        : hasNextPage
                        ? "Xem thêm"
                        : "Đã xem tất cả bài viết"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-600 p-4">
                  Chưa có bài viết nào.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default CompanyPosts;
