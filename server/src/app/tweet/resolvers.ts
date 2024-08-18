import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";
import { Tweet } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redisClient } from "../../client/redis";

interface CreateTweetPayload {
    content: string;
    imageURL?: string;
}

interface CreateCommentPayload {
    content: string;
    tweetId: string;
}

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS || (() => { throw new Error('S3_ACCESS is not defined'); })(),
        secretAccessKey: process.env.S3_SECRET || (() => { throw new Error('S3_SECRET is not defined'); })(),
    },
});

const queries = {
    isBookmarked: async (_: any, { tweetId, userId }: { tweetId: string, userId: string }, ctx: GraphqlContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const bookmark = await prismaClient.bookmarks.findUnique({
            where: {
                userId_tweetId: {
                    userId,
                    tweetId
                }
            }
        });

        return !!bookmark; // Return true if bookmark exists, otherwise false
    },

    getAllTweets: async () => {
        const cacheKey = "ALL_TWEETS";
        const cachedTweets = await redisClient.get(cacheKey);

        if (cachedTweets) {
            try {
                return JSON.parse(cachedTweets);
            } catch (error) {
                console.error("Failed to parse cached tweets:", error);
                await redisClient.del(cacheKey);  
            }
        }

        const tweets = await prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } });

        await redisClient.set(cacheKey, JSON.stringify(tweets)); 

        return tweets;
    },

    tweet: async (_: any, { id }: { id: string }) => {
        return prismaClient.tweet.findUnique({
            where: { id }
        });
    },

    getSignedURLForTweet: async (_: any, { imageName, imageType }: { imageName: string, imageType: string }, ctx: GraphqlContext) => {
        if (!ctx.user?.id) {
            console.error("Unauthorized");
            throw new Error("Unauthorized");
        }

        const allowedImageType = ['jpg', 'png', 'jpeg', 'webp'];
        if (!allowedImageType.includes(imageType)) {
            throw new Error("Image format not allowed");
        }

        const putObjectCommand = new PutObjectCommand({
            Bucket: "my-twitter-dev",
            Key: `uploads/${ctx.user?.id}/tweets/${imageName}-${Date.now().toString()}.${imageType}`
        });

        const signedURL = await getSignedUrl(s3Client, putObjectCommand);
        return signedURL;
    }
};

const mutations = {
    createTweet: async (_: any, { payload }: { payload: CreateTweetPayload }, ctx: GraphqlContext) => {
        const { content, imageURL } = payload;

        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const rateLimit = await redisClient.get(`RATE_LIMIT:TWEET:${ctx.user.id}`);
        if (rateLimit) {
            throw new Error("Too many requests");
        }

        const tweet = await prismaClient.tweet.create({
            data: {
                content,
                imageURL,
                author: { connect: { id: ctx.user.id } }
            }
        });

        await redisClient.setex(`RATE_LIMIT:TWEET:${ctx.user.id}`, 10, 1);
        await redisClient.del("ALL_TWEETS");

        return tweet;
    },

    likeTweet: async (_: any, { tweetId }: { tweetId: string }, ctx: GraphqlContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const tweet = await prismaClient.tweet.findUnique({ where: { id: tweetId } });
        if (!tweet) {
            throw new Error("Tweet not found");
        }

        const like = await prismaClient.likes.upsert({
            where: {
                userId_tweetId: {
                    userId: ctx.user.id,
                    tweetId
                }
            },
            update: {},
            create: {
                user: { connect: { id: ctx.user.id } },
                tweet: { connect: { id: tweetId } }
            }
        });

        return tweet;
    },

    unlikeTweet: async (_: any, { tweetId }: { tweetId: string }, ctx: GraphqlContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const tweet = await prismaClient.tweet.findUnique({ where: { id: tweetId } });
        if (!tweet) {
            throw new Error("Tweet not found");
        }

        await prismaClient.likes.delete({
            where: {
                userId_tweetId: {
                    userId: ctx.user.id,
                    tweetId
                }
            }
        });

        return tweet;
    },

    createComment: async (_: any, { input }: { input: CreateCommentPayload }, ctx: GraphqlContext) => {
        const { content, tweetId } = input;

        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const tweet = await prismaClient.tweet.findUnique({ where: { id: tweetId } });
        if (!tweet) {
            throw new Error("Tweet not found");
        }

        const comment = await prismaClient.comment.create({
            data: {
                content,
                tweet: { connect: { id: tweetId } },
                author: { connect: { id: ctx.user.id } }
            }
        });

        return comment;
    },

    deleteComment: async (_: any, { commentId }: { commentId: string }, ctx: GraphqlContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const comment = await prismaClient.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            throw new Error("Comment not found");
        }

        if (comment.authorId !== ctx.user.id) {
            throw new Error("You are not authorized to delete this comment");
        }

        await prismaClient.comment.delete({ where: { id: commentId } });

        return true;
    },

    bookmarkTweet: async (_: any, { tweetId }: { tweetId: string }, ctx: GraphqlContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const tweet = await prismaClient.tweet.findUnique({ where: { id: tweetId } });
        if (!tweet) {
            throw new Error("Tweet not found");
        }

        const existingBookmark = await prismaClient.bookmarks.findUnique({
            where: {
                userId_tweetId: {
                    userId: ctx.user.id,
                    tweetId
                }
            }
        });

        if (existingBookmark) {
            throw new Error("Tweet already bookmarked");
        }

        await prismaClient.bookmarks.create({
            data: {
                user: { connect: { id: ctx.user.id } },
                tweet: { connect: { id: tweetId } },
            }
        });

        return tweet;
    },

    unbookmarkTweet: async (_: any, { tweetId }: { tweetId: string }, ctx: GraphqlContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const tweet = await prismaClient.tweet.findUnique({ where: { id: tweetId } });
        if (!tweet) {
            throw new Error("Tweet not found");
        }

        const existingBookmark = await prismaClient.bookmarks.findUnique({
            where: {
                userId_tweetId: {
                    userId: ctx.user.id,
                    tweetId
                }
            }
        });

        if (!existingBookmark) {
            throw new Error("Tweet not bookmarked");
        }

        await prismaClient.bookmarks.delete({
            where: {
                userId_tweetId: {
                    userId: ctx.user.id,
                    tweetId
                }
            }
        });

        return tweet;
    }
};

const extraResolvers = {
    Tweet: {
        author: (parent: Tweet) => {
            return prismaClient.user.findUnique({ where: { id: parent.authorId } });
        },
        likes: (parent: Tweet) => {
            return prismaClient.likes.findMany({
                where: { tweetId: parent.id },
                include: { user: true }
            }).then(likes => likes.map(like => like.user));
        },
        comments: (parent: Tweet) => {
            return prismaClient.comment.findMany({
                where: { tweetId: parent.id },
                include: { author: true }
            });
        }
    }
};

export const resolvers = { mutations, extraResolvers, queries };
