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

  await prisma.video.updateMany({
    where: {
      uploadId: upload_id,
      status: { not: 'ready' }
    },
    data: {
      publicPlaybackId: playback_ids.find((row: PlaybackId) => row.policy === 'public').id,
      privatePlaybackId: playback_ids.find((row: PlaybackId) => row.policy === 'signed').id,
      status,
    }
  });
}

export default handler;