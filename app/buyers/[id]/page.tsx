import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BuyerView({ params }: any) {
  const id = params.id;
  const buyer = await prisma.buyer.findUnique({ where: { id }, include: { histories: { orderBy: { changedAt: "desc" }, take: 5 } }});
  if (!buyer) return <main style={{padding:20}}>Not found</main>;
  return (
    <main style={{padding:20}}>
      <h1>{buyer.fullName}</h1>
      <div><strong>Phone:</strong> {buyer.phone}</div>
      <div><strong>Email:</strong> {buyer.email}</div>
      <div><strong>City:</strong> {buyer.city}</div>
      <div><strong>Type:</strong> {buyer.propertyType}</div>
      <div><strong>BHK:</strong> {buyer.bhk}</div>
      <div><strong>Budget:</strong> {buyer.budgetMin ?? "-"} - {buyer.budgetMax ?? "-"}</div>
      <div><strong>Timeline:</strong> {buyer.timeline}</div>
      <div><strong>Status:</strong> {buyer.status}</div>
      <div style={{marginTop:10}}>
        <Link href={`/buyers`}>Back</Link> | <Link href={`/buyers/${buyer.id}/edit`}>Edit</Link>
      </div>

      <h2>History (last 5)</h2>
      <ul>
        {buyer.histories.map(h => (
          <li key={h.id}>
            <strong>{new Date(h.changedAt).toLocaleString()}</strong> by {h.changedBy}
            <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(h.diff, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </main>
  );
}
