import { prisma } from 'utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Course, Lesson } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<Lesson>) {
  const { method } = req
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) res.status(401).end();

  console.log("Session", JSON.stringify(session, null, 2))

  switch (method) {
    case 'POST':
      const { name, description, courseId } = JSON.parse(req.body)

      try {
        const email = session?.user?.email
        if (!email) throw Error("Cannot create course: missing email on user record")

        const [course] = await prisma.course.findMany({
          where: {
            id: courseId,
            author: {
              email: {
                equals: email
              }
            }
          },
        })

        if (!course) {
          res.status(401).end();
        }

        const lesson = await prisma.lesson.create({
          data: {
            name,
            description,
            course: {
              connect: {
                id: course.id
              }
            }
          }
        })

        res.status(200).json(lesson)
      } catch (e) {
        console.error('Request error', e)
        res.status(500).end();
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}