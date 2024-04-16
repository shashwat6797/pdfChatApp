// /api/create-chat
import { loadFirebaseIntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { file_name } = body;
    const pages = await loadFirebaseIntoPinecone(file_name);
    return NextResponse.json({ mssg: "chat created", pages: pages });
  } catch (error) {
    console.error({ create_chat: error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
