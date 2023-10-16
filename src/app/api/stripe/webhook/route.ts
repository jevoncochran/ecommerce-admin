import { mongooseConnect } from "@/lib/mongoose";
import { stripe } from "@/lib/stripe";
import { Order } from "@/models/order";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  await mongooseConnect();

  try {
    const body = await req.text();

    const signature = headers().get("stripe-signature");

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "checkout.session.completed") {
      const data = event.data.object;
      const orderIds = data.metadata.orderIds.split(",");
      const paid = data.payment_status === "paid";

      if (orderIds && paid) {
        for (const orderId of orderIds) {
          await Order.findByIdAndUpdate(orderId, { paid: true });
        }
      }
    }

    return NextResponse.json({ result: event, ok: true }, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
