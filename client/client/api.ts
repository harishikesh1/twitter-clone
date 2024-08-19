import { GraphQLClient } from "graphql-request";



export const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL as string);




if (typeof window !== 'undefined') {
  const token = localStorage.getItem("__twitter_token");
  graphQLClient.setHeader('authorization', `Bearer ${token}`);
}

