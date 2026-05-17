import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, fullName, roomName, totalPrice, bookingId } = body;

    await resend.emails.send({
      from: "Hotel Booking <onboarding@resend.dev>",
      to: email,
      subject: "Booking Payment Successful",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Payment Successful</h2>
          <p>Hello ${fullName},</p>
          <p>Your hotel booking has been paid successfully.</p>

          <hr />

          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Room:</strong> ${roomName}</p>
          <p><strong>Total Payment:</strong> Rp ${Number(totalPrice).toLocaleString("id-ID")}</p>
          <p><strong>Status:</strong> Paid</p>

          <br />

          <p>Thank you for choosing our hotel.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Receipt email sent successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to send receipt email" },
      { status: 500 }
    );
  }
}