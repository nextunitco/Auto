import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import type {
  Vehicle,
  Product,
  Order,
  Enquiry,
  CommissionSettlement,
  PlatformSettings,
  AdminStats,
  OrderStatus,
} from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PORT = process.env.PORT || 3000;

interface DatabaseSchema {
  vehicles: Vehicle[];
  products: Product[];
  orders: Order[];
  enquiries: Enquiry[];
  commissions: CommissionSettlement[];
  settings: PlatformSettings;
  adminToken: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  businessName: 'NEXUNIT Automotive & Products',
  businessEmail: 'nextunitco@gmail.com',
  businessPhone: '+234 811 162 1502',
  whatsappNumber: '2348111621502',
  vehicleCommissionType: 'percentage',
  vehicleCommissionValue: 2.5,
  productCommissionType: 'percentage',
  productCommissionValue: 7.0,
  deliveryFee: 15.0,
  freeDeliveryThreshold: 120.0,
  vehicleDirectCheckoutEnabled: false,
  bankName: 'Standard Commerce Bank',
  bankAccountName: 'NEXUNIT AUTO SALES & TRADING',
  bankAccountNumber: '1029384756',
  bankSortCodeOrSwift: 'SCBNG044',
  paystackEnabled: false,
  paystackPublicKey: '',
  flutterwaveEnabled: false,
  flutterwavePublicKey: '',
  currencySymbol: '$',
};

