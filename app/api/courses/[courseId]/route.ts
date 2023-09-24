import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized user", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(
      { message: "Course updated successfully", course },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
