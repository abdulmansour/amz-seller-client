import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { cwd } from 'process';

const downloadFile = async (
  storage: Storage,
  bucketName: string,
  fileName: string,
  destFileName: string
) => {
  const options = {
    destination: destFileName,
  };

  // Downloads the file
  const doesExist = await storage.bucket(bucketName).file(fileName).exists();
  if (doesExist) {
    await storage.bucket(bucketName).file(fileName).download(options);
    // eslint-disable-next-line no-console
    console.log(
      `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
    );
  } else {
    throw new Error(`gs://${bucketName}/${fileName} does not exist`);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const bucketName = process.env.GCS_BUCKET_NAME as string;
  const fileName = req?.query?.fileName as string;
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: {
      client_email: process.env.GCS_CLIENT_EMAIL,
      private_key: (process.env.GCS_PRIVATE_KEY as string)
        .split(String.raw`\n`)
        .join('\n'),
    },
  });

  await downloadFile(storage, bucketName, fileName, path.join(cwd(), fileName))
    .then(() => {
      const file = fs.readFileSync(fileName);
      fs.unlink(path.join(cwd(), fileName), () => null);

      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Type', ' application/json');
      res.status(200).send(file);
    })
    .catch((e: Error) => {
      // eslint-disable-next-line no-console
      console.error(e);
      res.status(500).send({ error: 'failed to fetch data' });
    });
};

export default handler;
