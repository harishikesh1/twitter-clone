import { graphql } from "@/gql";
import { GetAllTweetsQuery } from "@/gql/graphql"; 

export const getAllTweetsQuery = graphql(/* GraphQL */ `
  query GetAllTweets {
    getAllTweets {
      id
      content
      imageURL
      author {
        id
        firstName
        lastName
        profileImageURL
      }
      likes {
        id
        firstName
        lastName
        profileImageURL
      }
      comments {
        id
        content
        createdAt
        author {
          id
          firstName
          lastName
          profileImageURL
        }
      }
    }
  }
`);



export const getSignedURLForTweetQuery = graphql( `#graphql


query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
  }
  
`)


export const getTweetQuery = graphql( `#graphql

query getTweet($tweetId: ID!) {
  tweet(id: $tweetId) {
    id
    imageURL
    content
    comments {
        author {
          profileImageURL
          firstName
          email
          id
        }
      content
    }
    likes {
    id
      firstName
    }
    author {
      email
      firstName
      id
      profileImageURL
      
    }
  }
}

`)


export const checkBookmarkQuery =graphql( `#graphql
  query CheckIfBookmarked($tweetId: ID!, $userId: ID!) {
    isBookmarked(tweetId: $tweetId, userId: $userId)
  }
`)


export const GetBookmarksWithDetailsQuery =graphql( `#graphql
query GetBookmarksWithDetails {
  getBookmarks {
      tweet {
        id
        content
        imageURL
        author {
          id
          firstName
          lastName
          email
          profileImageURL
        }
        comments {
          id
          content
          author {
            email
            id
            firstName
            lastName
            profileImageURL
          }
        }
        likes {
          id
          firstName
          lastName
          profileImageURL
        }
      }
    }
}
`)
