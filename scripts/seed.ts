import { prisma } from "../lib/prisma";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com", name: "Demo User" }
  });
  await prisma.buyer.createMany({
    data: [
      { fullName: "Ravi Kumar", phone: "9876543210", city: "CHANDIGARH", propertyType: "APARTMENT", bhk: "TWO", purpose: "BUY", timeline: "ZERO_3M", source: "WEBSITE", ownerId: user.id },
      { fullName: "Anita Sharma", phone: "9123456780", city: "MOHALI", propertyType: "VILLA", bhk: "THREE", purpose: "BUY", timeline: "THREE_6M", source: "REFERRAL", ownerId: user.id }
    ] as any
  });
  console.log("Seed done");
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>process.exit());
