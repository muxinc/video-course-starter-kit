import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/future/image'
import type { Course, Lesson, Video } from "@prisma/client"
import { prisma } from 'utils/prisma'
import Heading from 'components/Heading'
import { useSession, signIn } from "next-auth/react"
import Link from 'next/link'

type ViewCoursePageProps = {
  course: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })
}

const ViewCourse: NextPage<ViewCoursePageProps> = ({ course }) => {
  const { data: session } = useSession()

  return (
    <>
      <Heading>{course.name}</Heading>

      {session ? (
        <Link href={`/courses/${course.id}/view`}>
          <a>View this course &rarr;</a>
        </Link>
      ) : (
        <a onClick={() => signIn()}>Sign in to view this course</a>
      )}

      <div>
        <h2>Lessons</h2>
        {course.lessons.map(lesson => (
          <div key={lesson.id}>
            {lesson.video?.publicPlaybackId && (
              <Image
                src={`https://image.mux.com/${lesson.video.publicPlaybackId}/thumbnail.jpg`}
                alt={`Video thumbnail preview for ${lesson.name}`}
                width={320}
                height={240}
              />
            )}
            <h2 className='text-xl'>{lesson.name}</h2>
            <p>{lesson.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default ViewCourse

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context?.params?.id
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
    return {
      notFound: true,
      revalidate: process.env.VERCEL_ENV !== "production" && 30,
    }
  }

  return {
    props: { course },
    revalidate: process.env.VERCEL_ENV !== "production" && 30,
  }
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});