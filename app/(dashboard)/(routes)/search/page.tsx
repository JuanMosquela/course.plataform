import { getCourses } from "@/actions/get-courses";
import Categories from "@/components/Categories";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import React from "react";
import { redirect} from 'next/navigation'
import CoursesList from "@/components/CoursesList";
import SearchInput from "@/components/SearchInput";

type SearchParamsProps = {
  searchParams: {

    title: string
    categoryId: string
  }
}

const page = async ( { searchParams } :  SearchParamsProps) => {

   const {userId} = await auth()

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if(!userId){
    return redirect("/")
  }

  const courses = await getCourses({ userId, ...searchParams })





  return (
    <>
    <div className="px-6 pt-6 md:hidden md:mb-0 block">
      <SearchInput />
    </div>
    <div className="p-6 space-y-4">
      <Categories
        categories={categories}
      />
      <CoursesList items={courses} />
    </div>
  </>
  );
};

export default page;
