import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import type { Course } from "@prisma/client"
import { prisma } from 'utils/prisma'
import Heading from 'components/Heading'
import CourseCard from 'components/CourseCard'
import CourseGrid from 'components/CourseGrid'

type HomePageProps = {
  courses: Course[]
}

const Home: NextPage<HomePageProps> = ({ courses }) => {
  return (
    <>
      <Heading>View these video courses</Heading>
      <CourseGrid>
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </CourseGrid>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps<HomePageProps> = async (context) => {
  const courses = await prisma.course.findMany()
  return {
    props: { courses },
    revalidate: process.env.VERCEL_ENV !== "production" && 30,
  }
}
