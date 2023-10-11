import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized");
    }

    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    if (course) {
      return NextResponse.json(
        { message: "Course created", course },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
