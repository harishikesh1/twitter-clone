/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "#grapql\nmutation createTweetMutation($payload: CreateTweetData) {\n  createTweet(payload: $payload) {\n    id\n     \n  }\n}\n\n\n ": types.CreateTweetMutationDocument,
    "\n  mutation LikeTweet($tweetId: ID!) {\n    likeTweet(tweetId: $tweetId) {\n      id\n      likes {\n        id\n      }\n    }\n  }\n": types.LikeTweetDocument,
    "\n  mutation BookmarkTweet($tweetId: ID!) {\n    bookmarkTweet(tweetId: $tweetId) {\n      id\n    }\n  }\n": types.BookmarkTweetDocument,
    "\n  mutation UnbookmarkTweet($tweetId: ID!) {\n    unbookmarkTweet(tweetId: $tweetId) {\n      id\n    }\n  }\n": types.UnbookmarkTweetDocument,
    "\n\n\nmutation unlikeTweet($tweetId: ID!) {\n  unlikeTweet(tweetId: $tweetId) {\n    id\n    likes {\n      id\n    }\n  }\n}\n": types.UnlikeTweetDocument,
    "\nmutation AddComment($input: CreateCommentData!) {\n  createComment(input: $input) {\n    id\n    content\n    author {\n      id\n      firstName\n      lastName\n      profileImageURL\n    }\n    tweet {\n      id\n    }\n    createdAt\n  }\n}\n\n\n": types.AddCommentDocument,
    "\nmutation DeleteComment($commentId: ID!) {\n  deleteComment(commentId: $commentId)\n}\n": types.DeleteCommentDocument,
    "\n  #graphql\n  mutation FollowUser($to: ID!) {\n    followUser(to: $to)\n  }\n": types.FollowUserDocument,
    "\n  #graphql\n  mutation UnfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n": types.UnfollowUserDocument,
    "\n  query GetAllTweets {\n    getAllTweets {\n      id\n      content\n      imageURL\n      author {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      likes {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      comments {\n        id\n        content\n        createdAt\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n": types.GetAllTweetsDocument,
    "#graphql\n\n\nquery GetSignedURL($imageName: String!, $imageType: String!) {\n    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)\n  }\n  \n": types.GetSignedUrlDocument,
    "#graphql\n\nquery getTweet($tweetId: ID!) {\n  tweet(id: $tweetId) {\n    id\n    imageURL\n    content\n    comments {\n        author {\n          profileImageURL\n          firstName\n          email\n          id\n        }\n      content\n    }\n    likes {\n    id\n      firstName\n    }\n    author {\n      email\n      firstName\n      id\n      profileImageURL\n      \n    }\n  }\n}\n\n": types.GetTweetDocument,
    "#graphql\n  query CheckIfBookmarked($tweetId: ID!, $userId: ID!) {\n    isBookmarked(tweetId: $tweetId, userId: $userId)\n  }\n": types.CheckIfBookmarkedDocument,
    "#graphql\nquery GetBookmarksWithDetails {\n  getBookmarks {\n      tweet {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageURL\n        }\n        comments {\n          id\n          content\n          author {\n            email\n            id\n            firstName\n            lastName\n            profileImageURL\n          }\n        }\n        likes {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n}\n": types.GetBookmarksWithDetailsDocument,
    "#graphql\n    query verifyGoogleToken($token: String!){\n    verifyGoogleToken(token: $token)\n    }\n\n": types.VerifyGoogleTokenDocument,
    "#graphql\n    query getCurrentUser {\n  getCurrentUser {\n    email\n    id\n    firstName\n    lastName\n    profileImageURL\n\n      recommendedUsers {\n       email\n    firstName\n    id\n    profileImageURL\n    }\n\n     follower {\n     email\n      firstName\n      id\n      profileImageURL\n    }\n    following {\n      email\n      firstName\n      id\n      profileImageURL\n    }\n\n    tweets {\n      id\n      content\n      author {\n        id\n        firstName\n        email\n        profileImageURL\n      }\n    }\n  }\n}\n    \n    ": types.GetCurrentUserDocument,
    "#graphql\n  query GetUserById($id: ID!){\n  getUserById(id: $id) {\n    id\n    email\n    firstName\n    lastName\n    profileImageURL\n   \n\n     follower {\n      firstName\n      email\n    }\n    following {\n      email\n      firstName\n    }\n\n    tweets {\n      content\n      id\n      author {\n      id\n        firstName\n        lastName\n        profileImageURL\n      }\n    }\n  }\n}\n  \n  ": types.GetUserByIdDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#grapql\nmutation createTweetMutation($payload: CreateTweetData) {\n  createTweet(payload: $payload) {\n    id\n     \n  }\n}\n\n\n "): (typeof documents)["#grapql\nmutation createTweetMutation($payload: CreateTweetData) {\n  createTweet(payload: $payload) {\n    id\n     \n  }\n}\n\n\n "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LikeTweet($tweetId: ID!) {\n    likeTweet(tweetId: $tweetId) {\n      id\n      likes {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LikeTweet($tweetId: ID!) {\n    likeTweet(tweetId: $tweetId) {\n      id\n      likes {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation BookmarkTweet($tweetId: ID!) {\n    bookmarkTweet(tweetId: $tweetId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation BookmarkTweet($tweetId: ID!) {\n    bookmarkTweet(tweetId: $tweetId) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnbookmarkTweet($tweetId: ID!) {\n    unbookmarkTweet(tweetId: $tweetId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UnbookmarkTweet($tweetId: ID!) {\n    unbookmarkTweet(tweetId: $tweetId) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\n\nmutation unlikeTweet($tweetId: ID!) {\n  unlikeTweet(tweetId: $tweetId) {\n    id\n    likes {\n      id\n    }\n  }\n}\n"): (typeof documents)["\n\n\nmutation unlikeTweet($tweetId: ID!) {\n  unlikeTweet(tweetId: $tweetId) {\n    id\n    likes {\n      id\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation AddComment($input: CreateCommentData!) {\n  createComment(input: $input) {\n    id\n    content\n    author {\n      id\n      firstName\n      lastName\n      profileImageURL\n    }\n    tweet {\n      id\n    }\n    createdAt\n  }\n}\n\n\n"): (typeof documents)["\nmutation AddComment($input: CreateCommentData!) {\n  createComment(input: $input) {\n    id\n    content\n    author {\n      id\n      firstName\n      lastName\n      profileImageURL\n    }\n    tweet {\n      id\n    }\n    createdAt\n  }\n}\n\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteComment($commentId: ID!) {\n  deleteComment(commentId: $commentId)\n}\n"): (typeof documents)["\nmutation DeleteComment($commentId: ID!) {\n  deleteComment(commentId: $commentId)\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation FollowUser($to: ID!) {\n    followUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation FollowUser($to: ID!) {\n    followUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation UnfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation UnfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllTweets {\n    getAllTweets {\n      id\n      content\n      imageURL\n      author {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      likes {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      comments {\n        id\n        content\n        createdAt\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllTweets {\n    getAllTweets {\n      id\n      content\n      imageURL\n      author {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      likes {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      comments {\n        id\n        content\n        createdAt\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n\n\nquery GetSignedURL($imageName: String!, $imageType: String!) {\n    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)\n  }\n  \n"): (typeof documents)["#graphql\n\n\nquery GetSignedURL($imageName: String!, $imageType: String!) {\n    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n\nquery getTweet($tweetId: ID!) {\n  tweet(id: $tweetId) {\n    id\n    imageURL\n    content\n    comments {\n        author {\n          profileImageURL\n          firstName\n          email\n          id\n        }\n      content\n    }\n    likes {\n    id\n      firstName\n    }\n    author {\n      email\n      firstName\n      id\n      profileImageURL\n      \n    }\n  }\n}\n\n"): (typeof documents)["#graphql\n\nquery getTweet($tweetId: ID!) {\n  tweet(id: $tweetId) {\n    id\n    imageURL\n    content\n    comments {\n        author {\n          profileImageURL\n          firstName\n          email\n          id\n        }\n      content\n    }\n    likes {\n    id\n      firstName\n    }\n    author {\n      email\n      firstName\n      id\n      profileImageURL\n      \n    }\n  }\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n  query CheckIfBookmarked($tweetId: ID!, $userId: ID!) {\n    isBookmarked(tweetId: $tweetId, userId: $userId)\n  }\n"): (typeof documents)["#graphql\n  query CheckIfBookmarked($tweetId: ID!, $userId: ID!) {\n    isBookmarked(tweetId: $tweetId, userId: $userId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\nquery GetBookmarksWithDetails {\n  getBookmarks {\n      tweet {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageURL\n        }\n        comments {\n          id\n          content\n          author {\n            email\n            id\n            firstName\n            lastName\n            profileImageURL\n          }\n        }\n        likes {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n}\n"): (typeof documents)["#graphql\nquery GetBookmarksWithDetails {\n  getBookmarks {\n      tweet {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageURL\n        }\n        comments {\n          id\n          content\n          author {\n            email\n            id\n            firstName\n            lastName\n            profileImageURL\n          }\n        }\n        likes {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    query verifyGoogleToken($token: String!){\n    verifyGoogleToken(token: $token)\n    }\n\n"): (typeof documents)["#graphql\n    query verifyGoogleToken($token: String!){\n    verifyGoogleToken(token: $token)\n    }\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    query getCurrentUser {\n  getCurrentUser {\n    email\n    id\n    firstName\n    lastName\n    profileImageURL\n\n      recommendedUsers {\n       email\n    firstName\n    id\n    profileImageURL\n    }\n\n     follower {\n     email\n      firstName\n      id\n      profileImageURL\n    }\n    following {\n      email\n      firstName\n      id\n      profileImageURL\n    }\n\n    tweets {\n      id\n      content\n      author {\n        id\n        firstName\n        email\n        profileImageURL\n      }\n    }\n  }\n}\n    \n    "): (typeof documents)["#graphql\n    query getCurrentUser {\n  getCurrentUser {\n    email\n    id\n    firstName\n    lastName\n    profileImageURL\n\n      recommendedUsers {\n       email\n    firstName\n    id\n    profileImageURL\n    }\n\n     follower {\n     email\n      firstName\n      id\n      profileImageURL\n    }\n    following {\n      email\n      firstName\n      id\n      profileImageURL\n    }\n\n    tweets {\n      id\n      content\n      author {\n        id\n        firstName\n        email\n        profileImageURL\n      }\n    }\n  }\n}\n    \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n  query GetUserById($id: ID!){\n  getUserById(id: $id) {\n    id\n    email\n    firstName\n    lastName\n    profileImageURL\n   \n\n     follower {\n      firstName\n      email\n    }\n    following {\n      email\n      firstName\n    }\n\n    tweets {\n      content\n      id\n      author {\n      id\n        firstName\n        lastName\n        profileImageURL\n      }\n    }\n  }\n}\n  \n  "): (typeof documents)["#graphql\n  query GetUserById($id: ID!){\n  getUserById(id: $id) {\n    id\n    email\n    firstName\n    lastName\n    profileImageURL\n   \n\n     follower {\n      firstName\n      email\n    }\n    following {\n      email\n      firstName\n    }\n\n    tweets {\n      content\n      id\n      author {\n      id\n        firstName\n        lastName\n        profileImageURL\n      }\n    }\n  }\n}\n  \n  "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;