const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    make: 'Mercedes-Benz',
    model: 'EQS 450+ Luxury Sedan',
    year: 2024,
    price: 104400,
    samplePriceNotice: 'Sample demonstration price - Contact for exact quote',
    isDemonstration: true,
    mileage: '4,200 km',
    transmission: 'Automatic',
    fuelType: 'Electric',
    condition: 'Brand New',
    engineCapacity: 'Electric 108.4 kWh (329 hp)',
    exteriorColor: 'High-Tech Silver Metallic',
    interiorColor: 'Neva Grey / Balao Brown Nappa Leather',
    description:
      'The flagship Mercedes-Benz EQS 450+ represents the pinnacle of modern luxury electric touring. Features an aerodynamic silhouette, MBUX Hyperscreen interface, Burmester 3D Surround Sound, air suspension with adaptive damping, and up to 350 miles of refined range.',
    features: [
      'MBUX Hyperscreen with 3 displays',
      'Burmester 3D Surround Audio',
      'Airmatic Air Suspension',
      'Driver Assistance Package Plus',
      'Panoramic Sliding Sunroof',
      'Ventilated & Massage Front Seats',
      '21-inch AMG Multi-Spoke Wheels',
    ],
    images: [
      '/src/assets/images/hero_automotive_showroom_1794036248039.jpg',
      '/src/assets/images/car_sedan_executive_1794036248811.jpg',
    ],
    status: 'Available',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'veh-2',
    make: 'Genesis',
    model: 'GV80 3.5T Prestige AWD',
    year: 2024,
    price: 78500,
    samplePriceNotice: 'Sample demonstration price - Vehicle inquiry recommended',
    isDemonstration: true,
    mileage: '9,800 km',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    condition: 'Certified Pre-Owned',
    engineCapacity: '3.5L Twin-Turbo V6 (375 hp)',
    exteriorColor: 'Cardiff Green Metallic',
    interiorColor: 'Smoky Green & Vanilla Beige Leather',
    description:
      'Imposing luxury midsize SUV engineered with an athletic twin-turbo V6 engine, electronically controlled suspension with road preview, 14.5-inch infotainment display, and premium Lexicon 21-speaker acoustic architecture.',
    features: [
      'Twin-Turbo V6 375 HP AWD',
      'Electronically Controlled Suspension w/ Road Preview',
      'Lexicon Premium 21-Speaker Sound',
      'Smart Cruise Control & Highway Driving Assist II',
      'Head-Up Display',
      'Heated & Ventilated 2nd Row Seating',
      '22-inch G-Matrix Diamond-Cut Alloys',
    ],
    images: [
      '/src/assets/images/car_suv_luxury_1794036248823.jpg',
      '/src/assets/images/hero_automotive_showroom_1794036248039.jpg',
    ],
    status: 'Available',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'veh-3',
    make: 'Mercedes-Benz',
    model: 'S 580 4MATIC Executive',
    year: 2023,
    price: 124500,
    samplePriceNotice: 'Sample demonstration price - Available for purchase inquiry',
    isDemonstration: true,
    mileage: '14,500 km',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    condition: 'Certified Pre-Owned',
    engineCapacity: '4.0L V8 Biturbo with EQ Boost (496 hp)',
    exteriorColor: 'Obsidian Black Metallic',
    interiorColor: 'Exclusive Black Nappa Leather',
    description:
      'The definitive benchmark of automotive refinement. Equipped with an electrified 496-horsepower V8 biturbo, rear-axle steering for effortless agility, active multicontour seats with energizing comfort modes, and soft-close doors.',
    features: [
      'Electrified 4.0L V8 Biturbo (496 hp)',
      '4.5-Degree Rear-Axle Steering',
      'Burmester High-End 4D Surround Sound',
      'Executive Rear Seating Package',
      'Augmented Reality Head-Up Display',
      'Active Ambient Lighting (64 Colors)',
      'Soft-Close Power Doors',
    ],
    images: [
      '/src/assets/images/car_sedan_executive_1794036248811.jpg',
      '/src/assets/images/hero_automotive_showroom_1794036248039.jpg',
    ],
    status: 'Available',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'veh-4',
    make: 'Porsche',
    model: 'Cayenne GTS Coupe',
    year: 2023,
    price: 112000,
    samplePriceNotice: 'Sample demonstration price - Reserved for client inspection',
    isDemonstration: true,
    mileage: '16,200 km',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    condition: 'Foreign Used',
    engineCapacity: '4.0L Twin-Turbo V8 (453 hp)',
    exteriorColor: 'Crayon Grey',
    interiorColor: 'GTS Alcantara & Black Leather Package',
    description:
      'Pure sports car performance fused with everyday SUV capability. The Cayenne GTS Coupe features a lowered sport air suspension, sport exhaust system with central tailpipes, Sport Chrono Package, and carbon interior trim.',
    features: [
      '4.0L Twin-Turbo V8 Engine',
      'Sport Chrono Package with Mode Switch',
      'Porsche Adaptive Air Suspension (PASM)',
      'Sport Exhaust System in Black',
      'Panoramic Fixed Glass Roof',
      '21-inch RS Spyder Design Wheels',
    ],
    images: [
      '/src/assets/images/car_suv_luxury_1794036248823.jpg',
      '/src/assets/images/car_sedan_executive_1794036248811.jpg',
    ],
    status: 'Reserved',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'veh-5',
    make: 'Porsche',
    model: '911 GT Heritage Coupe',
    year: 2024,
    price: 165000,
    samplePriceNotice: 'Sample demonstration price - Inquire on WhatsApp or Email to discuss',
    isDemonstration: true,
    mileage: '1,200 km',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    condition: 'Brand New',
    engineCapacity: '3.8L Twin-Turbo Boxer 6 (640 hp)',
    exteriorColor: 'Chalk Pure White',
    interiorColor: 'Heritage Cognac & Pepita Houndstooth',
    description:
      'An aerodynamic masterpiece engineered with a 640-horsepower twin-turbo flat-six, lightweight titanium sports exhaust, ceramic composite brakes, and bespoke Heritage interior.',
    features: [
      '640 HP Twin-Turbo Flat-6',
      'Porsche Ceramic Composite Brakes (PCCB)',
      'Sport Chrono Package with Mode Switch',
      'Front Axle Lift System',
      'Burmester High-End Surround Sound',
      '20/21-inch Turbo S Center-Lock Wheels',
    ],
    images: [
      '/src/assets/images/car_sports_coupe_1794298927918.jpg',
      '/src/assets/images/hero_automotive_showroom_1794036248039.jpg',
    ],
    status: 'Available',
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'WD-40 Multi-Use Smart Straw Spray',
    category: 'WD-40 Products',
    sizeVariant: '400ml Spray Can',
    variants: [
      { id: 'var-1', name: '400ml Smart Straw Can', price: 12.5, stock: 120 },
      { id: 'var-2', name: '500ml Heavy-Duty Can', price: 15.0, stock: 65 },
      { id: 'var-3', name: 'Pack of 3 (400ml)', price: 34.0, stock: 40 },
    ],
    price: 12.5,
    isDemonstrationPrice: false,
    description:
      'The genuine multi-use maintenance spray trusted by automotive technicians worldwide. Displaces moisture, prevents rust, loosens seized bolts, penetrates sticky mechanisms, and stops squeaks with the permanently attached flip-up Smart Straw.',
    specifications: [
      'Dual-action precision spray applicator (Smart Straw)',
      'Water displacing formulation',
      'Safe on metal, rubber, wood, and most automotive plastics',
      'Dielectric strength up to 38,000 volts',
    ],
    stock: 120,
    isAvailable: true,
    images: ['/src/assets/images/product_wd40_can_1794036250079.jpg'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'WD-40 Specialist High Performance Silicone Lubricant',
    category: 'Lubricants',
    sizeVariant: '400ml Spray Can',
    variants: [
      { id: 'var-4', name: '400ml Precision Can', price: 16.0, stock: 75 },
    ],
    price: 16.0,
    isDemonstrationPrice: false,
    description:
      'Professional-grade non-staining, hard-wearing formula that provides outstanding lubrication without attracting dirt or grime. Perfect for automotive door seals, rubber hoses, window channels, and drive belts.',
    specifications: [
      'Temperature range: -35°C to +200°C',
      'Prevents sticking and binding of parts',
      'Waterproofs and protects against moisture',
      'Safe on rubber weatherstrips and vinyl trims',
    ],
    stock: 75,
    isAvailable: true,
    images: ['/src/assets/images/product_wd40_can_1794036250079.jpg'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Veloce Pro Gloss Quick Detailer & Ceramic Enhancer',
    category: 'Car Care',
    sizeVariant: '500ml Spray Bottle',
    variants: [
      { id: 'var-5', name: '500ml Trigger Bottle', price: 24.99, stock: 45 },
      { id: 'var-6', name: '1000ml Refill Bottle', price: 39.99, stock: 20 },
    ],
    price: 24.99,
    isDemonstrationPrice: false,
    description:
      'Infused with ultra-slick SiO2 ceramic polymers to instantly remove light dust, fingerprints, and road haze while leaving a mirror-gloss hydrophobic finish that repels rainwater and contamination.',
    specifications: [
      'Safe on all clear coats, wraps, and ceramic coatings',
      'Streak-free hydrophobic slickness',
      'Includes premium dual-pile microfiber buffing cloth',
      'Pleasant citrus fragrance',
    ],
    stock: 45,
    isAvailable: true,
    images: ['/src/assets/images/product_detailing_kit_1794036249646.jpg'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'WD-40 Specialist Fast Release Penetrant',
    category: 'WD-40 Products',
    sizeVariant: '400ml Can',
    variants: [
      { id: 'var-7', name: '400ml Can', price: 14.5, stock: 55 },
    ],
    price: 14.5,
    isDemonstrationPrice: false,
    description:
      'Specifically engineered to target rusted or corroded nuts, bolts, threads, and locks. Penetrates into micro-crevices within seconds to free frozen assemblies without stripping threads.',
    specifications: [
      'Fast-acting low surface tension formula',
      'Penetrates rust, scale, and corrosion rapidly',
      'Leaves a light protective lubricating film',
      'Smart Straw 360° valve',
    ],
    stock: 55,
    isAvailable: true,
    images: ['/src/assets/images/product_wd40_can_1794036250079.jpg'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Ceramic Wheel & Brake Dust Decontamination Gel',
    category: 'Cleaning Products',
    sizeVariant: '750ml Spray',
    variants: [
      { id: 'var-8', name: '750ml Trigger Bottle', price: 21.5, stock: 38 },
    ],
    price: 21.5,
    isDemonstrationPrice: false,
    description:
      'pH-balanced iron fallout remover that clings to vertical wheel surfaces, turning deep purple as it dissolves embedded brake dust and metallic fallout without acid degradation.',
    specifications: [
      'Acid-free, safe on clear coated, diamond cut, and painted alloys',
      'Color-changing active reaction indicator',
      'Thick gel formulation for maximum dwell time',
    ],
    stock: 38,
    isAvailable: true,
    images: ['/src/assets/images/product_detailing_kit_1794036249646.jpg'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Ultra-Dense Edgeless Microfiber Drying Towel Set',
    category: 'Automotive Accessories',
    sizeVariant: 'Pack of 2 (60x90cm)',
    variants: [
      { id: 'var-9', name: '2-Pack (800 GSM)', price: 18.0, stock: 80 },
    ],
    price: 18.0,
    isDemonstrationPrice: false,
    description:
      'Lint-free, scratch-free 800 GSM twisted loop microfiber towels that absorb over 10 times their weight in water for effortless streak-free vehicle drying in a single pass.',
    specifications: [
      '800 GSM high-density split microfiber',
      'Laser-cut ultrasonic edgeless design',
      'Safe for sensitive piano black and soft paints',
      'Machine washable up to 200 cycles',
    ],
    stock: 80,
    isAvailable: true,
    images: ['/src/assets/images/product_detailing_kit_1794036249646.jpg'],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'WD-40 Specialist White Lithium Grease Spray',
    category: 'Lubricants',
    sizeVariant: '400ml Precision Can',
    variants: [
      { id: 'var-10', name: '400ml Precision Can', price: 16.5, stock: 90 },
    ],
    price: 16.5,
    isDemonstrationPrice: false,
    description:
      'High-viscosity thick grease formula engineered for heavy metal-to-metal contact. Provides long-lasting lubrication and non-drip weather-resistant barrier against friction, rust, and extreme heat.',
    specifications: [
      'Temperature resistant from -18°C to +145°C',
      'Water and moisture resistant non-drip coating',
      'Ideal for automotive gears, hinges, winches, and tow bars',
      'Certified genuine WD-40 Specialist formula',
    ],
    stock: 90,
    isAvailable: true,
    images: ['/src/assets/images/product_wd40_grease_1794298928400.jpg'],
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: 'NX-2026-1042',
    type: 'product',
    items: [
      {
        id: 'prod-1',
        name: 'WD-40 Multi-Use Smart Straw Spray',
        price: 12.5,
        quantity: 2,
        sizeVariant: '400ml Smart Straw Can',
        image: '/src/assets/images/product_wd40_can_1794036250079.jpg',
        type: 'product',
      },
      {
        id: 'prod-3',
        name: 'Veloce Pro Gloss Quick Detailer & Ceramic Enhancer',
        price: 24.99,
        quantity: 1,
        sizeVariant: '500ml Trigger Bottle',
        image: '/src/assets/images/product_detailing_kit_1794036249646.jpg',
        type: 'product',
      },
    ],
    customer: {
      fullName: 'Marcus Vance',
      email: 'm.vance@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Parkway, Suite 12',
      city: 'Austin',
      state: 'Texas',
      notes: 'Please leave package at the side workshop entrance.',
    },
    subtotal: 49.99,
    deliveryFee: 15.0,
    total: 64.99,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Payment Confirmed',
    paymentReference: 'BT-TX-98412',
    orderStatus: 'Completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    commissionCalculated: true,
    commissionAmount: 3.5, // 7% of 49.99
    commissionRateApplied: '7.0% (Product)',
    netToBusiness: 61.49,
    commissionPaid: true,
    commissionPaidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    commissionPaymentRef: 'NEX-PAY-0041',
    adminNotes: 'Payment verified via bank statement.',
  },
  {
    id: 'NX-2026-1043',
    type: 'product',
    items: [
      {
        id: 'prod-2',
        name: 'WD-40 Specialist High Performance Silicone Lubricant',
        price: 16.0,
        quantity: 3,
        sizeVariant: '400ml Precision Can',
        image: '/src/assets/images/product_wd40_can_1794036250079.jpg',
        type: 'product',
      },
    ],
    customer: {
      fullName: 'Elena Rostova',
      email: 'elena.r@example.com',
      phone: '+1 (555) 876-5432',
      address: '120 Ocean View Blvd',
      city: 'Miami',
      state: 'Florida',
    },
    subtotal: 48.0,
    deliveryFee: 15.0,
    total: 63.0,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    commissionCalculated: false,
    commissionAmount: 0,
    commissionRateApplied: '7.0% (Product)',
    netToBusiness: 63.0,
    commissionPaid: false,
  },
];

const SEED_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    type: 'vehicle',
    itemId: 'veh-1',
    itemTitle: '2024 Mercedes-Benz EQS 450+ Luxury Sedan',
    customerName: 'David Sterling',
    customerPhone: '+1 (555) 443-8901',
    customerEmail: 'dsterling@executivecapital.com',
    message:
      'Hello, I would like to confirm inspection availability for the 2024 EQS 450+ this coming Saturday morning.',
    status: 'In Progress',
    followUpNotes: 'Spoke with David. Scheduled viewing for Saturday 11:00 AM at showroom.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'enq-102',
    type: 'vehicle',
    itemId: 'veh-2',
    itemTitle: '2024 Genesis GV80 3.5T Prestige AWD',
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 321-7654',
    customerEmail: 'sarah.j@outlook.com',
    message:
      'Interested in financing options and trade-in evaluation for a 2020 Lexus RX toward this GV80.',
    status: 'New',
    followUpNotes: 'Awaiting customer response to initial valuation questionnaire.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

const SEED_COMMISSIONS: CommissionSettlement[] = [
  {
    id: 'comm-1',
    orderId: 'NX-2026-1042',
    itemType: 'product',
    saleAmount: 49.99,
    commissionAmount: 3.5,
    commissionRate: '7.0% (Product)',
    netToBusiness: 61.49,
    status: 'Paid',
    settlementDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    paymentReference: 'NEX-PAY-0041',
    notes: 'Monthly product batch settlement paid to NEXUNIT COOPERATION account.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper to safely load or initialize database
async function getDatabase(): Promise<DatabaseSchema> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch {
    const initialDb: DatabaseSchema = {
      vehicles: SEED_VEHICLES,
      products: SEED_PRODUCTS,
      orders: SEED_ORDERS,
      enquiries: SEED_ENQUIRIES,
      commissions: SEED_COMMISSIONS,
      settings: DEFAULT_SETTINGS,
      adminToken: 'nexunit_admin_token_2026_secure',
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
}

async function saveDatabase(data: DatabaseSchema): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Simple admin authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  // Allow demo token or valid authorization
  if (token === 'nexunit_admin_token_2026_secure' || token === 'admin-session-active') {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
}

// Compute commission for an order
function computeOrderCommission(order: Order, settings: PlatformSettings): {
  amount: number;
  rateApplied: string;
  netToBusiness: number;
} {
  const isVehicle = order.type === 'vehicle';
  const type = isVehicle ? settings.vehicleCommissionType : settings.productCommissionType;
  const val = isVehicle ? settings.vehicleCommissionValue : settings.productCommissionValue;

  let commission = 0;
  let rateApplied = '';

  if (type === 'percentage') {
    commission = Number(((order.subtotal * val) / 100).toFixed(2));
    rateApplied = `${val}% (${isVehicle ? 'Vehicle' : 'Product'})`;
  } else {
    commission = Number(val.toFixed(2));
    rateApplied = `${settings.currencySymbol}${val} fixed (${isVehicle ? 'Vehicle' : 'Product'})`;
  }

  const netToBusiness = Number((order.total - commission).toFixed(2));
  return {
    amount: commission,
    rateApplied,
    netToBusiness,
  };
}

async function createServer() {
  const app = express();
  app.use(express.json());

  // API Endpoints

  // Settings
  app.get('/api/settings', async (_req, res) => {
    try {
      const db = await getDatabase();
      res.json(db.settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve settings' });
    }
  });

  app.put('/api/settings', requireAdmin, async (req, res) => {
    try {
      const db = await getDatabase();
      db.settings = { ...db.settings, ...req.body };
      await saveDatabase(db);
      res.json(db.settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Auth
  app.post('/api/auth/login', async (req, res) => {
    const { password } = req.body;
    // Default admin password is 'admin123' or 'nexunit2026'
    if (password === 'admin123' || password === 'nexunit2026') {
      res.json({
        success: true,
        token: 'nexunit_admin_token_2026_secure',
        user: { name: 'NEXUNIT Administrator', role: 'admin' },
      });
    } else {
      res.status(401).json({ error: 'Invalid administrator credentials' });
    }
  });

  // Vehicles
  app.get('/api/vehicles', async (_req, res) => {
    try {
      const db = await getDatabase();
      res.json(db.vehicles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load vehicles' });
    }
  });

  app.get('/api/vehicles/:id', async (req, res) => {
    try {
      const db = await getDatabase();
      const vehicle = db.vehicles.find((v) => v.id === req.params.id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load vehicle' });
    }
  });

  app.post('/api/vehicles', requireAdmin, async (req, res) => {
    try {
      const db = await getDatabase();
      const newVehicle: Vehicle = {
        ...req.body,
        id: `veh-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      db.vehicles.unshift(newVehicle);
      await saveDatabase(db);
      res.status(201).json(newVehicle);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  });

  app.put('/api/vehicles/:id', requireAdmin, async (req, res) => {
    try {
      const db = await getDatabase();
      const index = db.vehicles.findIndex((v) => v.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Vehicle not found' });
      db.vehicles[index] = { ...db.vehicles[index], ...req.body };
      await saveDatabase(db);
      res.json(db.vehicles[index]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update vehicle' });
    }
  });

  app.delete('/api/vehicles/:id', requireAdmin, async (req, res) => {
    try {
      const db = await getDatabase();
      db.vehicles = db.vehicles.filter((v) => v.id !== req.params.id);
      await saveDatabase(db);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  });

  // Products
  app.get('/api/products', async (_req, res) => {
    try {
      const db = await getDatabase();
      res.json(db.products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load products' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const db = await getDatabase();
      const product = db.products.find((p) => p.id === req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load product' });
    }
  });

  app.post('/api/products', requireAdmin, async (req, res) => {
    try {
      const db = await getDatabase();
      const newProduct: Product = {
        ...req.body,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      db.products.unshift(newProduct);
      await saveDatabase(db);
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  app.put('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      const db = await getDatabase();
      const index = db.products.findIndex((p) => p.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Product not found' });
      db.products[index] = { ...db.products[index], ...req.body };
      await saveDatabase(db);
      res.json(db.products[index]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      const db = await getDatabase();
      db.products = db.products.filter((p) => p.id !== req.params.id);
      await saveDatabase(db);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Orders
  app.get('/api/orders', requireAdmin, async (_req, res) => {
    try {
      const db = await getDatabase();
      res.json(db.orders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load orders' });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const db = await getDatabase();
      const order = db.orders.find((o) => o.id === req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load order' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const db = await getDatabase();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newOrderId = `NX-2026-${randomSuffix}`;

      const { items, customer, paymentMethod, paymentReference, type = 'product' } = req.body;

      if (!items || !items.length || !customer || !customer.fullName || !customer.phone) {
        return res.status(400).json({ error: 'Missing required order details' });
      }

      // Compute subtotal
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
        0
      );

      // Delivery charge logic
      const deliveryFee =
        type === 'vehicle'
          ? 0
          : subtotal >= db.settings.freeDeliveryThreshold
          ? 0
          : db.settings.deliveryFee;

      const total = Number((subtotal + deliveryFee).toFixed(2));

      const newOrder: Order = {
        id: newOrderId,
        type: type,
        items,
        customer,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: paymentMethod || 'bank_transfer',
        paymentStatus: 'Pending',
        paymentReference: paymentReference || `REF-${Date.now().toString().slice(-6)}`,
        orderStatus: 'Pending',
        createdAt: new Date().toISOString(),
        commissionCalculated: false,
        commissionAmount: 0,
        commissionRateApplied: '',
        netToBusiness: total,
        commissionPaid: false,
      };

      // If bank transfer or gateway, calculate prospective commission
      const comm = computeOrderCommission(newOrder, db.settings);
      newOrder.commissionAmount = comm.amount;
      newOrder.commissionRateApplied = comm.rateApplied;
      newOrder.netToBusiness = comm.netToBusiness;

      db.orders.unshift(newOrder);

      // Deduct product stock if product type
      if (type === 'product') {
        for (const item of items) {
          const product = db.products.find((p) => p.id === item.id);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            if (product.stock === 0) product.isAvailable = false;
          }
        }
      }

      await saveDatabase(db);
      res.status(201).json(newOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process order' });
    }
  });

  // Update order status & trigger commission recording
  app.put('/api/orders/:id/status', requireAdmin, async (req, res) => {
    try {
      const { status, paymentStatus, adminNotes } = req.body;
      const db = await getDatabase();
      const order = db.orders.find((o) => o.id === req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      if (status) order.orderStatus = status as OrderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (adminNotes !== undefined) order.adminNotes = adminNotes;

      // Commission is recorded once sale is completed and payment is confirmed
      const isCompleted = order.orderStatus === 'Completed' || order.paymentStatus === 'Payment Confirmed';
      if (isCompleted && !order.commissionCalculated) {
        const comm = computeOrderCommission(order, db.settings);
        order.commissionCalculated = true;
        order.commissionAmount = comm.amount;
        order.commissionRateApplied = comm.rateApplied;
        order.netToBusiness = comm.netToBusiness;

        // Create a settlement record if not already existing
        const exists = db.commissions.find((c) => c.orderId === order.id);
        if (!exists) {
          db.commissions.unshift({
            id: `comm-${Date.now()}`,
            orderId: order.id,
            itemType: order.type,
            saleAmount: order.subtotal,
            commissionAmount: comm.amount,
            commissionRate: comm.rateApplied,
            netToBusiness: comm.netToBusiness,
            status: order.commissionPaid ? 'Paid' : 'Outstanding',
            createdAt: new Date().toISOString(),
          });
        }
      }

      await saveDatabase(db);
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // Enquiries
  app.get('/api/enquiries', requireAdmin, async (_req, res) => {
    try {
      const db = await getDatabase();
      res.json(db.enquiries);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load enquiries' });
    }
  });

  app.post('/api/enquiries', async (req, res) => {
    try {
      const db = await getDatabase();
      const newEnquiry: Enquiry = {
        ...req.body,
        id: `enq-${Date.now()}`,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      db.enquiries.unshift(newEnquiry);
      await saveDatabase(db);
      res.status(201).json(newEnquiry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to submit enquiry' });
    }
  });

  app.put('/api/enquiries/:id', requireAdmin, async (req, res) => {
    try {
      const db = await getDatabase();
      const enquiry = db.enquiries.find((e) => e.id === req.params.id);
      if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
      if (req.body.status) enquiry.status = req.body.status;
      if (req.body.followUpNotes !== undefined) enquiry.followUpNotes = req.body.followUpNotes;
      await saveDatabase(db);
      res.json(enquiry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update enquiry' });
    }
  });

  // Commissions
  app.get('/api/commissions', requireAdmin, async (_req, res) => {
    try {
      const db = await getDatabase();
      const completedOrders = db.orders.filter(
        (o) => o.orderStatus === 'Completed' || o.paymentStatus === 'Payment Confirmed'
      );

      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
      const vehicleSalesTotal = completedOrders
        .filter((o) => o.type === 'vehicle')
        .reduce((sum, o) => sum + o.total, 0);
      const productSalesTotal = completedOrders
        .filter((o) => o.type === 'product')
        .reduce((sum, o) => sum + o.total, 0);

      const totalCommission = completedOrders.reduce((sum, o) => sum + (o.commissionAmount || 0), 0);
      const paidCommission = completedOrders
        .filter((o) => o.commissionPaid)
        .reduce((sum, o) => sum + (o.commissionAmount || 0), 0);
      const outstandingCommission = totalCommission - paidCommission;

      res.json({
        summary: {
          totalRevenue,
          vehicleSalesTotal,
          productSalesTotal,
          totalCommission,
          paidCommission,
          outstandingCommission,
          completedSalesCount: completedOrders.length,
        },
        settlements: db.commissions,
        orders: completedOrders,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to load commission data' });
    }
  });

  app.post('/api/commissions/:orderId/settle', requireAdmin, async (req, res) => {
    try {
      const { paymentRef, notes } = req.body;
      const db = await getDatabase();
      const order = db.orders.find((o) => o.id === req.params.orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      order.commissionPaid = true;
      order.commissionPaidAt = new Date().toISOString();
      order.commissionPaymentRef = paymentRef || `NEX-SETTLE-${Date.now().toString().slice(-4)}`;

      // Update matching settlement record
      const settlement = db.commissions.find((c) => c.orderId === order.id);
      if (settlement) {
        settlement.status = 'Paid';
        settlement.settlementDate = order.commissionPaidAt;
        settlement.paymentReference = order.commissionPaymentRef;
        if (notes) settlement.notes = notes;
      }

      await saveDatabase(db);
      res.json({ success: true, order, settlement });
    } catch (err) {
      res.status(500).json({ error: 'Failed to settle commission' });
    }
  });

  // CSV Report Generator
  app.get('/api/commissions/export-csv', requireAdmin, async (_req, res) => {
    try {
      const db = await getDatabase();
      const completedOrders = db.orders.filter(
        (o) => o.orderStatus === 'Completed' || o.paymentStatus === 'Payment Confirmed'
      );

      const headers = [
        'Order ID',
        'Date',
        'Type',
        'Customer Name',
        'Customer Phone',
        'Subtotal ($)',
        'Delivery Fee ($)',
        'Total Price ($)',
        'Commission Rate Applied',
        'NEXUNIT Commission ($)',
        'Net Due To Business ($)',
        'Payment Method',
        'Commission Status',
        'Settlement Reference',
      ];

      const rows = completedOrders.map((o) => [
        `"${o.id}"`,
        `"${new Date(o.createdAt).toLocaleDateString()}"`,
        `"${o.type.toUpperCase()}"`,
        `"${o.customer.fullName.replace(/"/g, '""')}"`,
        `"${o.customer.phone}"`,
        o.subtotal.toFixed(2),
        o.deliveryFee.toFixed(2),
        o.total.toFixed(2),
        `"${o.commissionRateApplied || 'N/A'}"`,
        (o.commissionAmount || 0).toFixed(2),
        (o.netToBusiness || o.total).toFixed(2),
        `"${o.paymentMethod}"`,
        `"${o.commissionPaid ? 'PAID' : 'OUTSTANDING'}"`,
        `"${o.commissionPaymentRef || '-'}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="NEXUNIT_Sales_Commission_Report_${new Date().toISOString().split('T')[0]}.csv"`
      );
      res.send(csvContent);
    } catch (err) {
      res.status(500).send('Failed to generate CSV export');
    }
  });

  // Admin Overview Stats
  app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
    try {
      const db = await getDatabase();
      const completedOrders = db.orders.filter(
        (o) => o.orderStatus === 'Completed' || o.paymentStatus === 'Payment Confirmed'
      );
      const pendingOrders = db.orders.filter((o) => o.orderStatus === 'Pending');

      const totalSalesRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
      const nexunitCommissionEarned = completedOrders.reduce(
        (sum, o) => sum + (o.commissionAmount || 0),
        0
      );
      const nexunitCommissionPaid = completedOrders
        .filter((o) => o.commissionPaid)
        .reduce((sum, o) => sum + (o.commissionAmount || 0), 0);
      const nexunitCommissionOutstanding = nexunitCommissionEarned - nexunitCommissionPaid;

      const stats: AdminStats = {
        totalVehicles: db.vehicles.length,
        totalProducts: db.products.length,
        totalOrders: db.orders.length,
        completedSales: completedOrders.length,
        pendingOrders: pendingOrders.length,
        totalSalesRevenue,
        nexunitCommissionEarned,
        nexunitCommissionPaid,
        nexunitCommissionOutstanding,
        recentOrders: db.orders.slice(0, 5),
        recentEnquiries: db.enquiries.slice(0, 5),
      };

      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve stats' });
    }
  });

  // Vite Integration for dev mode / static files for production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
