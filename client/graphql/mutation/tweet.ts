import { graphql } from "@/gql";

export const createTweetMutation = graphql(
    `#grapql
mutation createTweetMutation($payload: CreateTweetData) {
  createTweet(payload: $payload) {
    id
     
  }
}


 `)

 export const likeTweetMutation = graphql( `
  mutation LikeTweet($tweetId: ID!) {
    likeTweet(tweetId: $tweetId) {
      id
      likes {
        id
      }
    }
  }
`);

export const bookmarkTweetMutation = graphql( `
  mutation BookmarkTweet($tweetId: ID!) {
    bookmarkTweet(tweetId: $tweetId) {
      id
    }
  }
`);

 

export const unbookmarkTweetMutation = graphql( `
  mutation UnbookmarkTweet($tweetId: ID!) {
    unbookmarkTweet(tweetId: $tweetId) {
      id
    }
  }
`);




 
export const unlikeTweetMutation = graphql( `


mutation unlikeTweet($tweetId: ID!) {
  unlikeTweet(tweetId: $tweetId) {
    id
    likes {
      id
    }
  }
}
`);

export const addCommentMutation = graphql( `
mutation AddComment($input: CreateCommentData!) {
  createComment(input: $input) {
    id
    content
    author {
      id
      firstName
      lastName
      profileImageURL
    }
    tweet {
      id
    }
    createdAt
  }
}


`);

export const deleteCommentMutation = graphql( `
mutation DeleteComment($commentId: ID!) {
  deleteComment(commentId: $commentId)
}
`);
