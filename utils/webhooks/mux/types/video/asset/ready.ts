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
  const { upload_id, playback_ids, duration, status, aspect_ratio } = data;

  // upsert video record
  await prisma.video.upsert({
    where: {
      uploadId: upload_id
    },
    update: {
      duration,
      aspectRatio: aspect_ratio,
      status
    },
    create: {
      publicPlaybackId: playback_ids.find((row: PlaybackId) => row.policy === 'public').id,
      privatePlaybackId: playback_ids.find((row: PlaybackId) => row.policy === 'signed').id,
      duration,
      aspectRatio: aspect_ratio,
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