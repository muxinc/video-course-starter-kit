import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'

const AdminIndex: NextPage = () => {
  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        Admin
      </h1>
    </>
  )
}

export default AdminIndex
