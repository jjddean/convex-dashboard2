const payload = {
  origin: "London, UK",
  destination: "Hamburg, DE",
  serviceType: "ocean",
  cargoType: "general",
  weight: "1",
  dimensions: { length: "1", width: "1", height: "1" },
  value: "0",
  incoterms: "EXW",
  urgency: "standard",
  additionalServices: [],
  contactInfo: { name: "Test", email: "test@example.com", phone: "000", company: "" },
};

async function main() {
  try {
    const res = await fetch("http://localhost:3000/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log(text);
    if (!res.ok) process.exit(1);
  } catch (e) {
    console.error("Request failed:", e);
    process.exit(1);
  }
}

main();

