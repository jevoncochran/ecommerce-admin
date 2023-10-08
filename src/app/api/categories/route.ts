import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/category";

export async function POST(req: Request) {
  await mongooseConnect();

  const body = await req.json();
  const { name, parentCategory, properties } = body;

  try {
    const category = await Category.create({
      name,
      parentCategory,
      properties,
    });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function GET() {
  await mongooseConnect();

  try {
    const categories = await Category.find({}).populate("parentCategory");
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function PUT(req: Request) {
  await mongooseConnect();

  const body = await req.json();
  const { _id, name, parentCategory, properties } = body;

  try {
    const category = await Category.updateOne(
      { _id },
      { name, parentCategory, properties }
    );
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
