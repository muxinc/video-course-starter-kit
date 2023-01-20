import type { NextPage, GetServerSideProps } from 'next'
import { prisma } from 'utils/prisma'
import { useSession } from "next-auth/react"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Lesson, Video } from '@prisma/client'
import { useRouter } from 'next/router'
import { SubmitHandler } from "react-hook-form";
import MuxPlayer from "@mux/mux-player-react/lazy";
import LessonForm, { Inputs } from 'components/forms/LessonForm'
import Button from 'components/Button'
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query'

type AdminLessonEditPageProps = {
  session: Session;
  lesson: Lesson & {
    video: Video | null;
  }
}

const AdminLessonEdit: NextPage<AdminLessonEditPageProps> = ({ lesson }) => {
  const { data: session } = useSession()
  const router = useRouter()

  const updateLesson = (data: Inputs) => {
    return fetch(`/api/lessons/${lesson.id}`, {
      method: 'PUT', body: JSON.stringify(data)
    }).then(res => res.json())
  }

  const deleteLesson = () => {
    return fetch(`/api/lessons/${lesson.id}`, { method: 'DELETE' })
  }

  const updateMutation = useMutation(updateLesson, {
    onSuccess: () => {
      toast.success('Lesson updated successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Something went wrong')
    }
  })

  const deleteMutation = useMutation(deleteLesson, {
    onSuccess: () => {
      router.push(`/admin/courses/${lesson.courseId}`)
      toast.success('Lesson deleted successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Something went wrong')
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async data => {
    updateMutation.mutate(data);
  };

  if (session) {
    return (
      <div className='grid lg:grid-cols-2 gap-6'>
        <div>
          {lesson.video?.status === "ready" && lesson.video.publicPlaybackId ? (
            <MuxPlayer
              className='mb-6 w-full aspect-video'
              streamType="on-demand"
              playbackId={lesson.video.publicPlaybackId}
              metadata={{
                video_series: lesson.courseId,
                video_title: lesson.name,
                player_name: "Video Course Starter Kit",
              }}
            />
          ) : (
            <div className='mb-6 w-full aspect-video bg-gray-200' />
          )}

          <Button intent="danger" onClick={deleteMutation.mutate}>Delete this lesson</Button>
        </div>
        <div>
          <LessonForm onSubmit={onSubmit} lesson={lesson} isLoading={updateMutation.isLoading} />
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
