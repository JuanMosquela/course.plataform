"use client";

import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Chapter, Course } from "@prisma/client";
import ChaptersList from "./ChaptersList";

const formSchema = z.object({
  title: z.string().min(1, "This field is required"),
});

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter updated");
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onRedorder = async (
    updatedData: { id: string; position: number }[]
  ) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updatedData,
      });

      toast.success("Chapters reorder");
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong`);
    } finally {
      setIsUpdating(false);
      router.refresh();
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative border rounded-md bg-slate-100 mt-6 p-4">
      {isUpdating && (
        <div className="absolute h-full w-full flex justify-center items-center top-0 left-0 bg-slate-500/20 rounded-md">
          <Loader2 className="animate-spin text-sky-700 w-6 h-6" />
        </div>
      )}
      <div className="flex items-center justify-between ">
        <h4>Course Chapters</h4>
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course ...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isSubmitting || !isValid} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <>
          <div
            className={cn(
              "text-sm mt-2",
              !initialData.chapters && "text-slate-500 italic"
            )}
          >
            {!initialData?.chapters?.length && "No chapters"}
            <ChaptersList
              items={initialData.chapters || []}
              onReorder={onRedorder}
              onEdit={onEdit}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reaorder the chapters
          </p>
        </>
      )}
    </div>
  );
};

export default ChaptersForm;
