import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const page = async ({ params } : { params: { courseId : string }}) =>{
    const { courseId } = params
    const {userId} = auth()
    

    if(!userId){
        throw new Error("Not authenticated")
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId
        },
        include: {
            chapters: {
              where: {
                isPublished: true,
              },
              orderBy: {
                position: "asc"
              }
            }
        }
    })

    if (!course) {
        return redirect("/");
      }
   
     return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}

export default page