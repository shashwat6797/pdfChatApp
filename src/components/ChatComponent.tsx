"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send, Menu } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import ChatSidebar from "./ChatSidebar";
type Props = { chatId: number; _chats: any };

const ChatComponent = ({ chatId, _chats }: Props) => {
  const [isSidebar, setIsSidebar] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const openSidebar = () => {
    setIsSidebar(!isSidebar);
    console.log("working");
  };

  return (
    <div>
      {isSidebar ? (
        <ChatSidebar chats={_chats} chatId={chatId} />
      ) : (
        <div className="relative flex flex-col justify-between h-screen overflow-hidden">
          {/*Header*/}
          <div className="sticky p-2  top-0 inset-x-0 bg-gray-900 h-fit flex items-center justify-between">
            <h1 className="text-xl flex items-center font-bold text-gray-200">
              Chat
            </h1>
            <Button onClick={openSidebar}>
              <Menu />
            </Button>
          </div>

          {/*messages list*/}
          <div
            id="message-container"
            className="flex bg-slate-200 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500"
          >
            <MessageList messages={messages} />
          </div>

          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="sticky bottom-0 inset-x-0 px-2 py-4 bg-gray-900 flex mt-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="chat with the pdf"
              className="w-full"
            />
            <Button className="bg-blue-600 ml-2">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
