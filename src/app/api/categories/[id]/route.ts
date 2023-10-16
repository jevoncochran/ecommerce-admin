import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/category";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

type Params = { params: { id: string } };

export async function DELETE(req: Request, { params }: Params) {
  await mongooseConnect();

  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    const categoryById = await Category.findById(id);

    if (categoryById.sellerId?.toString() !== session?.user?._id) {
      return new Response(
        JSON.stringify({ errorMessage: "Unauthorized request" }),
        { status: 401 }
      );
    }

    await Category.deleteOne({ _id: id });
    return new Response(JSON.stringify(true), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
