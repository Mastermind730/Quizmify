import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import { stringify } from "querystring";
import React from "react";
import SignInButton from "./SignInButton";
import UserAccountProfile from "./UserAccountProfile";
type Props = {};
const Navbar = async (props: Props) => {
  const session = await getAuthSession();
  console.log(session?.user)
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-between h-full gap-2 px-6 mx-auto max-w-7xl">
        <Link href={"/"} className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 text-xl font-bold transition-all hover:translate-y-[2px] md:block dark:border-white">
            Quizmify
          </p>
        </Link>

        <div className="flex items-center">
          {session?.user ? (
            <UserAccountProfile user={session.user}/>
) : (
            <SignInButton text="Sign In" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
