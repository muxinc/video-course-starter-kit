import { prisma } from 'utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Course } from '@prisma/client'

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<Course[]>) {
  const { method } = req

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
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}