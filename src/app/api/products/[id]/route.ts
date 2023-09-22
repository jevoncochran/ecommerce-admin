import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;
  const product = await Product.findById(id);

  console.log(product);
  return new Response(JSON.stringify(product), { status: 200 });
}

export async function PUT(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;
  const body = await req.json();

  const { name, description, price } = body;
  const product = await Product.updateOne(
    { _id: id },
    { name, description, price }
  );

  return new Response(JSON.stringify(product), { status: 201 });
}
