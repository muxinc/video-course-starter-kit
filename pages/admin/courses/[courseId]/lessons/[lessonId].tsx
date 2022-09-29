import type { NextPage, GetServerSideProps } from 'next'
import { prisma } from 'utils/prisma'
import { useSession } from "next-auth/react"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Lesson, Video } from '@prisma/client'
import { useRouter } from 'next/router'
import { SubmitHandler } from "react-hook-form";
import MuxPlayer from "@mux/mux-player-react";
import LessonForm, { Inputs } from 'components/forms/LessonForm'
import Button from 'components/Button'

type AdminLessonEditPageProps = {
  session: Session;
  lesson: Lesson & {
    video: Video | null;
  }
}

const AdminLessonEdit: NextPage<AdminLessonEditPageProps> = ({ lesson }) => {
  const { data: session } = useSession()
  const router = useRouter()

  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      const result = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PUT', body: JSON.stringify(data)
      }).then(res => res.json())
    } catch (error) {
      console.log('Something went wrong')
    }
  };

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
      <div className='grid lg:grid-cols-2 gap-6'>
        <div>
          <MuxPlayer
            streamType="on-demand"
            playbackId={lesson.video?.publicPlaybackId}
          />
          <Button intent="danger" onClick={handleDelete}>Delete this lesson</Button>
        </div>
        <div>
          <LessonForm onSubmit={onSubmit} lesson={lesson} />
        </div>
      </div>
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