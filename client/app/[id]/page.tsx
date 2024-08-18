"use client";

import React, { useCallback, useState } from "react";

import type { NextPage } from "next";
import Twitterlayout from "@/components/layout/TwitterLayout";
import { BsArrowLeftShort } from "react-icons/bs";
import { useGetUserById, userCurrentUser } from "@/hooks/user";
import Image from "next/image";
import Card from "@/components/Card";
import { Tweet } from "@/gql/graphql";
import { useMemo } from "react";
import { graphQLClient } from "@/client/api";
import {
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/users";
import { useQueryClient } from "@tanstack/react-query";


const UserProfilePage = ({ params }: { params: { id: string } }) => {
  const queryClient = useQueryClient();
  const { user } = useGetUserById(params.id)
  const { user: currentUser } = userCurrentUser()

  const amIFollowing = useMemo(() => {
    if (!user) return false;
    return (
      (currentUser?.following?.findIndex(
        (el: any) => el?.id === user?.id
      ) ?? -1) >= 0
    );
  }, [currentUser?.following, user]);

  const handleFollowUser = useCallback(async () => {
    if (!user?.id) return;

    await graphQLClient.request(followUserMutation, { to: user?.id });
    await queryClient.invalidateQueries(["curent-user"] as any);
  }, [user?.id, queryClient]);

  const handleUnfollowUser = useCallback(async () => {
    if (!user?.id) return;

    await graphQLClient.request(unfollowUserMutation, {
      to: user?.id,
    });
    await queryClient.invalidateQueries(["curent-user"] as any);
  }, [user?.id, queryClient]);


  return <>
   <div className="max-w-[1400px] mx-auto">
    <Twitterlayout>
      <div>
        <nav className="flex items-center gap-3 p-4">
          <BsArrowLeftShort className="text-4xl" />
          <div>
            <h1 className="text-2xl font-medium">{user?.firstName} {user?.lastName} </h1>
            <h1 className="text-md font-medium text-slate-400"><span className="text-slate-100"> {user?.tweets?.length}</span> tweets </h1>

          </div>
        </nav>

        <div className="p-4 border-b border-border-color">
          {user?.profileImageURL && <Image className="rounded-full" src={user?.profileImageURL} alt="user-image" width={100} height={100} />}
          <h1 className="text-2xl font-medium">{user?.firstName} {user?.lastName}</h1>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 mt-2 text-sm text-slate-400">
              <span><span className="text-slate-100"> {user?.follower?.length}</span> followers</span>
              <span><span className="text-slate-100">{user?.following?.length}</span> following</span>
            </div>
            {currentUser?.id !== user?.id && (
              <>
                {amIFollowing ? (
                  <button
                    onClick={handleUnfollowUser}
                    className="bg-white text-black px-3 py-1 rounded-full text-sm"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={handleFollowUser}
                    className="bg-white text-black px-3 py-1 rounded-full text-sm"
                  >
                    Follow
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          {currentUser?.id && user?.tweets?.map((tweet: any) => (
            <Card currentUserId={currentUser.id} data={tweet as Tweet} key={tweet?.id} />
          ))}

        </div>



      </div>
    </Twitterlayout>
    </div>
  </>
}



export default UserProfilePage;