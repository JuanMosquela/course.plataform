import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const { title } = await request.json();

    if (!userId) {
      return new NextResponse("Unahotorized", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(
      { message: "Course created successfully", course },
      { status: 200 }
    );
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
