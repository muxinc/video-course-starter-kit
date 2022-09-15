import type { NextPage, GetStaticProps } from 'next'
import Image from 'next/image'
import type { Course } from "@prisma/client"
import { prisma } from 'utils/prisma'
import { useSession, signIn, signOut } from "next-auth/react"

type HomePageProps = {
  courses: Course[]
}

const Home: NextPage<HomePageProps> = ({ courses }) => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        Video Course Starter Kit
      </h1>

      <p>
        <button onClick={() => signIn()}>Sign in with Github</button>
      </p>

      <div>
        {courses.map(course => (
          <div key={course.id} className="w-full border rounded p-4">
            {course.name}
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