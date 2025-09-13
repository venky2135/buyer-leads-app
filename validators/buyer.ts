import { z } from "zod";

export const CityEnum = z.enum(["Chandigarh","Mohali","Zirakpur","Panchkula","Other"]);
export const PropertyTypeEnum = z.enum(["Apartment","Villa","Plot","Office","Retail"]);
export const BhkEnum = z.enum(["1","2","3","4","Studio"]);
export const PurposeEnum = z.enum(["Buy","Rent"]);
export const TimelineEnum = z.enum(["0-3m","3-6m",">6m","Exploring"]);
export const SourceEnum = z.enum(["Website","Referral","Walk-in","Call","Other"]);
export const StatusEnum = z.enum(["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"]);

export const buyerBase = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")).transform((v)=> v || undefined),
  phone: z.string().regex(/^\d{10,15}$/, "phone must be 10-15 digits"),
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  bhk: z.string().optional(),
  purpose: PurposeEnum,
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: TimelineEnum,
  source: SourceEnum,
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  status: StatusEnum.optional()
}).superRefine((data, ctx) => {
  if ((data.propertyType === "Apartment" || data.propertyType === "Villa") && !data.bhk) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "BHK is required for Apartment/Villa", path: ["bhk"]});
  }
  if (data.budgetMin != null && data.budgetMax != null && data.budgetMax < data.budgetMin) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "budgetMax must be >= budgetMin", path: ["budgetMax"]});
  }
});
