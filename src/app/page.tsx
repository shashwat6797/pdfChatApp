import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from "lucide-react";
import UploadFile from "@/components/ui/UploadFile";
import axios from "axios";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  const goToChat = async () => {
    try {
      axios.get("/api/get-chat");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-purple-400 to-yellow-200">
      <div className="fixed top-0 left-0 flex items-center justify-between p-2 md:hidden w-screen">
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
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF.</h1>
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
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <UploadFile></UploadFile>
            ) : (
              <Link href={"/sign-in"}>
                <Button>
                  Login to get Started!
                  <LogIn className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
