import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, slugify } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== "EMPLOYER") return jsonError("Unauthorized", 401);

  const body = await req.json();
  const { name, tagline, description, website, industry, size, founded, headquarters, logoUrl, bannerUrl } = body;

  if (!name?.trim()) return jsonError("Company name is required");

  const company = await prisma.company.findFirst({ where: { ownerId: me.id } });
  if (!company) return jsonError("Company not found", 404);

  const updated = await prisma.company.update({
    where: { id: company.id },
    data: {
      name: name.trim(),
      tagline: tagline?.trim() || null,
      description: description?.trim() || null,
      website: website?.trim() || null,
      industry: industry?.trim() || null,
      size: size?.trim() || null,
      founded: founded ? parseInt(founded) : null,
      headquarters: headquarters?.trim() || null,
      logoUrl: logoUrl?.trim() || null,
      bannerUrl: bannerUrl?.trim() || null,
    },
  });

  return jsonOk({ company: updated });
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== "EMPLOYER") return jsonError("Unauthorized", 401);

  const body = await req.json();
  const { name, tagline, description, website, industry, size, founded, headquarters, logoUrl, bannerUrl } = body;

  if (!name?.trim()) return jsonError("Company name is required");

  const existing = await prisma.company.findFirst({ where: { ownerId: me.id } });
  if (existing) return jsonError("Company already exists. Use PUT to update.", 400);

  const slug = slugify(name) + "-" + Date.now().toString(36);

  const company = await prisma.company.create({
    data: {
      ownerId: me.id,
      name: name.trim(),
      slug,
      tagline: tagline?.trim() || null,
      description: description?.trim() || null,
      website: website?.trim() || null,
      industry: industry?.trim() || null,
      size: size?.trim() || null,
      founded: founded ? parseInt(founded) : null,
      headquarters: headquarters?.trim() || null,
      logoUrl: logoUrl?.trim() || null,
      bannerUrl: bannerUrl?.trim() || null,
    },
  });

  return jsonOk({ company }, 201);
}
