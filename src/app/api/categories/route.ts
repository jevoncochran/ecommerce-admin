import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/category";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  await mongooseConnect();

  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, parentCategory, properties } = body;

    const category = await Category.create({
      name,
      parentCategory,
      properties,
      seller: session?.user?._id,
    });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function GET() {
  await mongooseConnect();

  try {
    const session = await getServerSession(authOptions);

    const categories = await Category.find({
      seller: session?.user?._id,
    }).populate("parentCategory");
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

// TODO: Wondering if this should be in a separate route
// Suggested route: /api/categories/[id]/route.ts
export async function PUT(req: Request) {
  await mongooseConnect();

  try {
    const session = await getServerSession(authOptions);

    const body = await req.json();
    const { _id, name, parentCategory, properties } = body;

    const categoryById = await Category.findById(_id);

    if (categoryById.seller?.toString() !== session?.user?._id) {
      return new Response(
        JSON.stringify({ errorMessage: "Unauthorized request" }),
        { status: 401 }
      );
    }

    const category = await Category.updateOne(
      { _id },
      { name, parentCategory, properties }
    );
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
