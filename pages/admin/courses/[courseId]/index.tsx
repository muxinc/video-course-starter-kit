import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession } from "next-auth/react"
import { GetServerSideProps } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Course, Lesson, Video } from '@prisma/client'
import Link from 'next/link'
import Image from 'next/image'
import CourseForm, { Inputs } from 'components/forms/CourseForm';
import { SubmitHandler } from "react-hook-form";
import Heading from 'components/Heading';
import Button from 'components/Button';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query'

type AdminCourseEditPageProps = {
  session: Session;
  course: Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  }
}

type CourseUpdateResult = {
  id: number;
}

const AdminCourseEdit: NextPage<AdminCourseEditPageProps> = ({ course }) => {
  const { data: session } = useSession()

  const handler = (data: Inputs) => {
    return fetch(`/api/courses/${course.id}`, {
      method: 'PUT', body: JSON.stringify(data)
    }).then(res => res.json())
  }

  const mutation = useMutation({ 
    mutationFn: handler,
    onSuccess: (data: CourseUpdateResult) => {
      toast.success('Course updated successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Something went wrong')
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async data => {
    mutation.mutate(data);
  };

  if (session) {
    return (
      <div className='grid md:grid-cols-2'>
        <div>
          <Heading as='h2'>{course.name}</Heading>
          <CourseForm onSubmit={onSubmit} course={course} isLoading={mutation.isPending} />
        </div>

        <div>
          <Heading as='h4'>Lessons</Heading>
          {course.lessons.length > 0 ? (
            <>
              {
                course.lessons.map(lesson => (
                  <Link key={lesson.id} href={`/admin/courses/${course.id}/lessons/${lesson.id}`} className='flex gap-4 border border-gray-200 rounded-lg mb-6 cursor-pointer'>
                    {lesson.video?.publicPlaybackId && (
                      <Image
                        src={`https://image.mux.com/${lesson.video.publicPlaybackId}/thumbnail.jpg?width=640`}
                        alt={`Video thumbnail preview for ${lesson.name}`}
                        width={180}
                        height={100}
                      />
                    )}

                    <div className='py-2'>
                      <Heading as='h5'>{lesson.name}</Heading>
                    </div>
                  </Link>
                ))
              }
            </>
          ) : (
            <div>
              <h2>None yet.</h2>
            </div>
          )}

          <Link href={`/admin/courses/${course.id}/lessons/new`}>
            <Button intent='secondary'>Add a lesson</Button>
          </Link>
        </div>
      </div>
    )
  }
  return <p>Access Denied</p>
}

export default AdminCourseEdit

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

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