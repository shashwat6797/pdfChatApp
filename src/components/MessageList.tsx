"use client";
import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import Markdown from "react-markdown";
import React from "react";

type Props = {
  messages: Message[];
};

const MessageList = ({ messages }: Props) => {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 my-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-500 text-white": message.role === "user",
                  "bg-blue-100 text-black": message.role === "system",
                }
              )}
            >
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
