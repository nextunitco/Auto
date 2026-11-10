import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Headphones,
  Fuel,
  Gauge,
  Cog,
  MessageCircle,
  Mail,
  Phone,
  Check,
  Sparkles,
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  Award,
  Truck,
  Shield,
  FileText,
} from 'lucide-react';
import type { Vehicle, Product, PlatformSettings } from '../types';
import { formatCurrency, buildWhatsAppUrl, buildEmailMailto } from '../utils/formatters';
import { useCart } from '../context/CartContext';

interface HomePageProps {
  vehicles: Vehicle[];
  products: Product[];
  settings: PlatformSettings;
  onNavigate: (view: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  vehicles,
  products,
  settings,
  onNavigate,
  onSelectVehicle,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Quick Concierge Bar state
  const [conciergeInterest, setConciergeInterest] = useState('All');
  const [conciergeCity, setConciergeCity] = useState('Lagos');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const displayVehicles = vehicles.slice(0, 4);
  const displayProducts = products.slice(0, 4);

  const handleWhatsAppDM = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Hello NEXUNIT, I would like to buy *${product.name}* (${product.sizeVariant}). Can we discuss the price and delivery?`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const handleEmailDM = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const subject = `Price Inquiry: ${product.name} (${product.sizeVariant})`;
    const body = `Hello NEXUNIT Team,\n\nI want to inquire about purchasing ${product.name} (${product.sizeVariant}). Could you please share the unit and package pricing?\n\nThank you!`;
    const url = buildEmailMailto(settings.businessEmail, subject, body);
    window.open(url, '_blank');
  };

  const handleGeneralWhatsApp = () => {
    const text = 'Hello NEXUNIT, I would like to inquire about your vehicle inventory and automotive products.';
    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const handleGeneralEmail = () => {
    const url = buildEmailMailto(
      settings.businessEmail,
      'Product & Vehicle Pricing Inquiry',
      'Hello NEXUNIT Team,\n\nI would like to inquire about your automotive products and discuss prices.\n\nThank you!'
    );
    window.open(url, '_blank');
  };

  const handleConciergeLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello NEXUNIT, I am contacting you from ${conciergeCity}. I am interested in: ${conciergeInterest}. Please share available options and discuss pricing with me.`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const faqs = [
    {
      q: 'Why do we discuss prices directly on WhatsApp or Email?',
      a: 'We provide personalized pricing for single units, workshop batches, and vehicle purchases. Discussing directly allows us to factor in bulk volume discounts, current FX rates, and custom delivery to your exact location in Nigeria without automated markup fees.',
    },
    {
      q: 'Can I physically inspect vehicles before payment?',
      a: 'Absolutely. All vehicles listed on NEXUNIT AUTO are available for scheduled physical inspections with qualified mechanics at our partner showrooms in Lagos and Abuja prior to any financial commitment.',
    },
    {
      q: 'Are your WD-40 products authentic and sealed?',
      a: 'Yes, 100%. Every single WD-40 Multi-Use and Specialist can is guaranteed authentic with intact manufacturer batch stamps, holographic seals, and original Smart Straw applicators. We also supply cartons and wholesale crates for mechanic workshops and corporate fleets.',
    },
    {
      q: 'How fast is nationwide delivery across Nigeria?',
      a: 'Same-day or next-day dispatch for Lagos, Abuja, and Port Harcourt. Deliveries to other Nigerian states typically arrive within 24–48 hours via secure logistics partners with real-time waybill tracking.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-[#171717] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#16A34A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F8FA] via-white to-white border-b border-[#E5E7EB] pt-8 pb-16 md:py-20 lg:py-24">
        {/* Subtle Decorative Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                <span>Premier Automotive & WD-40 Trading Hub</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#171717] leading-[1.1] text-balance">
                Everything Automotive. <br />
                <span className="bg-gradient-to-r from-[#171717] via-[#2563EB] to-blue-700 bg-clip-text text-transparent">
                  Direct & Accessible.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#737373] max-w-xl leading-relaxed">
                Source verified premium vehicles, genuine WD-40 maintenance sprays, and high-performance detailing essentials. DM us on WhatsApp or call <strong className="text-[#171717]">0811 162 1502</strong> to discuss prices and order.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleGeneralWhatsApp}
                  className="px-6 py-3.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Prices on WhatsApp</span>
                </button>

                <a
                  href={`tel:${settings.businessPhone.replace(/[^0-9+]/g, '')}`}
                  className="px-5 py-3.5 text-xs font-bold text-[#171717] bg-white hover:bg-gray-100 border border-[#E5E7EB] rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <span>Call: 0811 162 1502</span>
                </a>

                <button
                  onClick={() => onNavigate('cars')}
                  className="px-4 py-3.5 text-xs font-semibold text-[#2563EB] hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Browse Cars</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Concierge Box (High Conversion Affordance) */}
              <div className="pt-2">
                <form
                  onSubmit={handleConciergeLaunch}
                  className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-md space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#171717]">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Quick WhatsApp Concierge Price Finder</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                        Looking For
                      </label>
                      <select
                        value={conciergeInterest}
                        onChange={(e) => setConciergeInterest(e.target.value)}
                        className="w-full py-2 px-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      >
                        <option value="All Vehicles & Products">All Inventory</option>
                        <option value="Executive Sedans (Mercedes, BMW)">Executive Sedans</option>
                        <option value="Luxury SUVs (Genesis, Cayenne)">Luxury SUVs</option>
                        <option value="Sports Coupes (Porsche 911 GT)">Sports Coupes</option>
                        <option value="WD-40 Multi-Use Spray (Carton / Single)">WD-40 Multi-Use Cans</option>
                        <option value="WD-40 Specialist Silicone & White Lithium Grease">WD-40 Specialist Greases</option>
                        <option value="Veloce Ceramic Detailing Products">Ceramic Detailing Kits</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                        Location
                      </label>
                      <select
                        value={conciergeCity}
                        onChange={(e) => setConciergeCity(e.target.value)}
                        className="w-full py-2 px-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      >
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Port Harcourt">Port Harcourt</option>
                        <option value="Ibadan">Ibadan</option>
                        <option value="Kano">Kano</option>
                        <option value="Other Nigeria State">Other State</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2.5 px-3 bg-[#171717] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>DM Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 grid grid-cols-3 gap-4 text-xs text-[#737373] border-t border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span className="leading-tight">100% Verified Inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="leading-tight">Authentic Sealed Stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span className="leading-tight">Nationwide Dispatch</span>
                </div>
              </div>
            </div>

            {/* Hero Right Media Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-[#E5E7EB] bg-white shadow-2xl p-2 group">
                <div className="relative h-[360px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#F7F8FA]">
                  <img
                    src="/src/assets/images/hero_automotive_showroom_1794036248039.jpg"
                    alt="Modern automotive showroom with flagship vehicle"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 shadow-sm text-xs font-bold text-[#171717] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    <span>Showroom Ready · 120-Point Checked</span>
                  </div>

                  {/* Bottom Overlaid Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#2563EB]">
                          Featured Flagship
                        </span>
                        <h3 className="text-sm font-bold text-[#171717]">
                          Mercedes-Benz EQS 450+ Luxury Sedan
                        </h3>
                      </div>
                      <span className="text-xs font-extrabold text-[#171717] tabular-nums bg-[#F7F8FA] px-2 py-1 rounded-md border border-[#E5E7EB]">
                        Ref. $104,400
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-[#737373]">
                        Available for inspection in Nigeria
                      </span>
                      <button
                        onClick={() => {
                          const eq = vehicles.find((v) => v.id === 'veh-1');
                          if (eq) onSelectVehicle(eq);
                          else onNavigate('cars');
                        }}
                        className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Discuss Price</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partner Ticker / Marquee */}
      <section className="py-6 bg-[#F7F8FA] border-b border-[#E5E7EB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-8 text-xs font-bold tracking-widest text-[#737373] uppercase">
            <span className="hover:text-[#171717] transition-colors">Mercedes-Benz</span>
            <span>·</span>
            <span className="hover:text-[#171717] transition-colors">Porsche</span>
            <span>·</span>
            <span className="hover:text-[#171717] transition-colors">Genesis</span>
            <span>·</span>
            <span className="hover:text-[#171717] transition-colors">BMW</span>
            <span>·</span>
            <span className="hover:text-[#171717] transition-colors text-[#2563EB]">WD-40 Specialist</span>
            <span>·</span>
            <span className="hover:text-[#171717] transition-colors">Veloce Autocare</span>
            <span>·</span>
            <span className="hover:text-[#171717] transition-colors">Motul Lubricants</span>
          </div>
        </div>
      </section>

      {/* Two Prominent Categories (Cards with Editorial Depth) */}
      <section className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Two Core Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] mt-1">
              Select Your Area of Interest
            </h2>
            <p className="text-sm text-[#737373] mt-2">
              Explore our vetted vehicle showroom or browse our authentic lubricants and workshop care inventory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Card 1: Cars */}
            <div className="group bg-[#F7F8FA] rounded-2xl border border-[#E5E7EB] p-8 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="relative h-64 rounded-xl overflow-hidden bg-white border border-[#E5E7EB]">
                  <img
                    src="/src/assets/images/car_sports_coupe_1794298927918.jpg"
                    alt="Porsche 911 sports coupe"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#171717] shadow-xs">
                    Executive & Sports Inventory
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#171717]">Cars for Sale</h3>
                  <p className="text-sm text-[#737373] mt-2 leading-relaxed">
                    Sedans, luxury SUVs, and high-performance coupes available for private viewing, diagnostic verification, and direct price negotiation.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-3">
                <button
                  onClick={() => onNavigate('cars')}
                  className="flex-1 py-3 px-4 text-xs font-bold text-white bg-[#171717] hover:bg-black rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Explore All Vehicles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGeneralWhatsApp}
                  className="py-3 px-4 text-xs font-bold text-[#16A34A] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </button>
              </div>
            </div>

            {/* Category Card 2: Products */}
            <div className="group bg-[#F7F8FA] rounded-2xl border border-[#E5E7EB] p-8 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="relative h-64 rounded-xl overflow-hidden bg-white border border-[#E5E7EB]">
                  <img
                    src="/src/assets/images/product_wd40_grease_1794298928400.jpg"
                    alt="WD-40 specialist spray cans"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#2563EB] shadow-xs">
                    Wholesale & Retail Supplies
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#171717]">WD-40 & Automotive Chemicals</h3>
                  <p className="text-sm text-[#737373] mt-2 leading-relaxed">
                    Genuine WD-40 Smart Straw cans, silicone lubricants, heavy-duty white lithium grease, and ceramic quick detailers.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-3">
                <button
                  onClick={() => onNavigate('products')}
                  className="flex-1 py-3 px-4 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Browse Products & Discuss Prices</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGeneralWhatsApp}
                  className="py-3 px-4 text-xs font-bold text-[#16A34A] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Bulk Inquiries</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Showcase */}
      <section className="py-16 bg-[#F7F8FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Verified Marketplace
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] mt-1">
                Featured Vehicles
              </h2>
              <p className="text-sm text-[#737373] mt-1">
                Prices shown as guide valuations. Tap to discuss current price, inspections, and delivery with us directly.
              </p>
            </div>

            <button
              onClick={() => onNavigate('cars')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>View All Vehicles ({vehicles.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => onSelectVehicle(vehicle)}
                    className="relative h-52 bg-[#F7F8FA] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-[#171717] border border-[#E5E7EB] shadow-xs">
                      {vehicle.condition}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold text-[#737373]">
                        {vehicle.year} · {vehicle.make}
                      </span>
                      <h3
                        onClick={() => onSelectVehicle(vehicle)}
                        className="text-sm font-bold text-[#171717] mt-0.5 group-hover:text-[#2563EB] transition-colors cursor-pointer line-clamp-1"
                      >
                        {vehicle.model}
                      </h3>
                    </div>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 gap-1 py-2 border-y border-[#E5E7EB] text-[11px] text-[#737373]">
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-[#2563EB]" />
                        <span className="truncate">{vehicle.mileage}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cog className="w-3 h-3 text-[#2563EB]" />
                        <span className="truncate">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-[#2563EB]" />
                        <span className="truncate">{vehicle.fuelType}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#737373] uppercase font-bold block">
                        Valuation Guide Price
                      </span>
                      <div className="text-lg font-black text-[#171717] tabular-nums">
                        {formatCurrency(vehicle.price, settings.currencySymbol)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 space-y-2">
                  <button
                    onClick={() => {
                      const text = `Hello NEXUNIT, I would like to inquire about the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Mileage: ${vehicle.mileage}). Can we discuss the price?`;
                      window.open(buildWhatsAppUrl(settings.whatsappNumber, text), '_blank');
                    }}
                    className="w-full py-2.5 px-3 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Discuss on WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const subject = `Price Inquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
                        const body = `Hello NEXUNIT Team,\n\nI want to discuss the pricing and inspection for the ${vehicle.year} ${vehicle.make} ${vehicle.model}.\n\nThank you!`;
                        window.open(buildEmailMailto(settings.businessEmail, subject, body), '_blank');
                      }}
                      className="flex-1 py-1.5 px-2 text-xs font-semibold text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[#2563EB]" />
                      <span>Email</span>
                    </button>
                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="flex-1 py-1.5 px-2 text-xs font-semibold text-[#737373] hover:text-[#171717] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Specs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
                Lubrication & Maintenance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] mt-1">
                Featured Automotive Products
              </h2>
              <p className="text-sm text-[#737373] mt-1">
                Genuine WD-40 formulas, lithium greases, and detailing solutions. Retail and workshop carton pricing.
              </p>
            </div>

            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>Explore All Products ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative h-52 bg-[#F7F8FA] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#16A34A] border border-[#E5E7EB] shadow-xs">
                      100% Genuine
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-bold text-[#171717] line-clamp-1 hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#737373]">{product.sizeVariant}</p>

                    <div className="pt-2">
                      <span className="text-[10px] text-[#737373] uppercase font-bold block">
                        Reference Price
                      </span>
                      <div className="text-base font-extrabold text-[#171717] tabular-nums">
                        {formatCurrency(product.price, settings.currencySymbol)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 space-y-2">
                  <button
                    onClick={(e) => handleWhatsAppDM(product, e)}
                    className="w-full py-2.5 px-3 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Discuss on WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEmailDM(product, e)}
                      className="flex-1 py-1.5 px-2 text-xs font-semibold text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[#2563EB]" />
                      <span>Email</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-1.5 px-2 text-xs font-semibold text-[#737373] hover:text-[#171717] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The NEXUNIT Dealership Difference Spotlight */}
      <section className="py-20 bg-gradient-to-b from-[#F7F8FA] to-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Left */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-2xl bg-white p-2">
                <img
                  src="/src/assets/images/dealership_keys_lounge_1794298927557.jpg"
                  alt="Luxury vehicle delivery lounge and key handover"
                  className="w-full h-[380px] sm:h-[440px] object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating verified badge */}
              <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xl max-w-xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#171717]">
                  <Award className="w-4 h-4 text-[#2563EB]" />
                  <span>Managed by NEXUNIT COOPERATION</span>
                </div>
                <p className="text-[11px] text-[#737373] leading-relaxed">
                  Every transaction is secured through direct invoicing and documented vehicle inspection.
                </p>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Customer Peace of Mind
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] leading-tight">
                The NEXUNIT Standard in Automotive Commerce
              </h2>
              <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
                Whether you are acquiring a luxury automobile or securing recurring crates of WD-40 for industrial workshops, our model eliminates middlemen and hidden surprises.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#171717]">120-Point Showroom Diagnostics</h4>
                    <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">
                      All vehicles are mechanically inspected, computerized scanned, and road-tested before you take delivery.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#171717]">Direct Negotiation on WhatsApp & Call</h4>
                    <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">
                      Connect directly with management on <strong className="text-[#171717]">0811 162 1502</strong>. Discuss pricing tailored to your purchase volume.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#171717]">Door-to-Door Waybill Dispatch</h4>
                    <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">
                      Reliable distribution to mechanic shops, automotive retailers, and private estates across Nigeria.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] mt-1">
              How Buying Works
            </h2>
            <p className="text-sm text-[#737373] mt-2">
              Three seamless steps from initial browsing to handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#F7F8FA] rounded-2xl border border-[#E5E7EB] space-y-4">
              <span className="text-3xl font-black text-[#2563EB]">01</span>
              <h3 className="text-base font-bold text-[#171717]">Choose Vehicle or Products</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Explore our catalog of cars or WD-40 products. Note your preferred models, sizes, or quantities.
              </p>
            </div>

            <div className="p-8 bg-[#F7F8FA] rounded-2xl border border-[#E5E7EB] space-y-4">
              <span className="text-3xl font-black text-[#16A34A]">02</span>
              <h3 className="text-base font-bold text-[#171717]">DM or Call 0811 162 1502</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Reach out on WhatsApp or Email. We discuss unit or carton pricing, inspection slots, and dispatch quotes.
              </p>
            </div>

            <div className="p-8 bg-[#F7F8FA] rounded-2xl border border-[#E5E7EB] space-y-4">
              <span className="text-3xl font-black text-[#171717]">03</span>
              <h3 className="text-base font-bold text-[#171717]">Inspection, Handover & Dispatch</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Perform private inspection for cars or receive tracking details for shipped product cartons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials / Verified Feedback */}
      <section className="py-16 bg-[#F7F8FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] mt-1">
              Trusted by Automotive Owners & Workshops
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#171717] leading-relaxed">
                "Purchased our workshop's quarterly supply of WD-40 Specialist White Lithium and Multi-Use cans. We discussed carton pricing on WhatsApp and delivery to Ikeja was completed the next afternoon."
              </p>
              <div className="pt-2 border-t border-[#E5E7EB]">
                <strong className="text-xs font-bold text-[#171717] block">Bamidele O.</strong>
                <span className="text-[11px] text-[#737373]">Auto Care Workshop Owner, Ikeja, Lagos</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#171717] leading-relaxed">
                "Negotiated and inspected the Mercedes S 580 in person after reaching out on WhatsApp. Clear documentation, no games with the condition, and genuine assistance throughout."
              </p>
              <div className="pt-2 border-t border-[#E5E7EB]">
                <strong className="text-xs font-bold text-[#171717] block">Dr. Kenneth N.</strong>
                <span className="text-[11px] text-[#737373]">Maitama, Abuja</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#171717] leading-relaxed">
                "Fast response on WhatsApp from the NEXUNIT team. Discussed quantities for 10 units of ceramic spray and towels, paid via bank transfer, and received waybill receipt within an hour."
              </p>
              <div className="pt-2 border-t border-[#E5E7EB]">
                <strong className="text-xs font-bold text-[#171717] block">Tariere D.</strong>
                <span className="text-[11px] text-[#737373]">Fleet Coordinator, Port Harcourt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Need Clarity?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-bold text-[#171717] hover:text-[#2563EB] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#2563EB]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#737373]" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-[#737373] leading-relaxed animate-in fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Heroic Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#171717] via-[#1a2333] to-[#0f172a] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold uppercase tracking-wider">
            NEXUNIT Concierge Hotline
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Ready to order or discuss pricing today?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Message us on WhatsApp, call <strong className="text-white">0811 162 1502</strong>, or email us at <strong className="text-white">{settings.businessEmail}</strong>. We provide instant quotations and friendly support.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleGeneralWhatsApp}
              className="px-6 py-3.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>DM on WhatsApp (0811 162 1502)</span>
            </button>
            <a
              href={`tel:${settings.businessPhone.replace(/[^0-9+]/g, '')}`}
              className="px-6 py-3.5 text-xs font-bold text-[#171717] bg-white hover:bg-gray-100 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#2563EB]" />
              <span>Call Us: 0811 162 1502</span>
            </a>
            <button
              onClick={handleGeneralEmail}
              className="px-6 py-3.5 text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <span>Email: {settings.businessEmail}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
