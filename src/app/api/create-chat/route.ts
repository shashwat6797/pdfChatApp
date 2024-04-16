// /api/create-chat
import { loadFirebaseIntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { getFirebaseURL } from "@/lib/firebase-server";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_name, file_key } = body;
    const pages = await loadFirebaseIntoPinecone(file_name);
    const pdfURL = await getFirebaseURL(file_name);
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: pdfURL,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });
    return NextResponse.json(
      { chat_id: chat_id[0].insertedId },
      { status: 200 },
    );
  } catch (error) {
    console.error({ create_chat: error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
