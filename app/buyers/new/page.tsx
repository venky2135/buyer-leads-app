'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBuyer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", city: "Chandigarh", propertyType: "Apartment",
    bhk: "1", purpose: "Buy", budgetMin: "", budgetMax: "", timeline: "0-3m", source: "Website", notes: "", tags: ""
  });

  async function submit(e:any) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      tags: form.tags ? form.tags.split(",").map(s=>s.trim()).filter(Boolean) : []
    };
    const res = await fetch("/api/buyers", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type":"application/json" } });
    if (res.ok) {
      router.push("/buyers");
    } else {
      const j = await res.json();
      alert("Error: " + (j?.error || res.statusText));
    }
    setLoading(false);
  }

  return (
    <main style={{padding:20}}>
      <h1>Create Buyer</h1>
      <form onSubmit={submit}>
        <div><label>Full name<br/><input value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} required/></label></div>
        <div><label>Email<br/><input value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/></label></div>
        <div><label>Phone<br/><input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} required/></label></div>
        <div><label>City<br/>
          <select value={form.city} onChange={e=>setForm({...form, city: e.target.value})}>
            <option>Chandigarh</option><option>Mohali</option><option>Zirakpur</option><option>Panchkula</option><option>Other</option>
          </select>
        </label></div>
        <div><label>Property Type<br/>
          <select value={form.propertyType} onChange={e=>setForm({...form, propertyType: e.target.value})}>
            <option>Apartment</option><option>Villa</option><option>Plot</option><option>Office</option><option>Retail</option>
          </select>
        </label></div>
        <div><label>BHK (if applicable)<br/><input value={form.bhk} onChange={e=>setForm({...form, bhk: e.target.value})}/></label></div>
        <div><label>Purpose<br/>
          <select value={form.purpose} onChange={e=>setForm({...form, purpose: e.target.value})}><option>Buy</option><option>Rent</option></select>
        </label></div>
        <div><label>Budget Min<br/><input value={form.budgetMin} onChange={e=>setForm({...form, budgetMin: e.target.value})}/></label></div>
        <div><label>Budget Max<br/><input value={form.budgetMax} onChange={e=>setForm({...form, budgetMax: e.target.value})}/></label></div>
        <div><label>Timeline<br/>
          <select value={form.timeline} onChange={e=>setForm({...form, timeline: e.target.value})}>
            <option>0-3m</option><option>3-6m</option><option>&gt;6m</option><option>Exploring</option>
          </select>
        </label></div>
        <div><label>Source<br/>
          <select value={form.source} onChange={e=>setForm({...form, source: e.target.value})}>
            <option>Website</option><option>Referral</option><option>Walk-in</option><option>Call</option><option>Other</option>
          </select>
        </label></div>
        <div><label>Notes<br/><textarea value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})}></textarea></label></div>
        <div><label>Tags (comma-separated)<br/><input value={form.tags} onChange={e=>setForm({...form, tags: e.target.value})}/></label></div>
        <div style={{marginTop:10}}><button type="submit" disabled={loading}>{loading? "Saving...":"Save"}</button></div>
      </form>
    </main>
  );
}
