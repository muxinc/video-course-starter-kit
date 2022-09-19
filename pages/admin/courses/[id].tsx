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
  course: Course;
}

const AdminIndex: NextPage<AdminIndexPageProps> = ({ course }) => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <h2 className='text-xl'>{course.name}</h2>
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

  const id = context?.params?.id
  if (typeof id !== "string") { throw new Error('missing id') };

  const course = await prisma.course.findMany({
    where: {
      id: parseInt(id),
      author: {
        email: session.user?.email
      }
    },
    include: {
      lessons: true,
    },
  })

  if (!course) {
    return {
      notFound: true
    }
  }

  console.log(course);

  return {
    props: {
      session,
      course: course[0]
    },
  }
}