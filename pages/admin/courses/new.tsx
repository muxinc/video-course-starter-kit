import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession, signIn, signOut } from "next-auth/react"

const AdminNewCourse: NextPage = () => {
  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        New course
      </h1>
    </>
  )

}

export default AdminNewCourse
