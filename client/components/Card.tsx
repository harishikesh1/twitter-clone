import React from "react";
import Image from "next/image";
import { BiBookmark, BiHeart, BiMessageRounded, BiRepost, BiUpload } from "react-icons/bi";
// import { FaRetweet } from "react-icons/fa6";
import { LiaRetweetSolid } from "react-icons/lia";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRetweet } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
const Card: React.FC = () => {
   return <>
      <div className="grid grid-cols-10 gap-2 border-b border-border-color p-3 hover:bg-[rgba(28,28,28,0.21)] transition-colors cursor-pointer">
         <div className="col-span-1">
            <Image src={`https://avatars.githubusercontent.com/u/8079861`} alt="use-image" height={50} width={50} />
         </div>
         <div className="col-span-9">
            <h5>elon musk</h5>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio sint nulla non magnam culpa! Suscipit neque nemo repellendus sequi quod cupiditate facilis quam, .</p>
        

         <div className="flex text-xl justify-between text-[rgb(113,118,123)]">
            <div>
               <BiMessageRounded />
            </div>
            <div>
            
               <div >
               <FaRetweet />
             
               </div>
            </div>
            <div>
               <BiHeart />
            </div>
            <div className="flex ">

            <div className="mx-3">
            <BiBookmark />
            </div>
            <div>
            <FiUpload />
            </div>
            </div>

             </div>
         </div>
      </div>
   </>
}

export default Card;
