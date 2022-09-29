import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession } from "next-auth/react"
import { GetServerSideProps } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Lesson, Video } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from 'components/Button'

import MuxPlayer from "@mux/mux-player-react";

type AdminLessonEditPageProps = {
  session: Session;
  lesson: Lesson & {
    video: Video | null;
  }
}

const AdminLessonEdit: NextPage<AdminLessonEditPageProps> = ({ lesson }) => {
  const { data: session } = useSession()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await fetch(`/api/lessons/${lesson.id}`, { method: 'DELETE' })
      router.push(`/admin/courses/${lesson.courseId}`)
    } catch (error) {
      console.log(error);
      console.log('Something went wrong')
    }
  };

  if (session) {
    return (
      <>
        <MuxPlayer
          streamType="on-demand"
          playbackId={lesson.video?.publicPlaybackId}
        />
        <h2 className='text-xl'>{lesson.name}</h2>
        <p>{lesson.description}</p>

        <Button intent="danger" onClick={handleDelete}>Delete this lesson</Button>
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
          id: session.user?.id
        }
      }
    },
    include: {
      video: true
    }
  })

  if (!lesson) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      session,
      lesson
    },
  }
}