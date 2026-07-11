import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const Schema = z.object({
  status:   z.enum(["ACTIVE", "PENDING", "SUSPENDED"]).optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const data = Schema.safeParse(await req.json().catch(() => ({})));
  if (!data.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const c = await prisma.company.update({ where: { id }, data: data.data });
  return NextResponse.json({ company: { id: c.id, status: c.status, verified: c.verified, featured: c.featured } });
}
