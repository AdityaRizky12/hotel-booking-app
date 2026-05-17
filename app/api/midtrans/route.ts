import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const snap = new midtransClient.Snap({
      isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      transaction_details: {
        order_id: `BOOKING-${body.bookingId}-${Date.now()}`,
        gross_amount: body.totalPrice,
      },
      customer_details: {
        first_name: body.fullName,
        email: body.email,
        phone: body.phone,
      },
      item_details: [
        {
          id: body.roomId,
          price: body.totalPrice,
          quantity: 1,
          name: body.roomName,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create payment transaction" },
      { status: 500 }
    );
  }
}