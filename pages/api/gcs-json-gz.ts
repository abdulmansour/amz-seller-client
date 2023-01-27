import { Storage } from "@google-cloud/storage";
import { cwd } from "process";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

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
  await storage.bucket(bucketName).file(fileName).download(options);

  console.log(`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const fileName = req?.query?.fileName as string;
  const storage = new Storage({
    keyFilename: "utils/service_account_gcs.json",
  });

  await downloadFile(
    storage,
    "molgha",
    fileName,
    path.join(cwd(), fileName)
  ).catch(console.error);

  const file = fs.readFileSync(fileName);
  fs.unlink(path.join(cwd(), fileName), () => null);

  res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Content-Type", " application/json");
  res.status(200).send(file);
};

export default handler;
