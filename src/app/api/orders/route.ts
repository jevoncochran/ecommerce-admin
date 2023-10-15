import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: Request) {
  await mongooseConnect();

  const session = await getServerSession(authOptions);

  try {
    const orders = await Order.find({ seller: session?.user?._id }).sort({
      createdAt: -1,
    });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
