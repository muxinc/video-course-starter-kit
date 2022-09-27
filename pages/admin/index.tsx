import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession, signIn, signOut } from "next-auth/react"
import { GetServerSideProps } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Course } from '@prisma/client'
import Link from 'next/link'

type AdminIndexPageProps = {
  session: Session;
  courses: Course[];
}

const AdminIndex: NextPage<AdminIndexPageProps> = ({ courses }) => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <h1 className="text-4xl font-bold">
          Admin
        </h1>

        <h2>Your courses</h2>

        {courses.length > 0 ? (
          <div>
            {courses.map(course => (
              <div key={course.id}>
                <Link href={`/admin/courses/${course.id}`}>
                  <a className='underline'>{course.name}</a>
                </Link>
              </div>
            ))}
          </div>
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

  const courses = await prisma.course.findMany({ where: { author: { email: session.user?.email } } })

  return {
    props: {
      session,
      courses
    },
  }
}