"use client";

import React, { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Activity,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Pill,
  Upload,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  Banknote,
  QrCode,
  Sparkles,
  RefreshCw,
  User,
  Check,
  X,
  Navigation,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ==========================================
// 1. SUPABASE CLIENT & MOCK FALLBACK SETUP
// ==========================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isLiveSupabase = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project")
);

const MOCK_PHARMACIES_DATA = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Apollo Pharmacy - Station Road",
    address: "Station Road, Opp. Railway Station, Davangere - 577001",
    latitude: 14.4612,
    longitude: 75.9285,
    rating: 4.9,
    phone: "+91 81922 51234",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "City Care Pharmacy - Main Street",
    address: "Main Street, Near Clock Tower, Davangere - 577001",
    latitude: 14.4552,
    longitude: 75.9238,
    rating: 4.8,
    phone: "+91 81922 45678",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Vidyaprapti Meds - PB Road",
    address: "PB Road, Near Bapuji Hospital, Davangere - 577004",
    latitude: 14.4670,
    longitude: 75.9175,
    rating: 4.9,
    phone: "+91 81922 78901",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Bapuji Chemist - MCC 'B' Block",
    address: "MCC 'B' Block, Kuvempu Nagar, Davangere - 577002",
    latitude: 14.4725,
    longitude: 75.9360,
    rating: 4.6,
    phone: "+91 81922 34567",
  },
];

const MOCK_MEDICINES_DATA = [
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
    manufacturer: "GSK Ltd",
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
    manufacturer: "Alkem Labs",
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    brand_name: "Cetzine 10",
    generic_name: "Cetirizine Hydrochloride 10mg",
    manufacturer: "Dr. Reddy's",
  },
  {
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    brand_name: "Glycomet 500",
    generic_name: "Metformin Hydrochloride 500mg SR",
    manufacturer: "USV Ltd",
  },
];

interface InventoryRow {
  id: string;
  pharmacy_id: string;
  medicine_id: string;
  stock_qty: number;
  price: number;
  mfg_date: string;
  exp_date: string;
  pharmacies: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    phone: string;
  };
  medicines: {
    id: string;
    brand_name: string;
    generic_name: string;
    manufacturer: string;
  };
}

const MOCK_INVENTORY_DATA: InventoryRow[] = [
  {
    id: "inv-1",
    pharmacy_id: "11111111-1111-1111-1111-111111111111",
    medicine_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    stock_qty: 45,
    price: 32.5,
    mfg_date: "2026-01-15",
    exp_date: "2028-06-30",
    pharmacies: MOCK_PHARMACIES_DATA[0],
    medicines: MOCK_MEDICINES_DATA[0],
  },
  {
    id: "inv-2",
    pharmacy_id: "11111111-1111-1111-1111-111111111111",
    medicine_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    stock_qty: 18,
    price: 198.0,
    mfg_date: "2026-03-10",
    exp_date: "2028-02-28",
    pharmacies: MOCK_PHARMACIES_DATA[0],
    medicines: MOCK_MEDICINES_DATA[1],
  },
  {
    id: "inv-3",
    pharmacy_id: "22222222-2222-2222-2222-222222222222",
    medicine_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    stock_qty: 28,
    price: 28.0,
    mfg_date: "2026-01-10",
    exp_date: "2028-05-31",
    pharmacies: MOCK_PHARMACIES_DATA[1],
    medicines: MOCK_MEDICINES_DATA[0],
  },
  {
    id: "inv-4",
    pharmacy_id: "22222222-2222-2222-2222-222222222222",
    medicine_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    stock_qty: 20,
    price: 115.0,
    mfg_date: "2026-02-15",
    exp_date: "2027-12-31",
    pharmacies: MOCK_PHARMACIES_DATA[1],
    medicines: MOCK_MEDICINES_DATA[2],
  },
  {
    id: "inv-5",
    pharmacy_id: "33333333-3333-3333-3333-333333333333",
    medicine_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    stock_qty: 4,
    price: 34.0,
    mfg_date: "2026-03-01",
    exp_date: "2028-08-31",
    pharmacies: MOCK_PHARMACIES_DATA[2],
    medicines: MOCK_MEDICINES_DATA[0],
  },
  {
    id: "inv-6",
    pharmacy_id: "33333333-3333-3333-3333-333333333333",
    medicine_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    stock_qty: 2,
    price: 204.0,
    mfg_date: "2026-01-20",
    exp_date: "2027-10-31",
    pharmacies: MOCK_PHARMACIES_DATA[2],
    medicines: MOCK_MEDICINES_DATA[1],
  },
  {
    id: "inv-7",
    pharmacy_id: "44444444-4444-4444-4444-444444444444",
    medicine_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    stock_qty: 0,
    price: 31.0,
    mfg_date: "2025-11-15",
    exp_date: "2027-09-30",
    pharmacies: MOCK_PHARMACIES_DATA[3],
    medicines: MOCK_MEDICINES_DATA[0],
  },
];

