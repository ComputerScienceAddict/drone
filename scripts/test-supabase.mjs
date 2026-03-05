/**
 * Test Supabase connection and orders table
 * Run: node scripts/test-supabase.mjs
 * Requires: npm install @supabase/supabase-js (already in project)
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  console.log("Testing Supabase connection...\n");

  // Test 1: Insert a test order
  const testOrder = {
    items: [{ id: "test", name: "Test Item", price: 1, quantity: 1, image: "https://example.com/img.jpg" }],
    total: 1,
    latitude: 40.7128,
    longitude: -74.006,
    accuracy: 10,
  };

  const { data, error } = await supabase.from("orders").insert(testOrder).select();

  if (error) {
    console.error("❌ Insert failed:", error.message);
    if (error.message.includes("does not exist")) {
      console.log("\n→ Run the SQL in supabase/migrations/001_create_orders.sql in Supabase SQL Editor");
    }
    process.exit(1);
  }

  console.log("✓ Insert successful");
  console.log("  Order ID:", data[0]?.id);
  console.log("  Saved:", { items: testOrder.items.length, total: testOrder.total, lat: testOrder.latitude, lng: testOrder.longitude });

  // Test 2: Fetch recent orders
  const { data: orders, error: selectError } = await supabase
    .from("orders")
    .select("id, total, latitude, longitude, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  if (selectError) {
    console.error("❌ Select failed:", selectError.message);
    process.exit(1);
  }

  console.log("\n✓ Recent orders:", orders?.length ?? 0);
  if (orders?.length) {
    orders.forEach((o, i) => console.log(`  ${i + 1}. ${o.id} - $${o.total} @ ${o.latitude}, ${o.longitude}`));
  }

  console.log("\n✅ Supabase connection and orders table working!");
}

test();
