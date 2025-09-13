import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BuyersPage({ searchParams }: any) {
  const page = Number(searchParams?.page || 1);
  const q = searchParams?.q || "";
  const take = 10;
  const where: any = {};
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
  return (
    <main style={{padding:20}}>
      <h1>Buyers</h1>
      <div style={{marginBottom:10}}>
        <Link href="/buyers/new">Create new buyer</Link>
      </div>
      <table border={1} cellPadding={6}>
        <thead>
          <tr><th>Name</th><th>Phone</th><th>City</th><th>Type</th><th>Budget</th><th>Timeline</th><th>Status</th><th>UpdatedAt</th></tr>
        </thead>
        <tbody>
          {items.map((b: any) => (
            <tr key={b.id}>
              <td><Link href={`/buyers/${b.id}`}>{b.fullName}</Link></td>
              <td>{b.phone}</td>
              <td>{b.city}</td>
              <td>{b.propertyType}</td>
              <td>{b.budgetMin ?? "-"} - {b.budgetMax ?? "-"}</td>
              <td>{b.timeline}</td>
              <td>{b.status}</td>
              <td>{new Date(b.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:10}}>
        Page: {page} / {Math.ceil(total / take)}
      </div>
    </main>
  );
}
