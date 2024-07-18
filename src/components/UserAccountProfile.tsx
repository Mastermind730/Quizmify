"use client";
import React from "react";
import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import UserAvatar from "./UserAvatar";
interface UserAccountProfileProps {
  user: Pick<User, "name" | "image" | "email">;
//   user: User
}

const UserAccountProfile: React.FC<UserAccountProfileProps> = ({ user }) => {
    // console.log(user)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="dark:text-white" href={"/"}>Hallo!</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          
          onClick={(e) => {
            e.preventDefault();
            signOut().catch(console.error)}}
            className="text-red-600 cursor-pointer"
        >

          Sign Out{" "}
          <LogOut className=" mx-1w-4 h-4"/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountProfile;
