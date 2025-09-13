import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import { buyerBase } from "@/validators/buyer";

export async function POST(req: Request) {
  const ownerId = req.headers.get("x-user-id") || "demo-user";
  const ct = req.headers.get("content-type") || "";
  const text = await req.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  if (parsed.data.length > 200) return NextResponse.json({ error: "Max 200 rows" }, { status: 400 });
  const errors:any[] = [];
  const valids:any[] = [];
  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const mapped = {
      ...row,
      budgetMin: row.budgetMin ? parseInt(row.budgetMin,10) : undefined,
      budgetMax: row.budgetMax ? parseInt(row.budgetMax,10) : undefined,
      tags: row.tags ? row.tags.split("|").map((s:any)=>s.trim()).filter(Boolean) : []
    };
    try {
      const p = buyerBase.parse(mapped);
      valids.push(p);
    } catch (e:any) {
      errors.push({ row: i+2, message: e?.errors ?? e?.message ?? String(e) });
    }
  }
  // insert valids in transaction
  const inserts = valids.map(v => prisma.buyer.create({ data: { ...v, ownerId } }));
  if (inserts.length > 0) await prisma.$transaction(inserts);
  return NextResponse.json({ inserted: inserts.length, errors });
}
