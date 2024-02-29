import type { NextPage, GetStaticProps, GetServerSideProps } from 'next'
import type { Course, Lesson, Video } from "@prisma/client"
import { prisma } from 'utils/prisma'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Heading from 'components/Heading'
import CourseGrid from 'components/CourseGrid'

type HomePageProps = {
  courses: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })[]
}

const Home: NextPage<HomePageProps> = ({ courses }) => {
  return (
    <>
      {courses.length > 0 ? (<Heading>View these video courses</Heading>) : (<Heading>There are no courses to view</Heading>)}
      {courses.find(course => course.published === false) && (
        <Heading as="h4">Draft courses are only visible to you</Heading>
      )}
      <CourseGrid courses={courses} />
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  const courses = await prisma.course.findMany({
    where: {
      OR: [
        {
          published: true
        },
        {
          author: {
            id: session?.user?.id
          }
        },
      ],
    },
    include: { lessons: { include: { video: true } } }
  })

  return {
    props: {
      courses
    },
  }
}