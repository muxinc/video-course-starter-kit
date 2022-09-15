import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image'
import type { Course } from "@prisma/client"
import { prisma } from 'utils/prisma'

type ViewCoursePageProps = {
  course: Course
}

const ViewCourse: NextPage<ViewCoursePageProps> = ({ course }) => {
  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        {course.name}
      </h1>
    </>
  )
}

export default ViewCourse

export const getStaticProps: GetStaticProps<ViewCoursePageProps> = async (context) => {
  const id = context?.params?.id
  if (typeof id !== "string") { throw new Error('missing id') };
  const course: Course | null = await prisma.course.findUnique({ where: { id: parseInt(id) } })

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