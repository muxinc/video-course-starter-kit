import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession, signIn, signOut } from "next-auth/react"

const AdminIndex: NextPage = () => {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <h1 className="text-4xl text-center font-bold">
          Admin
        </h1>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className='bg-black text-white p-4' onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default AdminIndex
