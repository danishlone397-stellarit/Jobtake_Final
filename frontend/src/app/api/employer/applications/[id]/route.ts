import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const Patch = z.object({
  stage: z.enum(["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED", "WITHDRAWN"]).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  note: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const app = await prisma.application.findUnique({ where: { id }, include: { job: true } });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "ADMIN" && app.job.postedById !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = Patch.safeParse(await req.json().catch(() => ({})));
  if (!data.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const updateData: { stage?: typeof app.stage; rating?: number | null } = {};
  if (data.data.stage && data.data.stage !== app.stage) {
    updateData.stage = data.data.stage;
    await prisma.applicationEvent.create({ data: { applicationId: app.id, fromStage: app.stage, toStage: data.data.stage } });
    await prisma.notification.create({
      data: {
        userId: app.userId,
        kind: "APPLICATION_STAGE_CHANGED",
        title: `Update on ${app.job.title}`,
        body: `Your application is now ${data.data.stage.replace("_", " ").toLowerCase()}`,
        linkUrl: `/dashboard/applications`,
      },
    });
  }
  if (typeof data.data.rating === "number") updateData.rating = data.data.rating;

  const updated = await prisma.application.update({ where: { id }, data: updateData });

  if (data.data.note) {
    await prisma.applicationNote.create({ data: { applicationId: id, authorId: user.id, body: data.data.note } });
  }

  return NextResponse.json({ application: updated });
}
