import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const Body = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = Body.safeParse(await req.json().catch(() => ({})));
  if (!data.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data.data;

  const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  if (payment.userId !== me.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
    }),
    prisma.job.update({ where: { id: payment.jobId }, data: { featured: true } }),
  ]);

  return NextResponse.json({ ok: true });
}
