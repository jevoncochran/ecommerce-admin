import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export async function POST(req: Request, res: Response) {
  const formData = await req.formData();
  const file = formData.get("file") as Blob;
  const buffer = Buffer.from(await file.arrayBuffer());

  const mimeType = file.type;
  const fileExtension = mimeType.split("/")[1];
  const fileName = `${uuid()}.${fileExtension}`;
  const newFileName = `${Date.now()}-${fileName}`;

  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: newFileName,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read",
    })
  );

  const link = `https://${process.env.S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${newFileName}`;

  return new Response(JSON.stringify({ success: true, link }), {
    status: 201,
  });
}
