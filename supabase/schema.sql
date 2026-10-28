-- ==========================================
-- MED EASY DATABASE SCHEMA FOR SUPABASE
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- 1. Pharmacies Table
CREATE TABLE IF NOT EXISTS public.pharmacies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    rating NUMERIC(2,1) DEFAULT 4.5,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Medicines Table
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE,
    stock_qty INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(10,2) NOT NULL,
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    user_address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_price NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Access Policies for Demo
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on pharmacies" ON public.pharmacies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on medicines" ON public.medicines FOR SELECT USING (true);
CREATE POLICY "Allow public read access on inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Allow public insert and read access on orders" ON public.orders FOR ALL USING (true);

-- ==========================================
-- SEED DATA FOR TESTING
-- ==========================================

-- Insert Pharmacies (Davangere, Karnataka - 577002)
INSERT INTO public.pharmacies (id, name, address, latitude, longitude, rating, phone)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Apollo Pharmacy - Station Road Davangere', 'Station Road, Opp. City Railway Station, Davangere, Karnataka - 577001', 14.4612, 75.9285, 4.9, '+91 81922 51234'),
    ('22222222-2222-2222-2222-222222222222', 'City Care Pharmacy - Main Street Davangere', 'Main Street, Near Clock Tower, Davangere, Karnataka - 577001', 14.4552, 75.9238, 4.8, '+91 81922 45678'),
    ('33333333-3333-3333-3333-333333333333', 'Vidyaprapti Meds - PB Road Davangere', 'PB Road, Near Bapuji Hospital & Medical College, Davangere, Karnataka - 577004', 14.4670, 75.9175, 4.9, '+91 81922 78901'),
    ('44444444-4444-4444-4444-444444444444', 'Bapuji Chemist & Druggist - MCC ''B'' Block Davangere', 'MCC ''B'' Block, Kuvempu Nagar, Davangere, Karnataka - 577002', 14.4725, 75.9360, 4.6, '+91 81922 34567')
ON CONFLICT (id) DO NOTHING;

-- Insert Medicines
INSERT INTO public.medicines (id, brand_name, generic_name, manufacturer)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dolo 650', 'Paracetamol 650mg', 'Micro Labs Ltd'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Augmentin 625 Duo', 'Amoxicillin & Potassium Clavulanate', 'GlaxoSmithKline (GSK)'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Azee 500', 'Azithromycin 500mg', 'Cipla Ltd'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Pan 40', 'Pantoprazole Gastro-Resistant 40mg', 'Alkem Laboratories'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Cetzine 10', 'Cetirizine Hydrochloride 10mg', 'Dr. Reddy''s Laboratories'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Glycomet 500', 'Metformin Hydrochloride 500mg SR', 'USV Private Ltd')
ON CONFLICT (id) DO NOTHING;

-- Insert Inventory
INSERT INTO public.inventory (pharmacy_id, medicine_id, stock_qty, price, mfg_date, exp_date)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 45, 32.50, '2026-01-15', '2028-06-30'),
    ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 18, 198.00, '2026-03-10', '2028-02-28'),
    ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 35, 85.00, '2026-02-01', '2028-11-30'),
    ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 28, 28.00, '2026-01-10', '2028-05-31'),
    ('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 20, 115.00, '2026-02-15', '2027-12-31'),
    ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 34.00, '2026-03-01', '2028-08-31'),
    ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 204.00, '2026-01-20', '2027-10-31'),
    ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 0, 31.00, '2025-11-15', '2027-09-30');

