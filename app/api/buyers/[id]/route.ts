import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buyerBase } from "@/validators/buyer";

export async function GET(req: Request, { params }: any) {
  const id = params.id;
  const buyer = await prisma.buyer.findUnique({ where: { id }});
  if (!buyer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(buyer);
}

export async function PUT(req: Request, { params }: any) {
  const id = params.id;
  const ownerId = req.headers.get("x-user-id") || "demo-user";
  const body = await req.json();
  try {
    const parsed = buyerBase.parse(body);
    const existing = await prisma.buyer.findUnique({ where: { id }});
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.ownerId !== ownerId && ownerId !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // concurrency check
    if (body.updatedAt && new Date(body.updatedAt).getTime() !== existing.updatedAt.getTime()) {
      return NextResponse.json({ error: "Record changed, please refresh" }, { status: 409 });
    }
    const updated = await prisma.buyer.update({ where: { id }, data: parsed });
    // diff
    const diff:any = {};
    for (const k of Object.keys(parsed)) {
      if ((existing as any)[k] !== (parsed as any)[k]) diff[k] = [(existing as any)[k], (parsed as any)[k]];
    }
    await prisma.buyerHistory.create({ data: { buyerId: id, changedBy: ownerId, diff }});
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e?.errors ?? e?.message ?? String(e) }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  const id = params.id;
  const ownerId = req.headers.get("x-user-id") || "demo-user";
  const existing = await prisma.buyer.findUnique({ where: { id }});
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.ownerId !== ownerId && ownerId !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.buyer.delete({ where: { id }});
  return NextResponse.json({ ok: true });
}
