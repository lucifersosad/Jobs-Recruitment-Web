import { useInfiniteQuery } from "@tanstack/react-query";
import { getEmployerPosts } from "../services/clients/postApi";

// Hook để fetch tasks với infinite loading (load more)
export function useGetPostsInfinite(employerId) {
  return useInfiniteQuery({
    queryKey: ['posts-infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getEmployerPosts(employerId, "", pageParam)
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
}