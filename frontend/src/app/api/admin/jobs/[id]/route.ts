import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const Patch = z.object({
  status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "CLOSED", "REJECTED"]).optional(),
  featured: z.boolean().optional(),
  urgent: z.boolean().optional(),
  premium: z.boolean().optional(),
  collarType: z.enum(["WHITE", "BLUE", "PINK", "GREY", "MSME"]).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const data = Patch.safeParse(await req.json().catch(() => ({})));
  if (!data.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const current = await prisma.job.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updateData: Record<string, unknown> = { ...data.data };
  if (data.data.status === "PUBLISHED" && current.status !== "PUBLISHED") {
    updateData.publishedAt = new Date();
  }
  const job = await prisma.job.update({ where: { id }, data: updateData });
  return NextResponse.json({ job });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
