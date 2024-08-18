export const queries = `#graphql
    getAllTweets: [Tweet]
    getSignedURLForTweet(imageName: String! ,imageType: String!): String
    tweet(id: ID!): Tweet
    user(id: ID!): User
    comment(id: ID!): Comment
    isBookmarked(tweetId: ID!, userId: ID!): Boolean

`