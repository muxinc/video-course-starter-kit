import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import type { Course, Lesson, Video } from "@prisma/client"
import { prisma } from 'utils/prisma'
import Heading from 'components/Heading'
import CourseOverview from 'components/CourseOverview'
import CourseViewer from 'components/CourseViewer'
import { useSession, signIn } from "next-auth/react"
import Link from 'next/link'

type ViewCoursePageProps = {
  course: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })
}

const ViewCourse: NextPage<ViewCoursePageProps> = ({ course }) => {
  const { data: session } = useSession()

  return (
    <>
      <Heading>{course.name}</Heading>

      {session ? (
        <CourseViewer course={course} />
      ) : (
        <>
          <a onClick={() => signIn()}>Sign in to view this course</a>
          <CourseOverview course={course} />
        </>
      )}
    </>
  )
}

export default ViewCourse

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context?.params?.id
  if (typeof id !== "string") { throw new Error('missing id') };

  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: {
      lessons: {
        include: {
          video: true
        }
      }
    },
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