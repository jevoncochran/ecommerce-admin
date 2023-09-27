import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product";
import { mongooseConnect } from "@/lib/mongoose";

export async function POST(req: NextRequest, res: NextResponse) {
  await mongooseConnect();

  const body = await req.json();
  const { name, description, price, images } = body;

  // TODO: Use try/catch here
  const product = await Product.create({ name, description, price, images });
  return new Response(JSON.stringify(product), { status: 201 });
}

export async function GET(req: NextRequest, res: NextResponse) {
  await mongooseConnect();

  try {
    const products = await Product.find({});

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
