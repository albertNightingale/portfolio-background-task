import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";

export async function replaceObject(key: string, data: string) {
  const client = new S3Client({
    credentials: fromIni({ profile: "default" }),
    region: "us-east-2",
  });
  const bucketName = "portfolio-bucket-albertliu";

  try {
    const found = await findObject(client, bucketName, key);
    if (found) {
      await deleteObject(client, bucketName, key);
    }
    await uploadObject(client, bucketName, key, data);
  } catch (err) {
    throw new Error(`Error replacing object ${key} in bucket ${bucketName}: ${err}`);
  }
}

async function uploadObject(client: S3Client, bucket: string, key: string, data: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data,
  });

  const response = await client.send(command);
  console.log(response.$metadata);
}

async function deleteObject(client: S3Client, bucket: string, key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await client.send(command);
  console.log(response.$metadata);
}

async function findObject(client: S3Client, bucket: string, key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });
  let response;
  try {
    response = await client.send(command);
    console.log(response.$metadata);
  } catch (err) {
    console.log(err);
    return false;
  }

  // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
  const str = await response?.Body?.transformToString();
  return str !== undefined;
}
