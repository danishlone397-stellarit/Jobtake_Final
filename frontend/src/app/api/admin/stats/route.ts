import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const Schema = z.object({
  label: z.string(),
  value: z.string(),
  suffix: z.string().optional(),
  iconKey: z.string().optional(),
  accent: z.string().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  const stats = await prisma.homepageStat.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ stats });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = Schema.safeParse(await req.json().catch(() => ({})));
  if (!data.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const stat = await prisma.homepageStat.create({ data: data.data });
  return NextResponse.json({ stat });
}
