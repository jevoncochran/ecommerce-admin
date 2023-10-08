import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";

type Params = { params: { id: string } };

// TODO: Use try catch statements for all these endpoints
export async function GET(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;
  const product = await Product.findById(id).populate("category");

  return new Response(JSON.stringify(product), { status: 200 });
}

export async function PUT(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;
  const body = await req.json();

  const { name, category, description, price, images, availability } = body;

  if (!category) {
    await Product.updateOne({ _id: id }, { name, description, price, images });

    await Product.updateOne({ _id: id }, { $unset: { availability: "" } });

    const uncategorizedProduct = await Product.updateOne(
      { _id: id },
      { $unset: { category: "" } }
    );

    return new Response(JSON.stringify(uncategorizedProduct), { status: 201 });
  } else {
    const product = await Product.updateOne(
      { _id: id },
      { name, category, description, price, images, availability }
    );

    return new Response(JSON.stringify(product), { status: 201 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;

  await Product.deleteOne({ _id: id });
  return new Response(JSON.stringify(true), { status: 200 });
}
