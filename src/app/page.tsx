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
    <div className="w-screen h-screen bg-gradient-to-r from-purple-400 to-yellow-200 overflow-y-scroll flex flex-col items-center">
      <div className="sticky top-0 left-0 flex items-center justify-between p-8 md:hidden w-screen">
        <div className="flex">
          {isAuth && (
            <Link href={"/chat/1"}>
              <Button>Go to Chats</Button>
            </Link>
          )}
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="text-7xl mt-10 font-semibold font-bebas_neue">
        <TypewriterEffectSmooth words={words} />
      </div>
      <div className="w-[60%]">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center mt-5">
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
          <div className="container  p-4">
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
