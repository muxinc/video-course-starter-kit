import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import type { Course, Lesson } from "@prisma/client"
import { prisma } from 'utils/prisma'

type ViewCoursePageProps = {
  course: (Course & {
    lessons: Lesson[];
  })
}

const ViewCourse: NextPage<ViewCoursePageProps> = ({ course }) => {
  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        {course.name}
      </h1>

      {course.lessons.map(lesson => (
        <div key={lesson.id}>
          <h2 className='text-xl'>{lesson.name}</h2>
          <p>{lesson.description}</p>
        </div>
      ))}
    </>
  )
}

export default ViewCourse

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context?.params?.id
  if (typeof id !== "string") { throw new Error('missing id') };

  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: { lessons: true },
  })

  if (!course) {
    return {
      notFound: true,
      revalidate: process.env.VERCEL_ENV !== "production" && 30,
    }
  }

  return {
    props: { course },
    revalidate: process.env.VERCEL_ENV !== "production" && 30,
  }
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});