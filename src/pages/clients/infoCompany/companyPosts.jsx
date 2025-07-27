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
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import {
  checkEmployerPostsLikeStatus,
  checkLikedStatus,
  commentOnPost,
  getPostComments,
  likePost,
} from "../../../services/clients/postApi";
import { getCookie } from "../../../helpers/cookie";

// Thêm hằng số cho avatar mặc định
const DEFAULT_AVATAR = "https://via.placeholder.com/32";

const CompanyPosts = ({ recordItem, showNotification }) => {
  const { ref, inView } = useInView();
  const authUser = useSelector(
    (state) => state.authenticationReducerClient?.infoUser
  );

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
  const [commentRefreshCount, setCommentRefreshCount] = useState(0);

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

  const fetchPostDetails = async (postId) => {
    if (!postId) return;

    try {
      console.log("Fetching details for post:", postId);

      try {
        const likeStatusResult = await checkLikedStatus([postId]);
        if (likeStatusResult?.code === 200 && likeStatusResult.data) {
          const isLiked = likeStatusResult.data[postId] === true;
          console.log(`Post ${postId} like status:`, isLiked);

          // setPosts(prevPosts =>
          //   prevPosts.map(post =>
          //     post.id === postId
          //       ? { ...post, isLiked: isLiked }
          //       : post
          //   )
          // );
        }
      } catch (likeError) {
        console.error(
          `Error checking like status for post ${postId}:`,
          likeError
        );
      }

      try {
        const commentsResult = await getPostComments(postId);
        if (commentsResult?.code === 200 && commentsResult.data) {
          console.log(
            `Refreshed comments for post ${postId}:`,
            commentsResult.data
          );

          // Thêm log chi tiết để xem cấu trúc chính xác của dữ liệu bình luận
          if (commentsResult.data.length > 0) {
            console.log(
              "Detail comment structure:",
              JSON.stringify(commentsResult.data[0])
            );
            console.log("Comment keys:", Object.keys(commentsResult.data[0]));

            // Kiểm tra cụ thể giá trị của userId
            const userIdVal = commentsResult.data[0].userId;
            console.log("userId value:", userIdVal);
            console.log("userId type:", typeof userIdVal);

            if (typeof userIdVal === "object" && userIdVal !== null) {
              console.log("userId keys:", Object.keys(userIdVal));
            }
          }

          // setPosts(prevPosts =>
          //   prevPosts.map(post =>
          //     post.id === postId
          //       ? { ...post, comments: commentsResult.data }
          //       : post
          //   )
          // );
        }
      } catch (commentsError) {
        console.error(
          `Error fetching comments for post ${postId}:`,
          commentsError
        );
      }
    } catch (err) {
      console.error(`Error fetching details for post ${postId}:`, err);
    }
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

  const reloadComments = async (postId) => {
    try {
      // Hiển thị thông báo đang tải
      showNotification("Đang tải lại bình luận...", "info");

      // Đặt trạng thái loading
      // setPosts(prevPosts =>
      //   prevPosts.map(post =>
      //     post.id === postId
      //       ? { ...post, commentsLoading: true }
      //       : post
      //   )
      // );

      console.log("1. Bắt đầu tải lại bình luận cho bài viết:", postId);

      // Gọi API lấy bình luận
      const token = getCookie("token-user") || "";
      console.log("2. Token:", token ? "Có token" : "Không có token");

      try {
        console.log("3. Thử phương pháp 1: Gọi API trực tiếp");
        const response = await fetch(`/api/v1/posts/${postId}/comments`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("4. Kết quả API:", response.status, response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log("5. Dữ liệu API:", data);

          let commentsData = [];

          if (Array.isArray(data)) {
            commentsData = data;
            console.log(
              "6a. Dữ liệu là mảng, có",
              commentsData.length,
              "bình luận"
            );
          } else if (data?.data && Array.isArray(data.data)) {
            commentsData = data.data;
            console.log(
              "6b. Dữ liệu trong data.data, có",
              commentsData.length,
              "bình luận"
            );
          } else if (data?.comments && Array.isArray(data.comments)) {
            commentsData = data.comments;
            console.log(
              "6c. Dữ liệu trong data.comments, có",
              commentsData.length,
              "bình luận"
            );
          } else {
            console.log(
              "6d. Không tìm thấy mảng bình luận trong dữ liệu:",
              data
            );
            commentsData = [];
          }

          // Cập nhật state với dữ liệu mới và buộc re-render
          const newPosts = [...posts];
          const postIndex = newPosts.findIndex((p) => p.id === postId);

          if (postIndex >= 0) {
            console.log(
              "7. Tìm thấy bài viết cần cập nhật ở vị trí:",
              postIndex
            );
            newPosts[postIndex] = {
              ...newPosts[postIndex],
              comments: commentsData,
              commentsLoading: false,
              commentsLoaded: true,
              _forceUpdate: Date.now(), // Thêm trường này để đảm bảo React nhận ra sự thay đổi
            };

            console.log(
              "8. Đã cập nhật bài viết với",
              commentsData.length,
              "bình luận"
            );
            // setPosts(newPosts);
          } else {
            console.log("7. Không tìm thấy bài viết với ID:", postId);
          }

          // Tăng biến đếm để buộc component re-render
          setCommentRefreshCount((prev) => prev + 1);

          showNotification("Đã tải lại bình luận", "success");
          return;
        } else {
          console.log("4. API lỗi, thử phương pháp khác");
          throw new Error("API trả về lỗi");
        }
      } catch (error) {
        console.log("9. Lỗi phương pháp 1:", error.message);

        // Thử cách 2: Dùng getPostComments
        try {
          console.log("10. Thử phương pháp 2: Sử dụng getPostComments");
          const commentsResult = await getPostComments(postId);
          console.log("11. Kết quả getPostComments:", commentsResult);

          if (commentsResult?.code === 200 && commentsResult.data) {
            console.log("12. getPostComments thành công, có dữ liệu");

            // Cập nhật state với cách khác để đảm bảo React render lại
            const newPosts = JSON.parse(JSON.stringify(posts)); // Deep clone
            const postIndex = newPosts.findIndex((p) => p.id === postId);

            if (postIndex >= 0) {
              newPosts[postIndex] = {
                ...newPosts[postIndex],
                comments: commentsResult.data,
                commentsLoading: false,
                commentsLoaded: true,
                _forceUpdate: Date.now(),
              };

              console.log(
                "13. Cập nhật state với",
                commentsResult.data.length,
                "bình luận"
              );
              // setPosts(newPosts);

              // Tăng biến đếm để buộc component re-render
              setCommentRefreshCount((prev) => prev + 1);

              showNotification("Đã tải lại bình luận", "success");
              return;
            }
          } else {
            console.log(
              "12. getPostComments không thành công:",
              commentsResult
            );
            throw new Error("getPostComments không trả về dữ liệu");
          }
        } catch (error2) {
          console.log("14. Lỗi phương pháp 2:", error2.message);

          // Thử phương pháp 3: Tải lại toàn bộ trang
          console.log("15. Thử phương pháp 3: Tải lại trang");
          showNotification("Đang tải lại trang...", "info");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return;
        }
      }
    } catch (error) {
      console.error("Lỗi chung khi tải lại bình luận:", error);
      showNotification(
        "Không thể tải lại bình luận, đang tải lại trang...",
        "error"
      );

      // Tải lại trang là cách cuối cùng
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
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
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Fetch lại bình luận mới nhất
        const commentsResult = await getPostComments(postId);
        if (commentsResult?.code === 200 && commentsResult.data) {
          // setPosts(prevPosts =>
          //   prevPosts.map(post =>
          //     post.id === postId
          //       ? { ...post, comments: commentsResult.data }
          //       : post
          //   )
          // );

          // Sau khi bình luận thành công, luôn chuyển sang chế độ 'more' để hiển thị
          // bình luận mới (đảm bảo người dùng thấy bình luận vừa thêm)
          setCommentDisplayMode((prev) => ({
            ...prev,
            [postId]: "more",
          }));
        }
      }

      // Tự động tải lại bình luận sau 3 giây, bất kể thành công hay không
      setTimeout(() => {
        reloadComments(postId);
      }, 2000);
    } catch (err) {
      console.error("Error commenting:", err);

      // Vẫn tải lại bình luận ngay cả khi có lỗi
      setTimeout(() => {
        reloadComments(postId);
      }, 3000);
    }
  };

  // Thêm hàm mới để xử lý việc gửi bình luận khi nhấn Enter
  const handleCommentKeyPress = (e, postId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment(postId);
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
        // setPosts(prevPosts =>
        //   prevPosts.map(post => ({
        //     ...post,
        //     isLiked: likeStatusResult.data[post.id] === true
        //   }))
        // );
      }

      for (const post of posts) {
        fetchPostDetails(post.id);
      }

      showNotification("Đã cập nhật dữ liệu bài viết", "info");
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
      console.log("Liking post:", postId);

      const currentPost = posts.find((p) => p.id === postId);
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
      // setPosts((prevPosts) => {
      //   // Tạo bản sao mới của mảng bài viết
      //   const newPosts = prevPosts.map((post) => {
      //     if (post.id === postId) {
      //       const newLikes = newIsLiked
      //         ? (post.likes || 0) + 1
      //         : Math.max(0, (post.likes || 0) - 1);

      //       console.log(`Updating post UI - isLiked: ${wasLiked} -> ${newIsLiked}, likes: ${post.likes} -> ${newLikes}`);

      //       return {
      //         ...post,
      //         likes: newLikes,
      //         isLiked: newIsLiked,
      //         tempId: tempPostId, // Đánh dấu bài viết này đã được cập nhật
      //       };
      //     }
      //     return post;
      //   });

      //   return newPosts;
      // });

      // Gọi API - Sử dụng async/await để đảm bảo xử lý tuần tự
      const result = await likePost(postId);
      console.log("Like API response:", result);

      // Kiểm tra xem đã có sự thay đổi UI từ lúc gửi request đến lúc nhận response không
      const currentUIPost = posts.find((p) => p.id === postId);
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
          // setPosts((prevPosts) =>
          //   prevPosts.map((post) => {
          //     if (post.id === postId) {
          //       const finalLikes = finalLikeStatus
          //         ? (wasLiked ? post.likes : post.likes + 1)
          //         : (wasLiked ? post.likes - 1 : post.likes);

          //       return {
          //         ...post,
          //         likes: finalLikes,
          //         isLiked: finalLikeStatus,
          //         tempId: null, // Xóa tempId
          //       };
          //     }
          //     return post;
          //   })
          // );
        } else {
          // Xóa tempId để hoàn tất quá trình cập nhật
          // setPosts((prevPosts) =>
          //   prevPosts.map((post) =>
          //     post.id === postId
          //       ? {...post, tempId: null}
          //       : post
          //   )
          // );
        }

        // Thông báo thành công
        const actionText = finalLikeStatus ? "Đã thích" : "Đã bỏ thích";
        showNotification(`${actionText} bài viết`, "success");
      }
      // Nếu API thất bại nhưng UI đã cập nhật
      else if (hasUIChanged) {
        console.error("Like API failed, reverting to previous state");
        // setPosts((prevPosts) =>
        //   prevPosts.map((post) => {
        //     if (post.id === postId) {
        //       return {
        //         ...post,
        //         likes: wasLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
        //         isLiked: wasLiked,
        //         tempId: null, // Xóa tempId
        //       };
        //     }
        //     return post;
        //   })
        // );

        showNotification("Không thể cập nhật trạng thái thích", "error");
      }

      // Sau khi like/dislike thành công, cập nhật lại thông tin chi tiết (đã được chuyển vào xử lý success)
      if (result?.code === 200) {
        setTimeout(() => {
          fetchPostDetails(postId);
        }, 500);
      }
    } catch (err) {
      console.error("InfoCompany - Error liking post:", err);
      showNotification("Đã xảy ra lỗi", "error");
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
                          style={{ color: post.isLiked ? "#1877f2" : "" }}
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
                  ))}
                  <div style={{ display: "flex" }}>
                    <Button
                      ref={ref}
                      onClick={() => fetchNextPage()}
                      disabled={!hasNextPage || isFetchingNextPage}
                      type="link"
                      style={{ margin: "0 auto" }}
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
