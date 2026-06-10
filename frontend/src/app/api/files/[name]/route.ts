import { NextRequest, NextResponse } from "next/server";
import { readUpload, mimeFromName } from "@/lib/uploads";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const data = await readUpload(name);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": mimeFromName(name),
      "Cache-Control": "private, max-age=3600",
    },
  });
}