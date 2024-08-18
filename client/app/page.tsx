"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Card from "../components/Card";
import toast, { Toaster } from "react-hot-toast";

import { BiHomeAlt, BiImageAlt, BiSmile } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { RiNotification4Line } from "react-icons/ri";
import { MdMailOutline } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";
import { HiOutlineUser } from "react-icons/hi";
import { graphQLClient } from "@/client/api";
import { VerifyGoogleToken } from "@/graphql/query/user";
import { userCurrentUser } from "@/hooks/user";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useGetAllTweets, useCreateTweet } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import Twitterlayout from "@/components/layout/TwitterLayout";
import { getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";

interface TwitterIcon {
  title: string;
  icon: React.ReactNode;
}

 

interface VerifyGoogleTokenResponse {
  verifyGoogleToken: string;
}

export default function Home() {
  const { user, isLoading, error } = userCurrentUser();
  const {tweets  = []}= useGetAllTweets()
  const queryClient = useQueryClient();
  const [content, setContent]= useState("")
const {mutate} =  useCreateTweet()

const [imageURL, setImageURL]= useState("")
 
const handleCreateTweet = useCallback(()=>{
mutate({
  content,
  imageURL
})
setContent("")
setImageURL("")


}, [content, mutate, imageURL])

 

  const handleFileInput = useCallback((input: HTMLInputElement)=>{
    return async (event: Event)=>{
      event.preventDefault()
       const file: File | null | undefined = input.files?.item(0)
       console.log(file);
      if (!file)  return;
      const {getSignedURLForTweet }  = await graphQLClient.request(getSignedURLForTweetQuery,{
        imageName: file.name,
        imageType: file.type.split("/")[1]
      })
      

      if (getSignedURLForTweet) {
        toast.loading('Uploading..', {id:'2'})
        await axios.put(getSignedURLForTweet, file,{
          headers:{
            "User-Agent": file.type
          }
        })
        toast.success("Upload Completed",{id:'2'})
        const url = new URL(getSignedURLForTweet)
        const myFilePath = `${url.origin}${url.pathname}`
        setImageURL(myFilePath)
        
      }
    }
  },[])

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.addEventListener("change", handleFileInput(input));
    input.click();
  }, [handleFileInput]);


  return (
    <div className="max-w-[1400px] mx-auto">
     <Twitterlayout>

     <div className="grid grid-cols-12 gap-2 border-b border-border-color p-3 hover:bg-[rgba(28,28,28,0.21)] transition-colors cursor-pointer">
    <div className="col-span-1">
      {user?.profileImageURL && <Image src={user?.profileImageURL} className=" rounded-full" alt="use-image" height={50} width={50} />}
    </div>
    <div className="col-span-11">
      <textarea 
       value={content}
        onChange={(e)=> setContent(e.target.value)}
         className="w-full bg-transparent text-2xl px-3 border-b border-b-hover-color" placeholder="What's happening" rows={2}>


      </textarea>
      {imageURL && <Image src={imageURL} alt="tweet-image" width={300} height={300} />}
      <div className="mt-2 flex justify-between items-center">
        <div className="flex">

          <BiImageAlt onClick={handleImageUpload}  className="text-xl  mx-2" />
          {"|"}
          <BiSmile className="text-xl  mx-2" />
        </div>
        <button onClick={handleCreateTweet} className="bg-[rgb(29,155,240)]  text-white font-semibold py-2 px-4 rounded-full hover:bg-[rgb(26,129,197)] transition-colors ">
          Tweet
        </button>
      </div>


    </div>
  </div>
  {user?.id && (
  tweets?.map(tweet => (
    <Card
      currentUserId={user.id}  
      key={tweet?.id}
      data={tweet as Tweet}
    />
  ))
)}


     </Twitterlayout>
    </div>
  );
}
