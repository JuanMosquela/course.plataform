import React from "react";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard } from "lucide-react";
import TitleForm from "@/components/TitleForm";
import { auth } from "@clerk/nextjs";
import DescriptionForm from "@/components/DescriptionForm";
import { ImageForm } from "@/components/ImageForm";

const page = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const { userId } = auth();

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    return redirect("/");
  }

  console.log(course);

  const fields = [
    course.title,
    course.price,
    course.image,
    course.description,
    course.categoryId,
  ];

  const totalFields = fields.length;

  const completedFields = fields.filter((field) => field).length;

  return (
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields ({completedFields}/{totalFields})
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={courseId} />
          <DescriptionForm initialData={course} courseId={courseId} />
          <ImageForm initialData={course} courseId={courseId} />
        </div>
      </div>
    </section>
  );
};

export default page;
