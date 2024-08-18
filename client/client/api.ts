import { GraphQLClient } from "graphql-request";



export const graphQLClient = new GraphQLClient("http://localhost:8000/graphql");




if (typeof window !== 'undefined') {
  const token = localStorage.getItem("__twitter_token");
  graphQLClient.setHeader('authorization', `Bearer ${token}`);
}

