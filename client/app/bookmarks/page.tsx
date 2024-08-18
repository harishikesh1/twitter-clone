"use client";



import React, { useEffect, useState } from "react";
import Twitterlayout from "@/components/layout/TwitterLayout";
import { useGetBookmarksWithDetails, useTweetById } from "@/hooks/tweet";
import Card from "@/components/Card";
import {jwtDecode} from 'jwt-decode';

interface TweetComponentProps {
  params: {
    id: string;
  };
}

interface TokenPayload {
  id: string; // Adjust according to your token payload
}

const TweetComponent: React.FC<TweetComponentProps> = ({ params }) => {
  const { bookmarks, isLoading, error } = useGetBookmarksWithDetails();
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("__twitter_token");
      if (token) {
        const decodedToken = jwtDecode<TokenPayload>(token);
        setCurrentUserId(decodedToken.id);
      } else {
        setCurrentUserId(null);
      }
    } catch (err) {
      console.error('Failed to decode token', err);
      setCurrentUserId(null);
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!bookmarks || bookmarks.length === 0) return <div>No tweets found</div>;

  return (
    <div className="max-w-[1400px] mx-auto">

    <Twitterlayout>
      {currentUserId !== null && bookmarks.map((bookmark) => (
        <Card 
          key={bookmark.tweet.id} 
          currentUserId={currentUserId} 
          data={bookmark.tweet} 
        />
      ))}
    </Twitterlayout>
    </div>
  );
};


export default TweetComponent;
