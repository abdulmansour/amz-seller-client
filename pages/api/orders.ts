import { Storage } from "@google-cloud/storage";
import { cwd } from "process";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next/types";

import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamObject } from "stream-json/streamers/StreamObject";
import fs from "fs";
import zlib from "zlib";

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
  const fileName = "orders_14d.json.gz";
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

  res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Content-Type", " application/json");
  res.status(200).send(file);
};

const handlerStream = async (req: NextApiRequest, res: NextApiResponse) => {
  const fileName = "orders_14d.json.gz";
  const storage = new Storage({
    keyFilename: "utils/service_account_gcs.json",
  });

  await downloadFile(
    storage,
    "molgha",
    fileName,
    path.join(cwd(), fileName)
  ).catch(console.error);

  const pipeline = chain([
    fs.createReadStream(fileName),
    zlib.createGunzip(),
    parser(),
    streamObject(),
  ]);

  pipeline.on("data", (chunk) => {
    let v = JSON.stringify(chunk) + "\n";
    console.log(v);
    return res.write(v);
  });
  pipeline.on("end", () => res.end());
};

export default handler;
