import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project")
);

// Fallback Mock In-Memory Store
export const MOCK_PHARMACIES = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Apollo Pharmacy - Station Road Davangere",
    address: "Station Road, Opp. City Railway Station, Davangere, Karnataka - 577001",
    latitude: 14.4612,
    longitude: 75.9285,
    rating: 4.9,
    phone: "+91 81922 51234",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "City Care Pharmacy - Main Street Davangere",
    address: "Main Street, Near Clock Tower, Davangere, Karnataka - 577001",
    latitude: 14.4552,
    longitude: 75.9238,
    rating: 4.8,
    phone: "+91 81922 45678",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Vidyaprapti Meds - PB Road Davangere",
    address: "PB Road, Near Bapuji Hospital & Medical College, Davangere, Karnataka - 577004",
    latitude: 14.4670,
    longitude: 75.9175,
    rating: 4.9,
    phone: "+91 81922 78901",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Bapuji Chemist & Druggist - MCC 'B' Block Davangere",
    address: "MCC 'B' Block, Kuvempu Nagar, Davangere, Karnataka - 577002",
    latitude: 14.4725,
    longitude: 75.9360,
    rating: 4.6,
    phone: "+91 81922 34567",
  },
];

export const MOCK_MEDICINES = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    brand_name: "Dolo 650",
    generic_name: "Paracetamol 650mg",
    manufacturer: "Micro Labs Ltd",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    brand_name: "Augmentin 625 Duo",
    generic_name: "Amoxicillin & Potassium Clavulanate",
    manufacturer: "GlaxoSmithKline (GSK)",
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    brand_name: "Azee 500",
    generic_name: "Azithromycin 500mg",
    manufacturer: "Cipla Ltd",
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    brand_name: "Pan 40",
    generic_name: "Pantoprazole Gastro-Resistant 40mg",
    manufacturer: "Alkem Laboratories",
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    brand_name: "Cetzine 10",
    generic_name: "Cetirizine Hydrochloride 10mg",
    manufacturer: "Dr. Reddy's Laboratories",
  },
  {
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    brand_name: "Glycomet 500",
    generic_name: "Metformin Hydrochloride 500mg SR",
    manufacturer: "USV Private Ltd",
  },
];

export const MOCK_INVENTORY = [
  {
    id: "inv-1",
    pharmacy_id: "11111111-1111-1111-1111-111111111111",
    medicine_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    stock_qty: 45,
    price: 32.5,
    mfg_date: "2026-01-15",
    exp_date: "2028-06-30",
    pharmacies: MOCK_PHARMACIES[0],
    medicines: MOCK_MEDICINES[0],
  },
  {
    id: "inv-2",
    pharmacy_id: "11111111-1111-1111-1111-111111111111",
    medicine_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    stock_qty: 18,
    price: 198.0,
    mfg_date: "2026-03-10",
    exp_date: "2028-02-28",
    pharmacies: MOCK_PHARMACIES[0],
    medicines: MOCK_MEDICINES[1],
  },
  {
    id: "inv-3",
    pharmacy_id: "22222222-2222-2222-2222-222222222222",
    medicine_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    stock_qty: 28,
    price: 28.0,
    mfg_date: "2026-01-10",
    exp_date: "2028-05-31",
    pharmacies: MOCK_PHARMACIES[1],
    medicines: MOCK_MEDICINES[0],
  },
  {
    id: "inv-4",
    pharmacy_id: "22222222-2222-2222-2222-222222222222",
    medicine_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    stock_qty: 20,
    price: 115.0,
    mfg_date: "2026-02-15",
    exp_date: "2027-12-31",
    pharmacies: MOCK_PHARMACIES[1],
    medicines: MOCK_MEDICINES[2],
  },
  {
    id: "inv-5",
    pharmacy_id: "33333333-3333-3333-3333-333333333333",
    medicine_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    stock_qty: 4,
    price: 34.0,
    mfg_date: "2026-03-01",
    exp_date: "2028-08-31",
    pharmacies: MOCK_PHARMACIES[2],
    medicines: MOCK_MEDICINES[0],
  },
  {
    id: "inv-6",
    pharmacy_id: "44444444-4444-4444-4444-444444444444",
    medicine_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    stock_qty: 0,
    price: 31.0,
    mfg_date: "2025-11-15",
    exp_date: "2027-09-30",
    pharmacies: MOCK_PHARMACIES[3],
    medicines: MOCK_MEDICINES[0],
  },
];

// Persistent simulated orders store
export const MOCK_ORDERS: Record<string, unknown>[] = [];

// Real Supabase client instance or dummy client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      from: (table: string) => ({
        select: (columns?: string) => ({
          async then(resolve: (val: { data: unknown[]; error: unknown }) => void) {
            if (table === "inventory") {
              resolve({ data: MOCK_INVENTORY, error: null });
            } else if (table === "pharmacies") {
              resolve({ data: MOCK_PHARMACIES, error: null });
            } else if (table === "medicines") {
              resolve({ data: MOCK_MEDICINES, error: null });
            } else if (table === "orders") {
              resolve({ data: MOCK_ORDERS, error: null });
            } else {
              resolve({ data: [], error: null });
            }
          },
        }),
        insert: (records: Record<string, unknown> | Record<string, unknown>[]) => ({
          async select() {
            const list = Array.isArray(records) ? records : [records];
            const created = list.map((item) => ({
              id: "ord-" + Math.random().toString(36).substring(2, 9),
              created_at: new Date().toISOString(),
              ...item,
            }));
            MOCK_ORDERS.push(...created);
            return { data: created, error: null };
          },
        }),
      }),
    } as unknown as ReturnType<typeof createClient>);

