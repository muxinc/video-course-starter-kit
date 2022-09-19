import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession } from "next-auth/react"
import { GetServerSideProps } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Course, Lesson } from '@prisma/client'
import Link from 'next/link'

type AdminLessonEditPageProps = {
  session: Session;
  lesson: Lesson;
}

const AdminLessonEdit: NextPage<AdminLessonEditPageProps> = ({ lesson }) => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <h2 className='text-xl'>{lesson.name}</h2>
        <p>{lesson.description}</p>
      </>
    )
  }
  return <p>Access Denied</p>
}

export default AdminLessonEdit

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

  const id = context?.params?.lessonId
  if (typeof id !== "string") { throw new Error('missing id') };

  const [lesson] = await prisma.lesson.findMany({
    where: {
      id: parseInt(id),
      course: {
        author: {
          email: session.user?.email
        }
      }
    },
  })

  if (!lesson) {
    return {
      notFound: true
    }
  }

  console.log(lesson);

  return {
    props: {
      session,
      lesson
    },
  }
}