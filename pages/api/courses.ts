import { prisma } from 'utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Course } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import slugify from '@sindresorhus/slugify';

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<Course[] | Course>) {
  const { method } = req
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) res.status(401).end();

  console.log("Session", JSON.stringify(session, null, 2))

  switch (method) {
    case 'GET':
      try {
        const courses = await prisma.course.findMany()
        res.status(200).json(courses)
      } catch (e) {
        console.error('Request error', e)
        res.status(500).end();
      }
      break
    case 'POST':
      const { name, description } = JSON.parse(req.body)

      try {
        const email = session?.user?.email
        if (!email) throw Error("Cannot create course: missing email on user record")

        const course = await prisma.course.create({
          data: {
            name,
            description,
            slug: slugify(name),
            author: {
              connect: {
                email
              }
            }
          }
        })
        res.status(200).json(course)
      } catch (e) {
        console.error('Request error', e)
        res.status(500).end();
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}