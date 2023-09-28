import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;
  const product = await Product.findById(id);

  return new Response(JSON.stringify(product), { status: 200 });
}

export async function PUT(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;
  const body = await req.json();

  const { name, description, price, images } = body;
  const product = await Product.updateOne(
    { _id: id },
    { name, description, price, images }
  );

  return new Response(JSON.stringify(product), { status: 201 });
}

export async function DELETE(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;

  await Product.deleteOne({ _id: id });
  return new Response(JSON.stringify(true), { status: 200 });
}
