import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession } from "next-auth/react"
import { GetServerSideProps } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Course, Lesson, Video } from '@prisma/client'
import Link from 'next/link'
import CourseGrid from 'components/CourseGrid'

import Heading from 'components/Heading'

type AdminIndexPageProps = {
  session: Session;
  courses: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })[]
}

const AdminIndex: NextPage<AdminIndexPageProps> = ({ courses }) => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <Heading>Admin</Heading>

        <h2>Your courses</h2>

        {courses.length > 0 ? (
          <CourseGrid courses={courses} isAdmin />
        ) : (
          <div>
            <h1>No courses.</h1>
          </div>
        )}

        <Link href="/admin/courses/new">
          <a className='bg-slate-700 text-white px-4 py-3 rounded my-4 inline-block'>Create a course</a>
        </Link>
      </>
    )
  }
  return <p>Access Denied</p>
}

export default AdminIndex

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const courses = await prisma.course.findMany({
    where: {
      author: {
        id: session.user?.id
      }
    },
    include: {
      lessons: {
        include: {
          video: true
        }
      }
    }
  })

  return {
    props: {
      session,
      courses
    },
  }
}