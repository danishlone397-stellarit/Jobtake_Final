import { NextResponse } from "next/server";
import { getManagedOptions } from "@/lib/job-options";

export async function GET() {
  const options = await getManagedOptions(true, true);
  return NextResponse.json({ options });
}
