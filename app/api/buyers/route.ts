import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buyerBase } from "@/validators/buyer";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 1);
  const q = url.searchParams.get("q") || "";
  const take = 10;
  const where:any = {};
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { email: { contains: q, mode: "insensitive" } }
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.buyer.findMany({ where, skip: (page-1)*take, take, orderBy: { updatedAt: "desc" } }),
    prisma.buyer.count({ where })
  ]);
  return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
  // very small auth stub: reads ownerId from header 'x-user-id'
  const ownerId = req.headers.get("x-user-id") || "demo-user";
  const body = await req.json();
  try {
    const parsed = buyerBase.parse(body);
    const created = await prisma.buyer.create({ data: { ...parsed, ownerId } });
    // write history
    await prisma.buyerHistory.create({ data: { buyerId: created.id, changedBy: ownerId, diff: { created: parsed } }});
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e:any) {
    return NextResponse.json({ error: e?.errors ?? e?.message ?? String(e) }, { status: 400 });
  }
}
