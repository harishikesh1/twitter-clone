import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BiBookmark, BiHeart, BiMessageRounded } from "react-icons/bi";
import { FaBookmark, FaHeart, FaRetweet } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";
import { useLikeTweet, useBookmarkTweet, useCheckIfBookmarked, useAddComment, useDeleteComment } from "../../hooks/tweet";

interface FeedCardProps {
    data: Tweet;
    currentUserId: string;
}

const Card: React.FC<FeedCardProps> = (props) => {
    const { data, currentUserId } = props;
    const [isLiked, setIsLiked] = useState<boolean>(
        data.likes?.some(like => like?.id === currentUserId) || false
    );
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [commentContent, setCommentContent] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { toggleLike } = useLikeTweet();
    const { mutate: bookmarkTweet } = useBookmarkTweet();
    const { mutate: addComment } = useAddComment();
    const { mutate: deleteComment } = useDeleteComment();

    const { data: isBookmarkedData } = useCheckIfBookmarked(data.id, currentUserId);

    useEffect(() => {
        if (isBookmarkedData !== undefined && isBookmarkedData !== null) {
            setIsBookmarked(!!isBookmarkedData);
        }
    }, [isBookmarkedData]);

    const handleLike = async () => {
        if (data.id) {
            await toggleLike(data.id, isLiked);
            setIsLiked(!isLiked);
        }
    };

    const handleBookmark = async () => {
        if (data.id) {
            await bookmarkTweet({ tweetId: data.id, userId: currentUserId, isBookmarked });
            setIsBookmarked(!isBookmarked);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (commentContent.trim() && data.id) {
            await addComment({ tweetId: data.id, content: commentContent });
            setCommentContent("");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        await deleteComment({ commentId });
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };


    return (
        <div className="grid grid-cols-12 gap-2 border-b border-border-color p-3 hover:bg-[rgba(28,28,28,0.21)] transition-colors cursor-pointer">
            <div className="col-span-1">
                {data.author?.profileImageURL && <Image className="rounded-full" src={data.author?.profileImageURL} alt="user-image" height={50} width={50} />}
            </div>
            <div className="col-span-11">
                <h5>
                    <Link href={`/${data.author?.id}`}>
                        {data.author?.firstName} {data.author?.lastName}
                    </Link>
                </h5>
                <p>{data.content}</p>
                {data.imageURL && (
    <Image
        priority
        style={{
            width: '100%',
            height: 'auto'
        }}
        src={data.imageURL || ""}
        width={400}
        height={400}
        alt=""
    />
)}
    

                <div className="flex mt-2 text-xl justify-between text-[rgb(113,118,123)]">
                    <div>
                        <span className="flex items-center gap-1 cursor-pointer" onClick={focusInput}>
                            <BiMessageRounded />
                            {data.comments?.length}
                        </span>
                    </div>
                    <div>
                        <FaRetweet />
                    </div>
                    <div>
                        <span className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
                            {isLiked ? <FaHeart color="white" /> : <BiHeart />}
                            {data.likes?.length}
                        </span>
                    </div>
                    <div className="flex">
                        <div className="mx-3 cursor-pointer" onClick={handleBookmark}>
                            {isBookmarked ? <FaBookmark /> : <BiBookmark />}
                        </div>
                        <div>
                            <Link href={`/tweet/${data.id}`}>
                                <FiUpload />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    {data.comments?.map((comment) => {
                        if (!comment || !comment.id) return null; // Skip rendering if comment or id is missing

                        return (
                            <div
                                key={comment.id}  // Ensure this is unique and defined
                                className="flex justify-between items-center border-b border-border-color py-2"
                            >
                                <div>
                                    <div className="flex justify-between items-center gap-2 py-1">
                                        <Image
                                            src={comment.author?.profileImageURL || ""}
                                            width={25}
                                            height={25}
                                            alt="author-image"
                                            className="rounded-full"
                                        />
                                        <small className="text-gray-500 text-xs">
                                            {comment.author?.firstName} {comment.author?.lastName}
                                        </small>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                                {comment.author?.id === currentUserId && (
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-red-400"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>


            </div>
        </div>
    );
};

export default Card;
