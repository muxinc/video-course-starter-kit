import { prisma } from 'utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Course, Lesson } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import slugify from '@sindresorhus/slugify';

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<Lesson>) {
  const { method } = req
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) res.status(401).end();

  console.log("Session", JSON.stringify(session, null, 2))

  switch (method) {
    case 'POST':
      const { name, description, courseId, uploadId } = JSON.parse(req.body)

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

        const [video] = await prisma.video.findMany({
          where: {
            uploadId,
            owner: {
              id: {
                equals: id
              }
            }
          }
        })

        if (!video) {
          res.status(401).end();
        }

        const lesson = await prisma.lesson.create({
          data: {
            name,
            description,
            slug: slugify(name),
            course: {
              connect: {
                id: course.id
              }
            },
            video: {
              connect: {
                uploadId
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