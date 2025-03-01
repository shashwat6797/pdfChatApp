import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from "lucide-react";
import UploadFile from "@/components/ui/UploadFile";
import axios from "axios";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "@/components/ui/typewriter-effect";
import LoadingComponent from "@/components/LoadingComponent";

export default async function Home() {
  const { userId } = auth();
  const isAuth = !!userId;

  const goToChat = async () => {
    try {
      axios.get("/api/get-chat");
    } catch (err) {
      console.log(err);
    }
  };

  const words = [
    { text: "Chat ", className: "text-5xl sm:text-7xl" },
    { text: "with ", className: "text-5xl sm:text-7xl" },
    {
      text: "PDF",
      className: "text-blue-500 dark:text-blue-500 text-5xl sm:text-7xl",
    },
  ];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-purple-400 to-yellow-200 overflow-y-scroll flex flex-col items-center">
      <div className="fixed top-0 left-0 flex items-center justify-between p-8 md:hidden w-screen">
        <div className="flex">
          {isAuth && (
            <Link href={"/chat/1"}>
              <Button>Go to Chats</Button>
            </Link>
          )}
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="absolute px-2 md:px-0 top-1/2 sm:left-1/2 sm:-translate-x-1/2 -translate-y-2/3 md:-translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-7xl font-semibold font-bebas_neue">
              <TypewriterEffectSmooth words={words} className="max-w-sm" />
            </h1>
            <div className="hidden md:block">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
          <div className="md:flex mt-2 hidden">
            {isAuth && (
              <Link href={"/chat/2"}>
                <Button>Go to Chats</Button>
              </Link>
            )}
          </div>
          <div className="container mx-auto p-4">
            {!isAuth && <LoadingComponent />}
          </div>
          <div className="w-full mt-4">
            {isAuth && <UploadFile></UploadFile>}
          </div>
        </div>
      </div>
    </div>
  );
}
