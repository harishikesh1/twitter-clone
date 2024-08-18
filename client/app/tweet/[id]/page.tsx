"use client";

import React, { useEffect, useState } from "react";
import Twitterlayout from "@/components/layout/TwitterLayout";
import { useTweetById } from "@/hooks/tweet";
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
  const { tweet, isLoading, error } = useTweetById(params.id);
  
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
  if (!tweet) return <div>No tweet found</div>;
  console.log(currentUserId);
  
   
  return (
    <Twitterlayout>
      {currentUserId !== null && (
        <Card currentUserId={currentUserId} data={tweet} key={tweet.id} />
      )}
    </Twitterlayout>
  );
};

export default TweetComponent;
