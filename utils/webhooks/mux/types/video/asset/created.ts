import { prisma } from 'utils/prisma'

type PlaybackId = {
  id: string;
  policy: | 'signed' | 'public'
}

type Props = {
  data: { [key: string]: any }
  metadata: { userId: string }
}

const handler = async ({ data, metadata }: Props) => {
  const { upload_id, playback_ids, status } = data;

  console.log('handling created')

  // upsert video record
  await prisma.video.upsert({
    where: {
      uploadId: upload_id
    },
    update: {},
    create: {
      publicPlaybackId: playback_ids.find((row: PlaybackId) => row.policy === 'public').id,
      privatePlaybackId: playback_ids.find((row: PlaybackId) => row.policy === 'signed').id,
      status,
      uploadId: upload_id,
      owner: {
        connect: {
          id: metadata.userId,
        }
      }
    },
  });
}

export default handler;