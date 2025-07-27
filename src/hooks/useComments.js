import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentOnPost, likePost } from "../services/clients/postApi";
import { message } from "antd";

// Hook để comment vào bài viết
export function useCommentOnPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content, currentUser }) => commentOnPost(postId, content),
    onMutate: async ({ postId, content, currentUser }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts-infinite"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts-infinite"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["posts-infinite"], (old) => {
        if (!old?.pages) return old;

        const newComment = {
          id: `temp-${Date.now()}`,
          content,
          userId: currentUser
            ? {
                _id: currentUser.id,
                avatar: currentUser.avatar,
              }
            : null,
          timeAgo: "1 phút",
          parentCommentId: null,
          isOptimistic: true,
        };

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    comments: [newComment, ...(post.comments || [])],
                  }
                : post
            ),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, _, context) => {
      // Revert to previous state on error
      queryClient.setQueryData(["posts-infinite"], context.previousPosts);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể bình luận. Vui lòng thử lại!";
      message.error(errorMessage);
    },
    onSuccess: (data, variables) => {
      // Cập nhật comment cụ thể thay vì invalidate toàn bộ
      queryClient.setQueryData(["posts-infinite"], (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === variables.postId
                ? {
                    ...post,
                    comments: [
                      ...(post.comments || []).map((comment) =>
                        comment.isOptimistic
                          ? {
                              ...comment,
                              isOptimistic: false,
                              id: data.comment._id,
                            }
                          : comment
                      ),
                    ],
                  }
                : post
            ),
          })),
        };
      });

      message.success(data.message);
    },
  });
}

// Hook để like/unlike bài viết
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }) => likePost(postId),
    onMutate: async ({ postId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts-infinite"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts-infinite"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["posts-infinite"], (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                  }
                : post
            ),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      // Revert to previous state on error
      queryClient.setQueryData(["posts-infinite"], context.previousPosts);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể like bài viết. Vui lòng thử lại!";
      message.error(errorMessage);
    },
    onSuccess: (data, variables) => {
      // Controller trả về { message: "Đã like bài viết" hoặc "Bỏ like bài viết", likes: post.likes.length }
      if (data?.message) {
        // Update with actual like count from server
        queryClient.setQueryData(["posts-infinite"], (old) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post.id === variables.postId
                  ? {
                      ...post,
                      likes: data.likes, // Sử dụng số lượt like chính xác từ server
                      isLiked: data.message.includes("Đã like"), // Xác định trạng thái like từ message
                    }
                  : post
              ),
            })),
          };
        });

        // Success message is optional for like as it's a quick action
        // Có thể bỏ comment dòng dưới nếu muốn hiển thị thông báo
        // message.success(data.message);
      } else {
        message.error("Không thể like bài viết. Vui lòng thử lại!");
      }
    },
  });
}
