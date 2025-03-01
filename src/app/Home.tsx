import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from "lucide-react";
import UploadFile from "@/components/ui/UploadFile";
import axios from "axios";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import panelImg from "../../public/PDF_PANEL.png";


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
                    <p className="max-w-xl sm:max-w-sm mt-1 px-5 text-lg text-slate-600">
                        Join to instantly answer questions and understand research with AI
                    </p>
                    <img src={panelImg} alt="panel" />
                    <div className="w-full mt-4">
                        {isAuth ? (
                            <UploadFile></UploadFile>
                        ) : (
                            <div className="flex justify-center flex-col gap-2">
                                <p className="font-bebas_neue text-2xl font-semibold">
                                    Login to get Started!
                                </p>
                                <Link href={"/sign-in"}>
                                    <Button>
                                        <LogIn className="w-7 h-7" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

