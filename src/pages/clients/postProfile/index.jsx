import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployerPosts, likePost, commentOnPost } from "../../../services/clients/postApi";
import { getCompany } from "../../../services/clients/employersApi";
import { getCookie } from "../../../helpers/cookie";
import { decData } from "../../../helpers/decData";
import "./postProfile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ConfigProvider, Input } from "antd";

function PostProfile() {
  const { employerId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [commentContent, setCommentContent] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({});

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
    const maxDisplay = 4;
    const remaining = images.length > maxDisplay ? images.length - maxDisplay : 0;

    return (
      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        {images.slice(0, maxDisplay).map((image, index) => (
          <div key={index} className="relative aspect-w-1 aspect-h-1">
            <img
              src={image}
              alt={`Post ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {index === maxDisplay - 1 && remaining > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
                +{remaining}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Bài viết từ công ty</h2>
        {loading ? (
          <div className="text-center text-gray-600">Đang tải bài viết...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={`post-${post.id}`}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  {/* Banner công ty */}
                  {companyInfo.bannerCompany && (
                    <div className="mb-4">
                      <img
                        src={companyInfo.bannerCompany}
                        alt="Banner Công ty"
                        className="w-full h-32 object-cover rounded-lg"
                        style={{objectPosition: 'center'}}
                      />
                    </div>
                  )}
                  <div className="flex items-center mb-4">
                    <img
                      src={companyInfo.logoCompany || "https://via.placeholder.com/40"}
                      alt="Company Avatar"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {post.companyName || companyInfo.companyName || "Công ty ẩn danh"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.timeAgo || "Không rõ thời gian"}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700">{post.caption || "Không có nội dung"}</p>
                    {renderImages(post.images)}
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm mb-2">
                    <span>{post.likes || 0} lượt thích</span>
                    <span>{post.comments?.length || 0} bình luận</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-around text-gray-600">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition ${
                          post.isLiked ? "text-blue-500" : ""
                        }`}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        <span>Thích</span>
                      </button>
                      <button
                        className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition"
                      >
                        <FontAwesomeIcon icon={faComment} />
                        <span>Bình luận</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    {post.comments?.map((comment, index) => (
                      <div key={index} className="flex items-start space-x-2 mb-3">
                        <img
                          src={comment.userAvatar || "https://via.placeholder.com/32"}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="bg-gray-100 rounded-lg p-2 flex-1">
                          <div className="font-semibold text-sm text-gray-800">
                            {comment.userName || "Ẩn danh"}
                          </div>
                          <div className="text-gray-700 text-sm">
                            {comment.content || "Không có nội dung"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <img
                      src="https://via.placeholder.com/32"
                      alt="Current User Avatar"
                      className="w-8 h-8 rounded-full"
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
                            className="text-gray-500 cursor-pointer hover:text-blue-500"
                          />
                        }
                      />
                    </ConfigProvider>
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