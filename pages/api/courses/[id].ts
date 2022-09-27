import { prisma } from 'utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Course } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<Course | null>) {
  const { method } = req
  const { id: courseId } = req.query
  if (typeof courseId !== "string") { throw new Error('missing id') };

  switch (method) {
    case 'GET':
      try {
        const course: Course | null = await prisma.course.findUnique({ where: { id: parseInt(courseId) } })
        res.status(200).json(course)
      } catch (e) {
        console.error('Request error', e)
        res.status(500).end();
      }
      break
    case 'PUT':
      const { name, description } = JSON.parse(req.body)
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) res.status(401).end();

      try {
        const id = session?.user?.id
        if (!id) throw Error("Cannot create course: missing id on user record")

        const [course] = await prisma.course.findMany({
          where: {
            id: parseInt(courseId),
            author: {
              id: {
                equals: id
              }
            }
          },
        })

        if (!course) {
          res.status(401).end();
        }

        const updateCourse = await prisma.course.update({
          where: {
            id: parseInt(courseId)
          },
          data: {
            name: name,
            description: description
          },
        })

        res.status(200).json(updateCourse)

      } catch (e) {
        console.error('Request error', e)
        res.status(500).end();
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}