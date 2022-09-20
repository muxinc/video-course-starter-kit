import { prisma } from 'utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Readable } from 'node:stream';

import Mux from '@mux/mux-node';

const webhookSecret = process.env.MUX_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function verifyWebhookSignature(rawBody: string | Buffer, req: NextApiRequest) {
  if (webhookSecret) {
    // this will raise an error if signature is not valid
    Mux.Webhooks.verifyHeader(rawBody, req.headers['mux-signature'] as string, webhookSecret);
  } else {
    console.log('Skipping webhook signature verification because no secret is configured'); // eslint-disable-line no-console
  }
  return true;
};

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<string>) {
  const { method } = req

  switch (method) {
    case 'POST':
      // First, attempt to verify the webhook
      const rawBody = await buffer(req).then(buf => buf.toString('utf8'));

      try {
        verifyWebhookSignature(rawBody, req);
      } catch (e) {
        console.error('Error verifyWebhookSignature - is the correct signature secret set?', e);
        res.status(400).end((e as Error).message)
        return;
      }

      const jsonBody = JSON.parse(rawBody);
      const { data, type } = jsonBody;

      if (type !== 'video.asset.ready') {
        res.status(200).end();
        return;
      }

      try {
        const { upload_id, playback_ids, passthrough } = data;
        const metadata = JSON.parse(passthrough);

        // insert video record
        await prisma.video.create({
          data: {
            publicPlaybackId: playback_ids[0].id,
            privatePlaybackId: playback_ids[1].id,
            uploadId: upload_id,
            owner: {
              connect: {
                id: metadata.userId,
              }
            }
          }
        });

        res.status(200).end();
      } catch (err) {
        if (err instanceof Error) {
          console.log(`Webhook Error: ${err.message}`);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.error('Request error', err)
        res.status(500).end();
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
