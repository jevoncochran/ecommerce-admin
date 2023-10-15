import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest, res: NextResponse) {
  await mongooseConnect();

  const body = await req.json();
  const { name, category, description, price, images, availability, seller } =
    body;

  // TODO: Use try/catch here
  const product = await Product.create({
    name,
    category,
    description,
    price,
    images,
    availability,
    seller,
  });
  return new Response(JSON.stringify(product), { status: 201 });
}

export async function GET() {
  await mongooseConnect();

  const session = await getServerSession(authOptions);

  try {
    const products = await Product.find({ seller: session?.user?._id });

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
