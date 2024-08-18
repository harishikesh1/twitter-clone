import axios from "axios";
import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt"
import { Tweet, User } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
 
import { redisClient } from "../../client/redis";
 
 
 



interface GoogleTokenInfo {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    iat: number;
    exp: number;
}

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        const googleToken = token;
        const googleOauthUrl = new URL("https://oauth2.googleapis.com/tokeninfo")
        googleOauthUrl.searchParams.set("id_token", googleToken)

        try {
            const { data } = await axios.get<GoogleTokenInfo>(
                googleOauthUrl.toString(),
                {
                    responseType: "json"
                }
            )

            const user = await prismaClient.user.findUnique({
                where: {
                    email: data.email
                }
            })

            if (!user) {
                const user = await prismaClient.user.create({
                    data: {
                        firstName: data.given_name,
                        email: data.email,
                        profileImageURL: data.picture,
                        lastName: data.family_name,

                    }
                })

            }
            const inDbuser = await prismaClient.user.findUnique({
                where: {
                    email: data.email
                }
            })
            if (!inDbuser) {
                throw new Error(" user is not in database");

            }

            const token = JWTService.generateTokenForUser(inDbuser);

            return token;
        } catch (error) {
            throw new Error("Failed to verify Google token");
        }
    },

    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        const id = ctx.user?.id;
    
        if (!id) return null;
    
        const cachedUser = await redisClient.get(`USER:${id}`);
        if (cachedUser) {
            
            
          return JSON.parse(cachedUser);
        }
    
        const user = await prismaClient.user.findUnique({ where: { id } });
        if (user) {
          await redisClient.set(`USER:${id}`, JSON.stringify(user));
        }
    
        return user;
      },
    
      getUserById: async (parent: any, { id }: { id: string }) => {
        const cachedUser = await redisClient.get(`USER:${id}`);
        if (cachedUser) {
            

          return JSON.parse(cachedUser);
        }
    
        const user = await prismaClient.user.findUnique({ where: { id } });
        if (user) {
          await redisClient.set(`USER:${id}`, JSON.stringify(user));
        }
    
        return user;
      },

      getBookmarks: async (parent: any, _: any, ctx: GraphqlContext) => {
        try {
            const result = await prismaClient.bookmarks.findMany({
                where: { user: { id: ctx.user?.id } },
                include: { tweet: true }
            });
    
            // Log and filter out any bookmarks with missing tweets or ids
            const filteredResult = result.filter(bookmark => bookmark.tweet && bookmark.tweet.id);
    
            // Log filtered result for debugging
            console.log("Filtered Bookmarks result:", filteredResult);
    
            return filteredResult;
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            throw new Error("Failed to fetch bookmarks");
        }
    }
    


}
const extraResolvers = {
    User: {
        tweets: (parent: User) => prismaClient.tweet.findMany({where:{
                author:{
                    id: parent.id
                }
            }}),

           
         
    


    follower: async function (parent:User) {
        const result = await prismaClient.follows.findMany({where:{
            following:{id: parent.id}},
            include:{
                follower:true
            }
        })

        return result.map((us)=> us.follower)
    },

    following: async function (parent:User) {
        const result = await prismaClient.follows.findMany({where:{
            follower:{id: parent.id}},
            include:{
                following:true
            }
        })

        return result.map((us)=> us.following)
    },

    recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
        if (!ctx.user) return [];
        const cachedValue = await redisClient.get(
          `RECOMMENDED_USERS:${ctx.user.id}`
        );
       
        
  
        if (cachedValue) {
         
          return JSON.parse(cachedValue);
        }
  
        const myFollowings = await prismaClient.follows.findMany({
          where: {
            follower: { id: ctx.user.id },
          },
          include: {
            following: {
              include: { follower: { include: { following: true } } },
            },
          },
        });
  
        const users: User[] = [];
  
        for (const followings of myFollowings) {
          for (const followingOfFollowedUser of followings.following.follower) {
            if (
              followingOfFollowedUser.following.id !== ctx.user.id &&
              myFollowings.findIndex(
                (e) => e?.followingId === followingOfFollowedUser.following.id
              ) < 0
            ) {
              users.push(followingOfFollowedUser.following);
            }
          }
        }

        await redisClient.set(`RECOMMENDED_USERS:${ctx.user.id}`, JSON.stringify(users))
        return users
    }
},
}

const mutations = {
    followUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        const id = ctx.user?.id;
        
        if (!id) {
            throw new Error("Unauthorized");
        }
    
        try {
          
            const existingFollow = await prismaClient.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: id,
                        followingId: to,
                    },
                },
            });
    
            if (existingFollow) {
                
                return false;
            }
    
  
            await prismaClient.follows.create({
                data: {
                    follower: { connect: { id } },
                    following: { connect: { id: to } },
                },
            });
            redisClient.del(`RECOMMENDED_USERS:${ctx.user?.id}`)
            return true;  
        } catch (error) {
            
            console.error("Error following user:", error);
            return false; 
        }
    },
    unfollowUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        const id = ctx.user?.id;
        
        if (!id) {
            throw new Error("Unauthorized");
        }
    
        try { 
          
            const existingFollow = await prismaClient.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: id,
                        followingId: to,
                    },
                },
            });
    
            if (existingFollow) {
            await prismaClient.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: id,
                        followingId: to,
                    },
                },
            });
        }
        redisClient.del(`RECOMMENDED_USERS:${ctx.user?.id}`)
    
            return true;  
        } catch (error) {
            
            console.error("Error unfollowing user:", error);
            return false; 
        }
    }
    

    

}
export const resolvers = { queries, extraResolvers , mutations}