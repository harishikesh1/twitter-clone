export const types = `#graphql 
 
input CreateTweetData{
content: String!
imageURL: String
}

input CreateCommentData{
  content: String!
  tweetId: ID!
 
}

type Tweet {
    id: ID!
    content: String!
    imageURL: String
    author: User
    likes: [User]   
    comments: [Comment]   
}


type Comment {
  id: ID!
  content: String!
  author: User
  tweet: Tweet
  createdAt: String    
  updatedAt: String    
}

type Bookmarks {
  
 
  user: User!
  tweet: Tweet!

  
}
  `