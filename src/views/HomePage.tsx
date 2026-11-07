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

  const featuredVehicles = vehicles.filter((v) => v.featured).slice(0, 3);
  const displayVehicles = featuredVehicles.length > 0 ? featuredVehicles : vehicles.slice(0, 3);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

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

  return (
    <div className="bg-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#171717] text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#16A34A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase">
                <span>Direct Automotive Marketplace & Essentials</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#171717] leading-[1.15] text-balance">
                Everything Automotive. <br className="hidden sm:block" />
                All in One Place.
              </h1>

              <p className="text-base sm:text-lg text-[#737373] max-w-xl leading-relaxed">
                Discover quality vehicles and essential automotive products, all conveniently available in one place. DM us on WhatsApp or Email to discuss prices and order.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('cars')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Cars</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('products')}
                  className="px-6 py-3.5 text-sm font-semibold text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                >
                  Shop Products
                </button>

                <button
                  onClick={handleGeneralWhatsApp}
                  className="px-4 py-3.5 text-sm font-semibold text-[#16A34A] hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>

                <a
                  href={`tel:${settings.businessPhone.replace(/[^0-9+]/g, '')}`}
                  className="px-4 py-3.5 text-sm font-semibold text-[#171717] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <span>Call: 0811 162 1502</span>
                </a>
              </div>

              {/* Trust Subtext */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#737373]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Verified Listings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Direct Price Discussions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>NEXUNIT Support</span>
                </div>
              </div>
            </div>

            {/* Hero Right Media */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F7F8FA] shadow-lg group">
                <img
                  src="/src/assets/images/hero_automotive_showroom_1794036248039.jpg"
                  alt="Modern automotive showroom with luxury electric vehicle"
                  className="w-full h-[340px] sm:h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E5E7EB] shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                      Featured In Showroom
                    </span>
                    <h3 className="text-sm font-bold text-[#171717]">
                      Mercedes-Benz EQS 450+ Luxury Sedan
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      const eq = vehicles.find((v) => v.id === 'veh-1');
                      if (eq) onSelectVehicle(eq);
                      else onNavigate('cars');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    View Specs & Inquire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Categories */}
      <section className="py-16 bg-[#F7F8FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              Browse By Category
            </h2>
            <p className="text-sm text-[#737373] mt-2">
              Select between our verified vehicle marketplace and our direct automotive care catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Card 1: Cars for Sale */}
            <div className="group bg-white rounded-xl border border-[#E5E7EB] p-8 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="h-56 rounded-lg overflow-hidden bg-[#F7F8FA] border border-[#E5E7EB]">
                  <img
                    src="/src/assets/images/car_suv_luxury_1794036248823.jpg"
                    alt="Cars for sale showcase"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#171717]">Cars for Sale</h3>
                <p className="text-sm text-[#737373] leading-relaxed">
                  Browse a curated selection of executive sedans, luxury SUVs, and commercial vehicles with full history and direct WhatsApp inspection booking.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('cars')}
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#171717] hover:bg-black rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Vehicles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Card 2: Automotive Products */}
            <div className="group bg-white rounded-xl border border-[#E5E7EB] p-8 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="h-56 rounded-lg overflow-hidden bg-[#F7F8FA] border border-[#E5E7EB]">
                  <img
                    src="/src/assets/images/product_wd40_can_1794036250079.jpg"
                    alt="Automotive products and WD-40 essentials"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#171717]">Automotive Products & WD-40</h3>
                <p className="text-sm text-[#737373] leading-relaxed">
                  Genuine WD-40 multi-use sprays, silicone lubricants, ceramic detailers, and detailing tools. DM us on WhatsApp or Email to discuss quantity and best rates.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('products')}
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Shop Products & Discuss Prices</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Marketplace Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] mt-1">
                Featured Vehicles
              </h2>
              <p className="text-sm text-[#737373] mt-1">
                Initial entries shown as demonstration listings. Inquire on WhatsApp or Email for verified vehicle availability and pricing.
              </p>
            </div>

            <button
              onClick={() => onNavigate('cars')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>View All Vehicles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 bg-[#F7F8FA] overflow-hidden">
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-semibold text-[#171717] border border-[#E5E7EB]">
                      {vehicle.condition}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-xs text-[#737373]">{vehicle.year} · {vehicle.make}</span>
                      <h3 className="text-base font-bold text-[#171717] mt-0.5 group-hover:text-[#2563EB] transition-colors">
                        {vehicle.model}
                      </h3>
                    </div>

                    {/* Key Specs Row */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E5E7EB] text-xs text-[#737373]">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span className="truncate">{vehicle.mileage}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Cog className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span className="truncate">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span className="truncate">{vehicle.fuelType}</span>
                      </div>
                    </div>

                    {/* Price with demonstration indicator */}
                    <div className="pt-1">
                      <div className="text-lg font-extrabold text-[#171717] tabular-nums">
                        {formatCurrency(vehicle.price, settings.currencySymbol)}
                      </div>
                      <span className="text-[11px] text-[#737373] block">
                        Sample demonstration price · Contact to negotiate
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-[#171717] bg-[#F7F8FA] hover:bg-[#2563EB] hover:text-white border border-[#E5E7EB] hover:border-[#2563EB] rounded-lg transition-colors cursor-pointer text-center"
                  >
                    View Details & Discuss Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#F7F8FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
                Automotive Care & Lubrication
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] mt-1">
                Featured Automotive Products
              </h2>
              <p className="text-sm text-[#737373] mt-1">
                Authentic WD-40 sprays, silicone lubricants, and detailing essentials. DM us on WhatsApp or Email to discuss prices.
              </p>
            </div>

            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>View Full Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative h-48 bg-[#F7F8FA] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-[#16A34A] border border-[#E5E7EB]">
                      In Stock
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-bold text-[#171717] line-clamp-2 hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#737373]">{product.sizeVariant}</p>

                    <div className="pt-1">
                      <span className="text-[10px] text-[#737373] block uppercase font-semibold">
                        Guide Price
                      </span>
                      <div className="text-base font-bold text-[#171717] tabular-nums">
                        {formatCurrency(product.price, settings.currencySymbol)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  <button
                    onClick={(e) => handleWhatsAppDM(product, e)}
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Discuss on WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEmailDM(product, e)}
                      className="flex-1 py-1.5 px-2 text-xs font-medium text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[#2563EB]" />
                      <span>Email</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-1.5 px-2 text-xs font-medium text-[#737373] hover:text-[#171717] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer text-center"
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

      {/* Why Shop With Us? */}
      <section className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              Why Work With Us?
            </h2>
            <p className="text-sm text-[#737373] mt-2">
              Transparent direct discussions, verified quality, and personal concierge service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">Quality Products</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Genuine WD-40 formulas and selected automotive care supplies sourced directly for reliability and performance.
              </p>
            </div>

            <div className="p-6 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-[#16A34A] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">Direct Communication</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                No automated hurdles. Chat directly on WhatsApp or Email to discuss custom quantities and final pricing.
              </p>
            </div>

            <div className="p-6 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">Customer Support</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Dedicated support team ready to assist with vehicle specs, product applications, and regional dispatch.
              </p>
            </div>

            <div className="p-6 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#171717]">Reliable Service</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Operated and managed by NEXUNIT COOPERATION to guarantee professional business standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-[#F7F8FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            Ready to order or have questions about pricing?
          </h2>
          <p className="text-sm sm:text-base text-[#737373] max-w-xl mx-auto leading-relaxed">
            Message us directly on WhatsApp or Email us at {settings.businessEmail}. We will provide current quotes, package pricing, and dispatch details.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleGeneralWhatsApp}
              className="px-6 py-3 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>DM on WhatsApp (0811 162 1502)</span>
            </button>
            <a
              href={`tel:${settings.businessPhone.replace(/[^0-9+]/g, '')}`}
              className="px-6 py-3 text-xs font-semibold text-[#171717] bg-white hover:bg-gray-100 border border-[#E5E7EB] rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#2563EB]" />
              <span>Call Us: 0811 162 1502</span>
            </a>
            <button
              onClick={handleGeneralEmail}
              className="px-6 py-3 text-xs font-semibold text-[#737373] hover:text-[#171717] hover:bg-gray-100 border border-[#E5E7EB] rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
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
