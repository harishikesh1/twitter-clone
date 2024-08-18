import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Card from "../Card";
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
import Link from "next/link";

interface TwitterIcon {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface VerifyGoogleTokenResponse {
  verifyGoogleToken: string;
}

interface TwitterlayoutProps {
  children: React.ReactNode;
}

const Twitterlayout: React.FC<TwitterlayoutProps> = (props) => {
  const { user, isLoading, error } = userCurrentUser();
  const sideBarIcons: TwitterIcon[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeAlt />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <IoSearch />,
        link: "/",
      },
      {
        title: "Notification",
        icon: <RiNotification4Line />,
        link: "/",
      },
      {
        title: "Message",
        icon: <MdMailOutline />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <FaRegBookmark />,
        link: "/bookmarks",
      },
      {
        title: "Profile",
        icon: <HiOutlineUser />,
        link: `/${user?.id}`,
      },
    ],
    [user?.id]
  );

  const queryClient = useQueryClient();

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) {
        return toast.error("Google error");
      }

      try {
        const verifyUser = await graphQLClient.request<VerifyGoogleTokenResponse>(
          VerifyGoogleToken,
          { token: googleToken }
        );
        const { verifyGoogleToken } = verifyUser;

        if (verifyGoogleToken) {
          toast.success("Verified Google account");
          localStorage.setItem("__twitter_token", verifyGoogleToken);
          const token = localStorage.getItem("__twitter_token");
          graphQLClient.setHeader("authorization", `Bearer ${token}`);

          queryClient.invalidateQueries(["current-user"] as any);
          queryClient.refetchQueries(["current-user"] as any);
        }
      } catch (error) {
        toast.error("Verification failed");
      }
    },
    [queryClient]
  );

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-2 sm:col-span-3 sm:px-4 flex sm:justify-end relative">
        <div>
          <div className="text-3xl hover:bg-hover-color transition-colors rounded-full sm:p-3 w-fit h-fit">
            <FaXTwitter />
          </div>
          <div className="mt-4 text-xl font-light">
            <ul>
              {sideBarIcons.map((item) => (
                <li key={item.title}>
                  <Link
                    className="flex justify-start items-center gap-2 hover:bg-hover-color transition-colors rounded-full w-fit px-2 py-2 mt-2"
                    href={item.link}
                  >
                    <span className="pr-3">{item.icon}</span>
                    <span className="hidden sm:inline">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button className="hidden sm:block bg-[rgb(29,155,240)] mt-6 text-white font-semibold py-3 px-6 rounded-full hover:bg-[rgb(26,129,197)] transition-colors w-full">
              Post
            </button>
            <button className="block sm:hidden bg-[rgb(29,155,240)] mt-6 text-white font-semibold px-3 py-1 rounded-full hover:bg-[rgb(26,129,197)] transition-colors">
              <FaXTwitter />
            </button>
          </div>
        </div>

        {user && (
          <div className="mt-5 absolute bottom-5 flex gap-2 bg-hover-color p-2 rounded-full mr-2">
            {user.profileImageURL && (
              <Image
                className="rounded-full"
                src={user.profileImageURL}
                alt="user"
                width={50}
                height={50}
              />
            )}
            <div className="hidden sm:block overflow-hidden">
              <h3 className="font-semibold">{user.firstName}</h3>
              <h3 className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {user.email}
              </h3>
            </div>
          </div>
        )}
      </div>

      <div
        className="col-span-10 sm:col-span-5 border-r border-l border-border-color overflow-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        {props.children}
      </div>
      <div className="col-span-0 sm:col-span-3 p-5">
        {error || isLoading ? (
          <div className="p-5 rounded-lg">
            <h2 className="my-2 text-2xl">New to Twitter</h2>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        ) : !user ? (
          <div className="p-5 rounded-lg">
            <h2 className="my-2 text-2xl">New to Twitter</h2>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        ) : (
          <div className="px-4 py-3 bg-gray-950 rounded-lg">
            <h1 className="my-2 text-2xl mb-5">Users you may know</h1>
            {user?.recommendedUsers?.map((el) => (
              <div className="flex items-center gap-3 mt-2" key={el?.id}>
                {el?.profileImageURL && (
                  <Image
                    src={el?.profileImageURL}
                    alt="user-image"
                    className="rounded-full"
                    width={60}
                    height={60}
                  />
                )}
                <div>
                  <div className="text-lg">{el?.firstName}</div>
                  <Link
                    href={`/${el?.id}`}
                    className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Twitterlayout;
