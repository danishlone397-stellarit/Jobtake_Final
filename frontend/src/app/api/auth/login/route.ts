import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";

const Body = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
  expectedRole: z.enum(["EMPLOYER", "SEEKER", "ADMIN"]).optional(),
});

export async function POST(req: NextRequest) {
  const data = Body.safeParse(await req.json().catch(() => ({})));
  if (!data.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: data.data.email } });
  if (!user || user.status === "SUSPENDED") return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await verifyPassword(data.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // Role guard — if caller specifies expectedRole, enforce it
  if (data.data.expectedRole && user.role !== data.data.expectedRole) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  await setSessionCookie(token);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
