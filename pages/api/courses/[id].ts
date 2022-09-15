import { prisma } from 'utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Course } from '@prisma/client'

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<Course | null>) {
  const { method } = req
  const { id } = req.query

  console.log("ok");

  switch (method) {
    case 'GET':
      try {
        if (typeof id !== "string") { throw new Error('missing id') };
        const course: Course | null = await prisma.course.findUnique({ where: { id: parseInt(id) } })
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