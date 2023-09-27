import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/category";

export async function POST(req: Request) {
  await mongooseConnect();

  const body = await req.json();
  const { name } = body;

  try {
    const category = await Category.create({ name });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function GET() {
  await mongooseConnect();

  try {
    const categories = await Category.find({});
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
