import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/order";

export async function GET(req: Request) {
  await mongooseConnect();

  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
