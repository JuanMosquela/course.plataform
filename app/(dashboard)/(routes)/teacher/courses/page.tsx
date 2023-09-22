"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <section className="p-6">
      <Link href="/teacher/create">
        <Button>Add Course</Button>
      </Link>
    </section>
  );
};

export default page;
