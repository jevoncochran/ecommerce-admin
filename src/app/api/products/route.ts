import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product";
import { mongooseConnect } from "@/lib/mongoose";

export async function POST(req: NextRequest, res: NextResponse) {
  await mongooseConnect();

  const body = await req.json();
  const { name, category, description, price, images, availability } = body;

  // TODO: Use try/catch here
  const product = await Product.create({
    name,
    category,
    description,
    price,
    images,
    availability,
  });
  return new Response(JSON.stringify(product), { status: 201 });
}

export async function GET() {
  await mongooseConnect();

  try {
    const products = await Product.find({});

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
