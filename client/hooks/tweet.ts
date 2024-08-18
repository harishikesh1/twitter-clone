import { getAllTweetsQuery, getTweetQuery } from "@/graphql/query/tweet"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "@/client/api"
import { createTweetMutation ,  likeTweetMutation, unlikeTweetMutation,  bookmarkTweetMutation, unbookmarkTweetMutation, addCommentMutation, deleteCommentMutation} from "@/graphql/mutation/tweet"

import {   GetBookmarksWithDetailsQuery} from "@/graphql/query/tweet"

//  
import { GetBookmarksWithDetailsQuery as GetBookmarksWithDetailsQueryType } from "@/gql/graphql"; // Adjust the path as needed

import { CreateTweetData } from "@/gql/graphql" 
import toast from "react-hot-toast"
 
import { checkBookmarkQuery } from "../graphql/query/tweet"; 
 
 
import { GetAllTweetsQuery } from "@/gql/graphql";  

export const useGetAllTweets = () => {
  const query = useQuery<GetAllTweetsQuery>({
    queryKey: ['all-tweets'],
    queryFn: () => graphQLClient.request(getAllTweetsQuery),
  });

  return { ...query, tweets: query.data?.getAllTweets };
};



export const useCreateTweet = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) =>
            graphQLClient.request(createTweetMutation, { payload }),
        
        onMutate: () => {
            toast.loading("Creating Tweet", { id: "1" });
        },
        
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['all-tweets'] });
            toast.success("Created Tweet", { id: "1" });
        },
        
        onError: () => {
            toast.error("Failed to Create Tweet", { id: "1" });
        }
    });

    return mutation;
};
 


export const useTweetById = (tweetId: string) => {
  const query = useQuery({
    queryKey: ["tweet-by-id", tweetId],
    queryFn: async () => {
      try {
        const response = await graphQLClient.request<{ tweet: any }>(getTweetQuery, { tweetId });
        return response;
      } catch (error) {
        console.error('GraphQL Request Error:', error);
        throw error;
      }
    },
    enabled: !!tweetId,
  });

  return { ...query, tweet: query.data?.tweet };
};

 

 


export const useBookmarkTweet = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
      mutationFn: async ({ tweetId, userId, isBookmarked }: { tweetId: string; userId: string; isBookmarked: boolean }) => {
          if (isBookmarked) {
              await graphQLClient.request(unbookmarkTweetMutation, { tweetId, userId });
          } else {
              await graphQLClient.request(bookmarkTweetMutation, { tweetId, userId });
          }
      },
      
      onMutate: () => {
          toast.loading("Updating Bookmark Status", { id: "bookmark" });
      },
      
      onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ['all-tweets'] });
          toast.success("Bookmark Status Updated", { id: "bookmark" });
      },
      
      onError: () => {
          toast.error("Failed to Update Bookmark Status", { id: "bookmark" });
      }
  });

  return mutation;
};
  

  export const useCheckIfBookmarked = (tweetId: string, userId: string) => {
    return useQuery<boolean>({
      queryKey: ["check-bookmark", tweetId, userId],
      queryFn: async () => {
        const response = await graphQLClient.request<{ isBookmarked: boolean }>(checkBookmarkQuery, { tweetId, userId });
        return response.isBookmarked;
      },
      enabled: !!tweetId && !!userId,
    });
  };
  


export const useLikeTweet = () => {
  const queryClient = useQueryClient();

  // Mutation for liking a tweet
  const likeMutation = useMutation({
    mutationFn: (tweetId: string) =>
      graphQLClient.request(likeTweetMutation, { tweetId }),

    onMutate: () => {
      toast.loading("Liking Tweet", { id: "2" });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['all-tweets'] });
      toast.success("Liked Tweet", { id: "2" });
    },

    onError: () => {
      toast.error("Failed to Like Tweet", { id: "2" });
    }
  });

  // Mutation for unliking a tweet
  const unlikeMutation = useMutation({
    mutationFn: (tweetId: string) =>
      graphQLClient.request(unlikeTweetMutation, { tweetId }),

    onMutate: () => {
      toast.loading("Unliking Tweet", { id: "3" });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['all-tweets'] });
      toast.success("Unliked Tweet", { id: "3" });
    },

    onError: () => {
      toast.error("Failed to Unlike Tweet", { id: "3" });
    }
  });

  // Toggle between liking and unliking
  const toggleLike = async (tweetId: string, isLiked: boolean) => {
    if (isLiked) {
      await unlikeMutation.mutateAsync(tweetId);
    } else {
      await likeMutation.mutateAsync(tweetId);
    }
  };

  return { toggleLike };
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ tweetId, content }: { tweetId: string; content: string }) => {
      await graphQLClient.request(addCommentMutation, { input: { tweetId, content } });
    },

    onMutate: () => {
      toast.loading("Adding Comment", { id: "add-comment" });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['all-tweets'] });
      toast.success("Comment Added", { id: "add-comment" });
    },

    onError: () => {
      toast.error("Failed to Add Comment", { id: "add-comment" });
    },
  });

  return mutation;
};



// Hook to delete a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: string }) => {
      await graphQLClient.request(deleteCommentMutation, { commentId });
    },

    onMutate: () => {
      toast.loading("Deleting Comment", { id: "delete-comment" });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['all-tweets'] });
      toast.success("Comment Deleted", { id: "delete-comment" });
    },

    onError: () => {
      toast.error("Failed to Delete Comment", { id: "delete-comment" });
    },
  });

  return mutation;
};


export const useGetBookmarksWithDetails = () => {
  const query = useQuery<GetBookmarksWithDetailsQueryType>({
    queryKey: ['bookmarks-with-details'],
    queryFn: async () => {
      try {
        const response = await graphQLClient.request<GetBookmarksWithDetailsQueryType>(GetBookmarksWithDetailsQuery);
        return response;
      } catch (error) {
        console.error('GraphQL Request Error:', error);
        toast.error("Failed to fetch bookmarks", { id: "fetch-bookmarks" });
        throw error;
      }
    },
  });

  return { ...query, bookmarks: query.data?.getBookmarks };
};