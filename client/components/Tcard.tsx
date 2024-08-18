import React from "react";
import Image from "next/image";
import { BiBookmark, BiHeart, BiMessageRounded, BiRepost, BiUpload } from "react-icons/bi";
// import { FaRetweet } from "react-icons/fa6";
import { LiaRetweetSolid } from "react-icons/lia";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRetweet } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProps {
   data: Tweet
}


const Tcard: React.FC<FeedCardProps> = (props) => {
   const { data } = props;
   console.log(data);

   return <>
      <div className="grid grid-cols-12 gap-2 border-b border-border-color p-3 hover:bg-[rgba(28,28,28,0.21)] transition-colors cursor-pointer">
         <div className="col-span-1">
            {data.author?.profileImageURL && <Image className="rounded-full" src={data.author?.profileImageURL} alt="use-image" height={50} width={50} />}
         </div>
         <div className="col-span-11">
            <h5>
               <Link href={`/${data.author?.id}`}>
                  {data.author?.firstName} {data.author?.firstName}
               </Link>

            </h5>
            <p>{data.content}</p>
            {data.imageURL && <Image priority src={data.imageURL || ""} layout="responsive" width={400} height={400} alt="" />}


            <div className="flex mt-2 text-xl justify-between text-[rgb(113,118,123)]">
               <div>

                  <span className="flex items-center gap-1">

                     <BiMessageRounded />
                     {data.comments?.length}
                  </span>
               </div>
               <div>

                  <div >
                     <FaRetweet />

                  </div>
               </div>
               <div>
                  <span className="flex items-center gap-1">

                     <BiHeart />
                     {data.likes?.length}
                  </span>
               </div>
               <div className="flex ">

                  <div className="mx-3">
                     <BiBookmark />
                  </div>
                  <div>
                     <Link href={`/tweet/${data.id}`}>
                     <FiUpload />
                     </Link>
                  </div>
               </div>

            </div>
         </div>
      </div>
   </>
}

export default Tcard;
