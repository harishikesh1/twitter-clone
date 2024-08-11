import Image from "next/image";
import { BiHomeAlt } from "react-icons/bi";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { RiNotification4Line } from "react-icons/ri";
import { MdMailOutline } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";
import { HiOutlineUser } from "react-icons/hi";
import Card from "../components/Card";
interface TwitterIcon {
  title: string;
  icon: React.ReactNode;
}

const sideBarIcons: TwitterIcon[] = [
  {
    title: "Home",
    icon: <BiHomeAlt />
  },
  {
    title: "Explore",
    icon: <IoSearch />
  },
  {
    title: "Notification",
    icon: <RiNotification4Line />
  },
  {
    title: "Message",
    icon: <MdMailOutline />
  },
  {
    title: "Bookmarks",
    icon: <FaRegBookmark />
  },
  {
    title: "Profile ",
    icon: <HiOutlineUser />
  },

]

export default function Home() {
  return (
    // <div className="max-w-[1325px] mx-auto"> 
    <div className="max-w-[1400px] mx-auto">
    <div className="grid grid-cols-12 h-screen  ">
      <div className="col-span-3 px-4 ml-12 ">
        <div className="text-3xl hover:bg-hover-color transition-colors rounded-full  p-3 w-fit h-fit">
          <FaXTwitter />
        </div> 
        <div className="mt-4 text-xl font-light">
          <ul>
            {sideBarIcons.map((item) => (
              <li
                className="flex justify-start items-center gap-2 hover:bg-hover-color transition-colors rounded-full w-fit px-2 py-2 mt-2"
                key={item.title}
              >
                <span className="pr-3">{item.icon}</span>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
          <button className="bg-[rgb(29,155,240)] mt-6 text-white font-semibold py-3 px-6  rounded-full hover:bg-[rgb(26,129,197)] transition-colors w-full">
            Post
          </button>
        </div>
      </div>
      <div className="col-span-5 border-r border-l border-border-color overflow-scroll">
        <Card/>
        <Card/>
        <Card/>
        <Card/>
      </div>
      <div className="col-span-3 bg-fuchsia-800">ggg</div>
    </div>
    </div>

  );
}