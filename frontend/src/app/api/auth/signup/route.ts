import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";

const Body = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().trim().optional().default(""),
  location: z.string().trim().optional().default(""),
  role: z.enum(["SEEKER", "EMPLOYER"]).default("SEEKER"),
});

export async function POST(req: NextRequest) {
  const data = Body.safeParse(await req.json().catch(() => ({})));
  if (!data.success) return NextResponse.json({ error: "Invalid input", details: data.error.flatten() }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: data.data.email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const passwordHash = await hashPassword(data.data.password);
  const user = await prisma.user.create({
    data: {
      email: data.data.email,
      name: data.data.name,
      phone: data.data.phone || null,
      location: data.data.location || null,
      role: data.data.role,
      passwordHash,
    },
    select: { id: true, email: true, name: true, role: true },
  });

  const token = await signSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  await setSessionCookie(token);

  await prisma.auditLog.create({ data: { userId: user.id, action: "auth.signup", entity: "User", entityId: user.id } }).catch(() => null);

  return NextResponse.json({ user });
}
