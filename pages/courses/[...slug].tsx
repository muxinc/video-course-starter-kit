import type { ReactElement } from 'react'
import { useState } from 'react'
import type { GetServerSideProps } from 'next'
import type { Course, Lesson, Video } from "@prisma/client"
import { prisma } from 'utils/prisma'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import Link from 'next/link'
import type { NextPageWithLayout } from 'pages/_app'
import CourseViewer from 'components/CourseViewer'
import Nav from 'components/Nav'
import Banner from 'components/Banner'

type ViewCoursePageProps = {
  course: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  });
  completedLessons: number[];
}

const ViewCourse: NextPageWithLayout<ViewCoursePageProps> = ({ course, completedLessons }) => {
  const { data: session } = useSession()
  const [lessonProgress, setLessonProgress] = useState(completedLessons)

  return (
    <>
      {!session && (
        <Banner>
          <p className='text-center'>
            <Link href='/api/auth/signin'>
              <a className='underline'>Sign in</a>
            </Link> to track your progress &rarr;{' '}
          </p>
        </Banner>
      )}
      <CourseViewer course={course} lessonProgress={lessonProgress} setLessonProgress={setLessonProgress} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  const id = context?.query?.slug?.[0]
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
    return { notFound: true }
  }

  if (course.published === false && course.authorId !== session?.user?.id) {
    return { notFound: true }
  }

  const completedLessons = await prisma.userLessonProgress.findMany({
    where: {
      userId: session?.user?.id,
      lessonId: {
        in: course.lessons.map(lesson => lesson.id)
      }
    }
  }).then(progress => progress.map(p => p.lessonId))

  return {
    props: {
      session,
      course,
      completedLessons
    },
  }
}
