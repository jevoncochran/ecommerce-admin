import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/category";

type Params = { params: { id: string } };

export async function DELETE(req: Request, { params }: Params) {
  await mongooseConnect();

  const { id } = params;

  try {
    await Category.deleteOne({ _id: id });
    return new Response(JSON.stringify(true), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
