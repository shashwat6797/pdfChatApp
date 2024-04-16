import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import ChatSidebar from "@/components/ChatSidebar";
import { eq } from "drizzle-orm";
import PdfViewer from "@/components/PdfViewer";

type Props = {
  params: [chatId: string];
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex max-h-screen ">
      <div className="flex max-h-screen w-full">
        {/*Sidebar*/}
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        <div className="flex-[5]">
          <PdfViewer pdfUrl={currentChat?.pdfUrl || ''} />
        </div>
        <div className="flex-[3] overflow-y-scroll">world</div>
      </div>
    </div>
  );
};

export default ChatPage;
