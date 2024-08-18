import { graphql } from "@/gql";

export const VerifyGoogleToken = graphql( `#graphql
    query verifyGoogleToken($token: String!){
    verifyGoogleToken(token: $token)
    }

`)

export const getCurrentUser = graphql( `#graphql
    query getCurrentUser {
  getCurrentUser {
    email
    id
    firstName
    lastName
    profileImageURL

      recommendedUsers {
       email
    firstName
    id
    profileImageURL
    }

     follower {
     email
      firstName
      id
      profileImageURL
    }
    following {
      email
      firstName
      id
      profileImageURL
    }

    tweets {
      id
      content
      author {
        id
        firstName
        email
        profileImageURL
      }
    }
  }
}
    
    `)

export const getUserByIdQuery = graphql(  `#graphql
  query GetUserById($id: ID!){
  getUserById(id: $id) {
    id
    email
    firstName
    lastName
    profileImageURL
   

     follower {
      firstName
      email
    }
    following {
      email
      firstName
    }

    tweets {
      content
      id
      author {
      id
        firstName
        lastName
        profileImageURL
      }
    }
  }
}
  
  `
)
