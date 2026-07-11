import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { razorpay, FEATURE_JOB_PRICE_INR } from "@/lib/razorpay";

const Body = z.object({
  jobId: z.string(),
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = Body.safeParse(await req.json().catch(() => ({})));
  if (!data.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const job = await prisma.job.findUnique({ where: { id: data.data.jobId } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.postedById !== me.id && me.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (job.featured) return NextResponse.json({ error: "Job is already featured" }, { status: 400 });

  const amountPaise = FEATURE_JOB_PRICE_INR * 100;

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `feature_${job.id}_${Date.now()}`,
    notes: { jobId: job.id, userId: me.id, purpose: "FEATURE_JOB" },
  });

  await prisma.payment.create({
    data: {
      jobId: job.id,
      userId: me.id,
      purpose: "FEATURE_JOB",
      amount: amountPaise,
      currency: "INR",
      status: "CREATED",
      razorpayOrderId: order.id,
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: amountPaise,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    jobTitle: job.title,
  });
}
