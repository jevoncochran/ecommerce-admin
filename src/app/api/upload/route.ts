import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export async function POST(req: Request, res: Response) {
  const formData = await req.formData();
  const file = formData.get("file") as Blob;
  const buffer = Buffer.from(await file.arrayBuffer());

  const mimeType = file.type;
  const fileExtension = mimeType.split("/")[1];
  const fileName = `${uuid()}.${fileExtension}`;

  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });

  client.send(
    new PutObjectCommand({
      Bucket: "jevonc-next-ecommerce",
      Key: `${Date.now()}-${fileName}`,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read",
    })
  );

  return new Response(JSON.stringify({ success: true, fileName }), {
    status: 201,
  });
}
