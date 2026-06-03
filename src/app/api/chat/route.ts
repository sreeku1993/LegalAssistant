import { NextResponse } from "next/server";
import { chat } from "@/chat/chat";

export async function POST(
  req: Request
) {
  try {
    const { message } =
      await req.json();

    if (!message) {
      return NextResponse.json(
        {
          error: "Message required",
        },
        { status: 400 }
      );
    }

    const result =
      await chat(message);

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}