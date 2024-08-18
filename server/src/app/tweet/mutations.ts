export const mutations = `#graphql
    createTweet(payload: CreateTweetData): Tweet
    
    likeTweet(tweetId: ID!): Tweet

     unlikeTweet(tweetId: ID!): Tweet
     
     createComment(input: CreateCommentData!): Comment
     deleteComment(commentId: ID!): Boolean

     bookmarkTweet(tweetId: ID!): Tweet
     unbookmarkTweet(tweetId: ID!): Tweet
`