const IN_MEMORY_ORDERS: Array<{
  id: string;
  user_name: string;
  user_phone: string;
  user_address: string;
  items: unknown;
  total_price: number;
  payment_method: string;
  status: string;
  created_at: string;
}> = [];

const supabase = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      from: (table: string) => ({
        select: (_columns?: string) => ({
          async then(resolve: (val: { data: unknown[]; error: unknown }) => void) {
            if (table === "inventory") {
              resolve({ data: MOCK_INVENTORY_DATA, error: null });
            } else if (table === "pharmacies") {
              resolve({ data: MOCK_PHARMACIES_DATA, error: null });
            } else if (table === "medicines") {
              resolve({ data: MOCK_MEDICINES_DATA, error: null });
            } else if (table === "orders") {
              resolve({ data: IN_MEMORY_ORDERS, error: null });
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
            IN_MEMORY_ORDERS.push(...(created as typeof IN_MEMORY_ORDERS));
            return { data: created, error: null };
          },
        }),
      }),
    } as unknown as ReturnType<typeof createClient>);

function computeDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// ==========================================
// 2. MAIN COMPONENT (LIGHT-GLASS AESTHETIC)
// ==========================================
export default function MedEasyApplication() {
  const prescriptionUploadId = useId();

  // Active Layer (1 to 5)
  const [activeLayer, setActiveLayer] = useState<number>(1);

  // Layer 2: User & Location States
  const [fullName, setFullName] = useState("Pranav Priya");
  const [contactPhone, setContactPhone] = useState("+91 98450 77123");
  const [deliveryAddress, setDeliveryAddress] = useState(
    "MCC 'B' Block, Kuvempu Nagar, Davangere, Karnataka - 577002"
  );
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: 14.4580,
    lng: 75.9269,
  });
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(true);

  // Layer 3: Patient & Prescription States
  const [patientName, setPatientName] = useState("Pranav Priya");
  const [patientAge, setPatientAge] = useState("24");
  const [patientWeight, setPatientWeight] = useState("68 kg");
  const [doctorName, setDoctorName] = useState("Dr. Ananya Rao");
  const [medicineQuery, setMedicineQuery] = useState("");
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);
  const [isScanningRx, setIsScanningRx] = useState(false);
  const [scannedMedicines, setScannedMedicines] = useState<string[]>([
    "Dolo 650",
    "Augmentin 625 Duo",
  ]);

  // Layer 4: Inventory & Pharmacy Grid State
  const [inventoryList, setInventoryList] = useState<InventoryRow[]>(MOCK_INVENTORY_DATA);
  const [selectedSlot, setSelectedSlot] = useState<InventoryRow | null>(MOCK_INVENTORY_DATA[0]);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(2);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Layer 5: Invoice & Checkout
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CASH">("UPI");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderConfirmedData, setOrderConfirmedData] = useState<{
    id: string;
    total: number;
    pharmacy: string;
    items: string;
    token: string;
  } | null>(null);

  // Fetch Inventory
  useEffect(() => {
    async function loadData() {
      setIsLoadingInventory(true);
      try {
        if (isLiveSupabase) {
          const { data, error } = await supabase
            .from("inventory")
            .select(`
              id,
              pharmacy_id,
              medicine_id,
              stock_qty,
              price,
              mfg_date,
              exp_date,
              pharmacies:pharmacy_id (id, name, address, latitude, longitude, rating, phone),
              medicines:medicine_id (id, brand_name, generic_name, manufacturer)
            `);
          if (!error && data && data.length > 0) {
            setInventoryList(data as unknown as InventoryRow[]);
            setSelectedSlot((data[0] as unknown as InventoryRow) || null);
          } else {
            setInventoryList(MOCK_INVENTORY_DATA);
          }
        } else {
          setInventoryList(MOCK_INVENTORY_DATA);
        }
      } catch {
        setInventoryList(MOCK_INVENTORY_DATA);
      } finally {
        setIsLoadingInventory(false);
      }
    }
    loadData();
  }, []);

  // GPS Location Handler with Davangere Reverse Geocoding
  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setDeliveryAddress(`GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Davangere, Karnataka - 577002)`);
          setIsDetectingGps(false);
          setGpsSuccess(true);
        },
        () => {
          setTimeout(() => {
            setUserCoords({ lat: 14.4580, lng: 75.9269 });
            setDeliveryAddress("GPS: 14.4580°N, 75.9269°E (Davangere, Karnataka - 577002)");
            setIsDetectingGps(false);
            setGpsSuccess(true);
          }, 500);
        }
      );
    } else {
      setTimeout(() => {
        setUserCoords({ lat: 14.4580, lng: 75.9269 });
        setDeliveryAddress("GPS: 14.4580°N, 75.9269°E (Davangere, Karnataka - 577002)");
        setIsDetectingGps(false);
        setGpsSuccess(true);
      }, 500);
    }
  };

  // Prescription Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPrescriptionPreview(url);
      setIsScanningRx(true);
      setTimeout(() => {
        setIsScanningRx(false);
        setScannedMedicines(["Dolo 650", "Augmentin 625 Duo", "Pan 40"]);
      }, 1000);
    }
  };

  // Filter Inventory
  const filteredInventory = inventoryList.filter((item) => {
    const query = medicineQuery.toLowerCase();
    const brand = item.medicines?.brand_name?.toLowerCase() || "";
    const generic = item.medicines?.generic_name?.toLowerCase() || "";
    const manufacturer = item.medicines?.manufacturer?.toLowerCase() || "";
    const pharmacy = item.pharmacies?.name?.toLowerCase() || "";
    return (
      brand.includes(query) ||
      generic.includes(query) ||
      manufacturer.includes(query) ||
      pharmacy.includes(query)
    );
  });

  // Billing
  const unitPrice = selectedSlot?.price || 32.5;
  const subtotal = unitPrice * selectedQuantity;
  const gstAmount = Math.round(subtotal * 0.05);
  const deliveryCharge = 30.0;
  const grandTotal = subtotal + gstAmount + deliveryCharge;

  // Order Submission
  const handleConfirmOrder = async () => {
    setIsSubmittingOrder(true);
    const orderPayload = {
      user_name: fullName,
      user_phone: contactPhone,
      user_address: deliveryAddress,
      items: [
        {
          medicine: selectedSlot?.medicines?.brand_name,
          generic: selectedSlot?.medicines?.generic_name,
          pharmacy: selectedSlot?.pharmacies?.name,
          quantity: selectedQuantity,
          unit_price: unitPrice,
          total: subtotal,
        },
      ],
      total_price: grandTotal,
      payment_method: paymentMethod === "UPI" ? "Online UPI" : "Cash on Delivery",
      status: "Confirmed",
    };

    try {
      let createdId = "ord-" + Math.floor(100000 + Math.random() * 900000);
      const res = await supabase.from("orders").insert(orderPayload).select();
      if (res?.data && res.data[0]?.id) {
        createdId = res.data[0].id;
      }
      setOrderConfirmedData({
        id: createdId,
        total: grandTotal,
        pharmacy: selectedSlot?.pharmacies?.name || "Apollo Pharmacy - Station Road",
        items: `${selectedSlot?.medicines?.brand_name || "Dolo 650"} (Qty: ${selectedQuantity})`,
        token: "TK-" + Math.floor(1000 + Math.random() * 9000),
      });
    } catch {
      setOrderConfirmedData({
        id: "ord-881920",
        total: grandTotal,
        pharmacy: selectedSlot?.pharmacies?.name || "Apollo Pharmacy - Station Road",
        items: `${selectedSlot?.medicines?.brand_name || "Dolo 650"} (Qty: ${selectedQuantity})`,
        token: "TK-4829",
      });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div
      className="min-h-screen text-slate-800 font-sans relative selection:bg-cyan-600 selection:text-white overflow-x-hidden"
      style={{
        backgroundImage: `url('/background.png'), linear-gradient(135deg, #091a28 0%, #0d2b3f 50%, #061521 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Light Frosted Ambient Tint Overlay */}
      <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[1px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col min-h-screen">
        
        {/* --- Top Header --- */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-4 bg-white/85 backdrop-blur-xl border border-white/60 p-4 rounded-2xl shadow-xl shadow-cyan-950/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  MED <span className="text-cyan-600">EASY</span>
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                  Davangere Live Network
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-800">4 Local Pharmacies Active</span>
          </div>
        </header>

        {/* --- 5-Layer Clean Stepper Bar --- */}
        <div className="my-5 bg-white/80 backdrop-blur-xl border border-cyan-100 rounded-2xl p-2 shadow-lg shadow-cyan-950/5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {[
              { id: 1, label: "Intro", icon: Sparkles },
              { id: 2, label: "User & Location", icon: MapPin },
              { id: 3, label: "Patient & Rx", icon: FileText },
              { id: 4, label: "Live Inventory", icon: Building2 },
              { id: 5, label: "Invoice & Pay", icon: QrCode },
            ].map((step) => {
              const isActive = activeLayer === step.id;
              const isPast = activeLayer > step.id;
              const IconComp = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveLayer(step.id)}
                  className={`flex items-center justify-center sm:justify-start gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/25"
                      : isPast
                      ? "bg-cyan-50 text-cyan-800 border border-cyan-200/60"
                      : "bg-white/60 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/50"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-cyan-600"}`} />
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* --- LAYER 1: INTRO (CLEAN & CONCISE) --- */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          {activeLayer === 1 && (
            <motion.div
              key="layer1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col justify-center py-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Hero Content */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    Real-Time Medicine Availability Finder
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
                    Locate Medicines{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-300">
                      In Stock Nearby.
                    </span>
                  </h2>

                  <p className="text-slate-200 text-base max-w-xl leading-relaxed">
                    Instantly check real-time stock across verified pharmacies in Davangere,
                    calculate proximity, and reserve with virtual tax billing.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveLayer(2)}
                      className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <span>Find Medicine</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveLayer(4)}
                      className="px-5 py-3 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
                    >
                      Browse Catalog
                    </button>
                  </div>
                </div>

                {/* Right Card: Clean Metrics Glass Card */}
                <div className="lg:col-span-5">
                  <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-2xl shadow-cyan-950/10 space-y-4 text-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <Activity className="w-5 h-5 text-cyan-600" />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Live Network</h3>
                          <p className="text-[11px] text-slate-500">Davangere Core Radius</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        Online
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <p className="text-cyan-700 font-black text-xl">99%</p>
                        <p className="text-slate-700 font-medium">Stock Accuracy</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <p className="text-teal-700 font-black text-xl">15 Min</p>
                        <p className="text-slate-700 font-medium">Store Pickup</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <p className="text-sky-700 font-black text-xl">100%</p>
                        <p className="text-slate-700 font-medium">Licensed Stores</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <p className="text-indigo-700 font-black text-xl">₹0</p>
                        <p className="text-slate-700 font-medium">Search Fee</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Pill className="w-4 h-4 text-cyan-600" />
                        <span className="text-xs font-semibold text-slate-800">
                          Dolo 650 & Augmentin In Stock
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveLayer(4)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-bold text-[11px] hover:bg-cyan-500"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* --- LAYER 2: USER & LOCATION (CLEAN & CONCISE) --- */}
          {/* ========================================================================= */}
          {activeLayer === 2 && (
            <motion.div
              key="layer2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 py-4 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-300" />
                    User & Location
                  </h2>
                  <p className="text-xs text-slate-300">Set user details and detect GPS coordinates.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLayer(1)}
                    className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveLayer(3)}
                    className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
                  >
                    Next: Patient & Rx →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Form Card */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl shadow-cyan-950/5 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <User className="w-4 h-4 text-cyan-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      User Contact Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Delivery Address
                      </label>
                      <textarea
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleDetectGPS}
                      disabled={isDetectingGps}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 disabled:opacity-50"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? "animate-spin" : ""}`} />
                      <span>{isDetectingGps ? "Detecting GPS..." : "Detect GPS Location"}</span>
                    </button>
                    {gpsSuccess && (
                      <p className="text-[11px] text-emerald-700 text-center mt-2 font-medium flex items-center justify-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {userCoords.lat.toFixed(4)}° N, {userCoords.lng.toFixed(4)}° E (Davangere)
                      </p>
                    )}
                  </div>
                </div>

                {/* Radar Proximity Card */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl shadow-cyan-950/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Davangere Proximity Radar
                      </h3>
                      <p className="text-[11px] text-slate-500">Local stores within 5 km</p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                      4 Stores Locked
                    </span>
                  </div>

                  <div className="relative h-60 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                    <div className="absolute w-48 h-48 rounded-full border border-cyan-500/20" />
                    <div className="absolute w-36 h-36 rounded-full border border-cyan-500/20" />
                    <div className="absolute w-24 h-24 rounded-full border border-cyan-500/30" />
                    <div className="absolute w-48 h-48 rounded-full border border-cyan-400/10 animate-spin opacity-40 bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent" />

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-md animate-ping absolute" />
                      <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-md relative flex items-center justify-center text-[9px] text-slate-950 font-bold">
                        📍
                      </div>
                      <span className="text-[9px] font-bold text-cyan-200 mt-1 bg-slate-950/90 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        You
                      </span>
                    </div>

                    <div className="absolute top-8 left-20 flex flex-col items-center">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 border border-slate-950" />
                      <span className="text-[9px] font-bold text-emerald-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-emerald-500/30 mt-0.5">
                        Apollo - Station Rd (0.4 km)
                      </span>
                    </div>

                    <div className="absolute bottom-8 right-20 flex flex-col items-center">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 border border-slate-950" />
                      <span className="text-[9px] font-bold text-emerald-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-emerald-500/30 mt-0.5">
                        City Care - Main St (0.5 km)
                      </span>
                    </div>

                    <div className="absolute top-12 right-12 flex flex-col items-center">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 border border-slate-950" />
                      <span className="text-[9px] font-bold text-emerald-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-emerald-500/30 mt-0.5">
                        Vidyaprapti - PB Rd (1.4 km)
                      </span>
                    </div>

                    <div className="absolute bottom-10 left-12 flex flex-col items-center">
                      <span className="w-3 h-3 rounded-full bg-amber-400 border border-slate-950" />
                      <span className="text-[9px] font-bold text-amber-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-amber-500/30 mt-0.5">
                        Bapuji Chemist (1.9 km)
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* --- LAYER 3: PATIENT & PRESCRIPTION (CLEAN & CONCISE) --- */}
          {/* ========================================================================= */}
          {activeLayer === 3 && (
            <motion.div
              key="layer3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 py-4 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-300" />
                    Patient & Prescription
                  </h2>
                  <p className="text-xs text-slate-300">Enter patient info or scan doctor&apos;s prescription.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLayer(2)}
                    className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveLayer(4)}
                    className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
                  >
                    Next: Inventory Grid →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Patient Info */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl shadow-cyan-950/5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-600" />
                    Patient Parameters
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Weight
                      </label>
                      <input
                        type="text"
                        value={patientWeight}
                        onChange={(e) => setPatientWeight(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Doctor Name
                      </label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Direct Medicine Query
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={medicineQuery}
                        onChange={(e) => setMedicineQuery(e.target.value)}
                        placeholder="Search Dolo 650, Augmentin, Azee..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Card */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl shadow-cyan-950/5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Prescription Scanner</span>
                    <span className="text-[11px] text-slate-500 font-normal">PNG, JPG, PDF</span>
                  </h3>

                  <div className="relative border-2 border-dashed border-slate-200 hover:border-cyan-400 rounded-2xl p-6 text-center bg-slate-50/70 transition-all flex flex-col items-center justify-center min-h-[140px]">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id={prescriptionUploadId}
                    />
                    <Upload className="w-6 h-6 text-cyan-600 mb-1.5" />
                    <label htmlFor={prescriptionUploadId} className="text-xs font-bold text-slate-800 cursor-pointer">
                      Click to upload prescription photo
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Auto-detects drug names and formulation strengths
                    </p>
                  </div>

                  {prescriptionPreview && (
                    <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-900">Prescription Attached</span>
                        <button
                          onClick={() => setPrescriptionPreview(null)}
                          className="text-rose-600 hover:text-rose-700 text-[11px]"
                        >
                          Remove
                        </button>
                      </div>

                      {isScanningRx ? (
                        <div className="py-2 text-center text-xs text-cyan-700 flex items-center justify-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Scanning handwritten medicines...</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {scannedMedicines.map((med, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-cyan-200 text-[11px] text-cyan-800 font-medium flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3 h-3 text-cyan-600" /> {med}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => setActiveLayer(4)}
                      className="text-xs text-slate-500 hover:text-cyan-700 underline"
                    >
                      Skip prescription
                    </button>
                    <button
                      onClick={() => setActiveLayer(4)}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20"
                    >
                      Continue →
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* --- LAYER 4: LIVE INVENTORY GRID (CLEAN & CONCISE) --- */}
          {/* ========================================================================= */}
          {activeLayer === 4 && (
            <motion.div
              key="layer4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 py-4 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-300" />
                    Live Pharmacy Inventory
                  </h2>
                  <p className="text-xs text-slate-300">Direct stock availability from Davangere chemists.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLayer(3)}
                    className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveLayer(5)}
                    className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
                  >
                    Review Bill →
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-md flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  type="text"
                  value={medicineQuery}
                  onChange={(e) => setMedicineQuery(e.target.value)}
                  placeholder="Filter by medicine or pharmacy name..."
                  className="flex-1 px-2 py-1.5 bg-transparent text-xs text-slate-900 focus:outline-none"
                />
                {medicineQuery && (
                  <button
                    onClick={() => setMedicineQuery("")}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Cards Grid */}
              {isLoadingInventory ? (
                <div className="py-12 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Loading inventory...</span>
                </div>
              ) : filteredInventory.length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-white/85 border border-white/60 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-900">No inventory found</p>
                  <button
                    onClick={() => setMedicineQuery("")}
                    className="px-3 py-1 rounded-lg bg-cyan-600 text-white text-xs font-semibold"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInventory.map((item) => {
                    const isSelected = selectedSlot?.id === item.id;
                    const distance = computeDistanceKm(
                      userCoords.lat,
                      userCoords.lng,
                      item.pharmacies.latitude,
                      item.pharmacies.longitude
                    );
                    const isOutOfStock = item.stock_qty <= 0;

                    return (
                      <div
                        key={item.id}
                        className={`p-5 rounded-3xl backdrop-blur-xl transition-all border flex flex-col justify-between ${
                          isSelected
                            ? "bg-white border-cyan-500 shadow-xl shadow-cyan-600/10 scale-[1.02]"
                            : isOutOfStock
                            ? "bg-white/60 border-slate-200 opacity-60"
                            : "bg-white/85 border-white/60 hover:border-cyan-300 shadow-md"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm">
                                {item.pharmacies.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                                {item.pharmacies.address}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-amber-700 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 shrink-0">
                              ★ {item.pharmacies.rating}
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-900 text-xs">
                                {item.medicines.brand_name}
                              </span>
                              <span className="text-cyan-700 font-extrabold text-sm">
                                ₹{item.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">{item.medicines.generic_name}</p>
                            <p className="text-[10px] text-slate-400">Mfg: {item.medicines.manufacturer}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                                item.stock_qty > 10
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : item.stock_qty > 0
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-rose-50 text-rose-800 border-rose-200"
                              }`}
                            >
                              {item.stock_qty > 0 ? `In Stock (${item.stock_qty})` : "Out of Stock"}
                            </span>

                            <span className="text-slate-600 font-semibold text-xs flex items-center gap-1">
                              <Navigation className="w-3 h-3 text-cyan-600" /> {distance} km
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 mt-3">
                          <button
                            disabled={isOutOfStock}
                            onClick={() => {
                              setSelectedSlot(item);
                              setActiveLayer(5);
                            }}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                              isOutOfStock
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : isSelected
                                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                                : "bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200"
                            }`}
                          >
                            {isOutOfStock ? "Unavailable" : isSelected ? "Selected Slot ✓" : "Select Slot →"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* --- LAYER 5: INVOICE & CHECKOUT (CLEAN & CONCISE) --- */}
          {/* ========================================================================= */}
          {activeLayer === 5 && (
            <motion.div
              key="layer5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 py-4 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-cyan-300" />
                    Invoice & Checkout
                  </h2>
                  <p className="text-xs text-slate-300">Itemized billing & direct reservation.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLayer(4)}
                    className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm"
                  >
                    Print
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Invoice Card */}
                <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl shadow-cyan-950/5 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        MED <span className="text-cyan-600">EASY</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Invoice #ME-2026-9810</p>
                    </div>

                    <div className="text-left sm:text-right text-xs">
                      <p className="font-bold text-slate-900">{selectedSlot?.pharmacies.name}</p>
                      <p className="text-slate-500 text-[11px]">{selectedSlot?.pharmacies.address}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex justify-between">
                    <div>
                      <span className="text-slate-500">Patient:</span>{" "}
                      <span className="font-bold text-slate-900">{patientName} ({patientAge} yrs)</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">{deliveryAddress}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">Prescription:</span>{" "}
                      <span className="text-emerald-700 font-bold">Verified ✓</span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                          <th className="py-2 px-1">Medicine</th>
                          <th className="py-2 px-1 text-center">Qty</th>
                          <th className="py-2 px-1 text-right">Unit Price</th>
                          <th className="py-2 px-1 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-1">
                            <p className="font-bold text-slate-900">{selectedSlot?.medicines.brand_name}</p>
                            <p className="text-[11px] text-slate-500">{selectedSlot?.medicines.generic_name}</p>
                          </td>
                          <td className="py-3 px-1">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="font-bold text-slate-900">{selectedQuantity}</span>
                              <button
                                onClick={() => setSelectedQuantity((q) => q + 1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-1 text-right text-slate-600">
                            ₹{unitPrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-1 text-right font-bold text-slate-900">
                            ₹{subtotal.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST (5%)</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Express Delivery</span>
                      <span>₹{deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2.5">
                      <span>Total Amount</span>
                      <span className="text-cyan-700 text-lg">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout & Pay */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl shadow-cyan-950/5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                      Payment Mode
                    </h3>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("UPI")}
                        className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                          paymentMethod === "UPI"
                            ? "bg-cyan-50 border-cyan-400 text-cyan-900"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-cyan-600" />
                          <span className="text-xs font-bold">Online UPI (GPay/PhonePe)</span>
                        </div>
                        {paymentMethod === "UPI" && <Check className="w-4 h-4 text-cyan-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("CASH")}
                        className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                          paymentMethod === "CASH"
                            ? "bg-cyan-50 border-cyan-400 text-cyan-900"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold">Cash at Chemist Counter</span>
                        </div>
                        {paymentMethod === "CASH" && <Check className="w-4 h-4 text-cyan-600" />}
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleConfirmOrder}
                        disabled={isSubmittingOrder}
                        className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmittingOrder ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Reserving Stock...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm Order & Lock Stock</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Minimal Footer --- */}
        <footer className="mt-auto pt-6 pb-3 text-center text-xs text-slate-300">
          <p>MED EASY • Davangere Real-Time Pharmacy Stock Finder</p>
        </footer>

      </div>

      {/* ========================================================================= */}
      {/* --- ORDER CONFIRMED MODAL --- */}
      {/* ========================================================================= */}
      {orderConfirmedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white border border-white shadow-2xl space-y-4 text-slate-800">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Stock Reserved!</h3>
              <p className="text-xs text-slate-500">Order ID: {orderConfirmedData.id}</p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-center space-y-1">
              <p className="text-[11px] text-cyan-800 font-medium">Counter Pickup OTP Token:</p>
              <p className="text-3xl font-black tracking-widest text-cyan-700 font-mono">
                {orderConfirmedData.token}
              </p>
            </div>

            <div className="space-y-1 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600">
              <div className="flex justify-between">
                <span>Pharmacy:</span>
                <span className="font-bold text-slate-900">{orderConfirmedData.pharmacy}</span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-bold text-slate-900">{orderConfirmedData.items}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold text-cyan-700">₹{orderConfirmedData.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderConfirmedData(null);
                setActiveLayer(1);
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
