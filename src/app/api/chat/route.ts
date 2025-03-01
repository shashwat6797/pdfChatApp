import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    "AIzaSyAd9AVriWB1VifkQjH5UezmsRADXEi-wzw"
);

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    })),
});
// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
  if (_chats.length != 1) {
    return NextResponse.json({ error: "chat not found" }, { status: 404 });
  }
  const fileKey = _chats[0].pdfName;
  const lastMessage = messages[messages.length - 1];
  const context = await getContext(lastMessage.content, fileKey);

  const prompt = {
    role: "system",
    content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation and answer the question ${lastMessage.content}.
      AI will not talk about referencing the context as it is understood that it is creating a response only after considering the context provided and not inventing things.
      AI will respond in markdown format with proper headings, subheading and points as needed.
      `,
  };

  const geminiStream = await genAI
    .getGenerativeModel({ model: "gemini-pro" })
    .generateContentStream(prompt.content);

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream, {
    onStart: async () => {
      // save user message into db
      await db.insert(_messages).values({
        chatId,
        content: lastMessage.content,
        role: "user",
      });
    },
    onCompletion: async (completion) => {
      // save ai message into db
      await db.insert(_messages).values({
        chatId,
        content: completion,
        role: "system",
      });
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
