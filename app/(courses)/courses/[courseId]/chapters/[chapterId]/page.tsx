import { getChapter } from "@/actions/get-chapters";
import { Banner } from "@/components/Banner";
import { CourseEnrollButton } from "@/components/CourseEnrollButton";
import { Preview } from "@/components/Preview";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs";
import { File } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { chapterId, courseId } = params;
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const {
    chapter,
    course,
    attachments,
    muxData,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({ userId, courseId, chapterId });

  if (!chapter || !course) {
    redirect("/");
  }
  const isLocked = !chapter.isFree && !purchase;
  const completedOnEnd = !!purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this course" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="Your need to purchase this course to watch this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl max-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completedOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              // <CourseProgressButton
              //   chapterId={params.chapterId}
              //   courseId={params.courseId}
              //   nextChapterId={nextChapter?.id}
              //   isCompleted={!!userProgress?.isCompleted}
              // />
              "progreso"
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
