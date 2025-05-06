import { useState, useEffect } from "react";
import { ConfigProvider, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faPaperPlane,
  faRotate
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { likePost, commentOnPost } from "../../../../services/clients/postApi";
import PostImageViewer from "./PostImageViewer";

function PostsCard({ posts, postsLoading, postsError, companyData, onRefresh, onFetchPostDetails }) {
  const [commentContent, setCommentContent] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [imageViewer, setImageViewer] = useState({
    postId: null,
    visible: false,
    images: [],
    currentIndex: 0
  });

  const authUser = useSelector((state) => state.authenticationReducerClient?.infoUser);

  const handleLike = async (postId) => {
    try {
      console.log("Liking post:", postId);
      const result = await likePost(postId);
      
      if (result?.code === 200) {
        const actionText = result.data?.isLiked ? "Đã thích" : "Đã bỏ thích";
        showNotification(`${actionText} bài viết`, 'success');
        
        // Cập nhật thông tin sau khi like/unlike
        setTimeout(() => {
          if (onFetchPostDetails) onFetchPostDetails(postId);
        }, 500);
      } else {
        showNotification('Không thể cập nhật trạng thái thích', 'error');
      }
    } catch (err) {
      console.error("Error liking post:", err);
      showNotification('Đã xảy ra lỗi', 'error');
    }
  };

  const handleComment = async (postId) => {
    if (!commentContent[postId]?.trim()) return;
    try {
      const result = await commentOnPost(postId, commentContent[postId]);
      
      if (result?.code === 200 && result.data) {
        setCommentContent((prev) => ({ ...prev, [postId]: "" }));
        showNotification('Đã đăng bình luận thành công!');
        
        setTimeout(() => {
          if (onFetchPostDetails) onFetchPostDetails(postId);
        }, 500);
      } else {
        showNotification('Không thể đăng bình luận. Vui lòng thử lại!', 'error');
      }
    } catch (err) {
      console.error("Error commenting on post:", err);
      showNotification('Không thể đăng bình luận. Vui lòng thử lại!', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const renderRefreshButton = () => (
    <button
      className="refresh-button"
      onClick={onRefresh}
      title="Làm mới dữ liệu"
    >
      <FontAwesomeIcon icon={faRotate} className="refresh-icon" />
    </button>
  );

  const renderComments = (comments) => {
    const parentComments = comments.filter(comment => !comment.parentCommentId);
    const replyComments = comments.filter(comment => comment.parentCommentId);
    
    const replyMap = {};
    replyComments.forEach(reply => {
      if (!replyMap[reply.parentCommentId]) {
        replyMap[reply.parentCommentId] = [];
      }
      replyMap[reply.parentCommentId].push(reply);
    });
    
    return parentComments.map((comment, index) => (
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
                src={reply.userId?.avatar || companyData?.logoCompany || "https://via.placeholder.com/32"}
                alt="Reply Avatar"
              />
            </div>
            <div className="comment-content">
              <div className="name">
                {reply.userId?.fullName || companyData?.companyName || "Công ty"}
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
    ));
  };

  return (
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
                    <div className="avatar">
                      <img
                        src={companyData?.logoCompany || "https://via.placeholder.com/40"}
                        alt="Company Logo"
                      />
                    </div>
                    <div className="info">
                      <div className="name">
                        {post.companyName || companyData?.companyName || "Công ty ẩn danh"}
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

                  {post.images && post.images.length > 0 && (
                    <PostImageViewer 
                      postId={post.id}
                      images={post.images}
                      imageViewer={imageViewer}
                      setImageViewer={setImageViewer}
                    />
                  )}

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
                      renderComments(post.comments, post.id)
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
                        placeholder="Viết bình luận..."
                        onPressEnter={() => handleComment(post.id)}
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
      
      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default PostsCard; 