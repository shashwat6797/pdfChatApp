import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from "lucide-react";
import UploadFile from "@/components/ui/UploadFile";
import axios from 'axios'

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  const goToChat = async () => {
    try{
      axios.get('/api/get-chat')
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-purple-400 to-yellow-200">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF.</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-2">
            {isAuth && <Button >Go to Chats</Button>}
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
