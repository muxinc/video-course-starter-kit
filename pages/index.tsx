import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import type { Course } from "@prisma/client"
import { prisma } from 'utils/prisma'
import Link from 'next/link'


type HomePageProps = {
  courses: Course[]
}

const Home: NextPage<HomePageProps> = ({ courses }) => {
  return (
    <>
      <h1 className="text-4xl font-bold">
        Video Course Starter Kit
      </h1>

      <div>
        {courses.map(course => (
          <div key={course.id} className="w-full border rounded p-4">
            <Link href={`/courses/${course.id}`}>
              <a className='underline'>{course.name}</a>
            </Link>
          </div>
        ))}
      </div>
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