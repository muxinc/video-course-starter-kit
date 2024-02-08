import type { NextApiRequest, NextApiResponse } from 'next'
import type { Readable } from 'node:stream';

import Mux from '@mux/mux-node';

import WEBHOOK_TYPES from "../../../utils/webhooks/mux/types"
import get from "lodash.get"

const webhookSecret = process.env.MUX_WEBHOOK_SECRET;
const mux = new Mux();

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

function verifyWebhookSignature(rawBody: string, req: NextApiRequest) {
  if (webhookSecret) {
    // this will raise an error if signature is not valid
    mux.webhooks.verifySignature(rawBody, req.headers, webhookSecret);
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

      const WEBHOOK_TYPE_HANDLER = get(WEBHOOK_TYPES, type);

      if (WEBHOOK_TYPE_HANDLER) {
        try {
          const passthrough = data.passthrough || data.new_asset_settings.passthrough;
          const metadata = JSON.parse(passthrough);

          await WEBHOOK_TYPE_HANDLER({ data, metadata });
          res.status(200).end();
          return;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
          }

          console.error('Request error', err)
          res.status(500).end();
          return;
        }
      } else {
        res.status(200).end();
        return;
      }

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
