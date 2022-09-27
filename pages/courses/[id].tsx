import type { GetStaticProps, GetStaticPaths } from 'next'
import type { Course, Lesson, Video } from "@prisma/client"
import { prisma } from 'utils/prisma'
import CourseOverview from 'components/CourseOverview'
import CourseViewer from 'components/CourseViewer'
import Nav from 'components/Nav'
import { useSession, signIn } from "next-auth/react"
import Link from 'next/link'
import type { ReactElement } from 'react'
import type { NextPageWithLayout } from 'pages/_app'

type ViewCoursePageProps = {
  course: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })
}

const ViewCourse: NextPageWithLayout<ViewCoursePageProps> = ({ course }) => {
  const { data: session } = useSession()

  return (
    <>
      {session ? (
        <CourseViewer course={course} />
      ) : (
        <main className='mx-auto max-w-full md:max-w-6xl min-h-screen'>
          <a className='bg-slate-800 text-white w-full p-4 rounded-lg block cursor-pointer mb-8' onClick={() => signIn()}>Sign in to view this course</a>
          <CourseOverview course={course} />
        </main>
      )}
    </>
  )
}

ViewCourse.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Nav />
      {page}
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