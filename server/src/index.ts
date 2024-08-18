import express, { Application, Request } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();
import { User } from "./app/user"
import { Tweet } from "./app/tweet"
import { GraphqlContext } from './interfaces';
import JWTService from './services/jwt';
const app: Application = express();

 
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
const typeDefs = `#graphql

${User.types}
${Tweet.types}
  type Query {
    ${User.queries}
    ${Tweet.queries}
    
  }

  type Mutation {
  ${Tweet.mutations}
  ${User.mutations}

  }


`;
 
const resolvers = {
    Query: {
      ...User.resolvers.queries,
      ...Tweet.resolvers.queries
    },
    
    Mutation:{
      ...Tweet.resolvers.mutations,
      ...User.resolvers.mutations
    }, 
    ...Tweet.resolvers.extraResolvers,
    ...User.resolvers.extraResolvers
     
};


interface User {
    id: string;
    name: string;
    email: string;

}

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}
 
const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs,
    resolvers,
});

 
graphqlServer.start().then(() => {
    
    app.use(
      "/graphql",
      expressMiddleware(graphqlServer, {
        context: async ({ req, res }) => {
          return {
            user: req.headers.authorization
              ? JWTService.decodeToken(
                  req.headers.authorization.split("Bearer ")[1]
                )
              : undefined,
          };
        },
      })
    );
      

    
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/graphql`);
    });
});


 
 