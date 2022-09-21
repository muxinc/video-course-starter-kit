import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession, signIn, signOut } from "next-auth/react"
import { GetServerSideProps } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Course, Lesson, Video } from '@prisma/client'
import Link from 'next/link'
import Image from 'next/future/image'

type AdminCourseEditPageProps = {
  session: Session;
  course: Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  }
}

const AdminCourseEdit: NextPage<AdminCourseEditPageProps> = ({ course }) => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <h2 className='text-xl font-semibold'>{course.name}</h2>
        <h3 className='text-lg'>Lessons</h3>
        {course.lessons.length > 0 ? (
          <>
            {
              course.lessons.map(lesson => (
                <div key={lesson.id} className='flex gap-4 border-b border-gray-200 p-4 rounded mb-4'>
                  {lesson.video?.publicPlaybackId && (
                    <Image
                      src={`https://image.mux.com/${lesson.video.publicPlaybackId}/thumbnail.jpg?width=640`}
                      alt={`Video thumbnail preview for ${lesson.name}`}
                      width={320}
                      height={240}
                    />
                  )}
                  <Link href={`/admin/courses/${course.id}/lessons/${lesson.id}`}>
                    <a className='underline'>{lesson.name}</a>
                  </Link>
                </div>
              ))
            }
          </>
        ) : (
          <div>
            <h2>None yet.</h2>
          </div>
        )}

        <Link href={`/admin/courses/${course.id}/lessons/new`}>
          <a className='underline text-green-700'>Add a lesson</a>
        </Link>
      </>
    )
  }
  return <p>Access Denied</p>
}

export default AdminCourseEdit

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

  const id = context?.params?.courseId
  if (typeof id !== "string") { throw new Error('missing id') };

  const [course] = await prisma.course.findMany({
    where: {
      id: parseInt(id),
      author: {
        email: session.user?.email
      }
    },
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
      notFound: true
    }
  }

  return {
    props: {
      session,
      course
    },
  }
}