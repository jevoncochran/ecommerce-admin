import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

type Params = { params: { id: string } };

// TODO: Use try catch statements for all these endpoints
export async function GET(req: Request, { params }: Params) {
  await mongooseConnect();

  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    const product = await Product.findById(id).populate("category");

    if (product.sellerId?.toString() !== session?.user?._id) {
      return new Response(
        JSON.stringify({ errorMessage: "Unauthorized request" }),
        { status: 401 }
      );
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  await mongooseConnect();

  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    const productById = await Product.findById(id);

    if (productById.sellerId?.toString() !== session?.user?._id) {
      return new Response(
        JSON.stringify({ errorMessage: "Unauthorized request" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, category, description, price, images, availability } = body;

    if (!category) {
      await Product.updateOne(
        { _id: id },
        { name, description, price, images }
      );

      await Product.updateOne({ _id: id }, { $unset: { availability: "" } });

      const uncategorizedProduct = await Product.updateOne(
        { _id: id },
        { $unset: { category: "" } }
      );

      return new Response(JSON.stringify(uncategorizedProduct), {
        status: 201,
      });
    } else {
      const product = await Product.updateOne(
        { _id: id },
        { name, category, description, price, images, availability }
      );

      return new Response(JSON.stringify(product), { status: 201 });
    }
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

// TODO: Figure out if there is a way to do the seller verification
// and delete operation simultaneously so as not to have to make two calls to the database
export async function DELETE(req: Request, { params }: Params) {
  await mongooseConnect();

  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    const productById = await Product.findById(id);
    if (productById.sellerId?.toString() !== session?.user?._id) {
      return new Response(
        JSON.stringify({ errorMessage: "Unauthorized request" }),
        { status: 401 }
      );
    }

    await Product.deleteOne({ _id: id });
    return new Response(JSON.stringify(true), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
