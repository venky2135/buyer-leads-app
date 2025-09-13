import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const where:any = {};
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { email: { contains: q, mode: "insensitive" } }
    ];
  }
  const items = await prisma.buyer.findMany({ where, orderBy: { updatedAt: "desc" } });
  const headers = "fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status\n";
  const rows = items.map(it => {
    const tags = (it.tags || []).join("|");
    return `${it.fullName},${it.email||""},${it.phone},${it.city},${it.propertyType},${it.bhk||""},${it.purpose},${it.budgetMin||""},${it.budgetMax||""},${it.timeline},${it.source},${(it.notes||"").replace(/\n/g," ")},"${tags}",${it.status}`;
  }).join("\n");
  const csv = headers + rows;
  return new Response(csv, { headers: { "Content-Type":"text/csv", "Content-Disposition":"attachment; filename="buyers.csv"" }});
}
