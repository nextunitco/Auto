import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Gauge,
  Cog,
  Fuel,
  MessageCircle,
  Mail,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { Vehicle, PlatformSettings } from '../types';
import { formatCurrency, buildWhatsAppUrl, buildEmailMailto } from '../utils/formatters';

interface CarsPageProps {
  vehicles: Vehicle[];
  settings: PlatformSettings;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const CarsPage: React.FC<CarsPageProps> = ({
  vehicles,
  settings,
  onSelectVehicle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedFuelType, setSelectedFuelType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(vehicles.map((v) => v.make)));
    return ['All', ...list];
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(q);
          const matchDesc = v.description.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        // Brand
        if (selectedBrand !== 'All' && v.make !== selectedBrand) return false;

        // Transmission
        if (selectedTransmission !== 'All' && v.transmission !== selectedTransmission)
          return false;

        // Fuel Type
        if (selectedFuelType !== 'All' && v.fuelType !== selectedFuelType) return false;

        // Condition
        if (selectedCondition !== 'All' && v.condition !== selectedCondition) return false;

        // Min Price
        if (minPrice && v.price < Number(minPrice)) return false;

        // Max Price
        if (maxPrice && v.price > Number(maxPrice)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'oldest')
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        // default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    vehicles,
    searchQuery,
    selectedBrand,
    selectedTransmission,
    selectedFuelType,
    selectedCondition,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedTransmission('All');
    setSelectedFuelType('All');
    setSelectedCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  return (
    <div className="bg-[#FAFBFD] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Premium Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-12 text-white overflow-hidden shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>NEXUNIT Premium Automotive Inventory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Curated Luxury & Everyday Vehicles
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every vehicle undergoes multi-point inspection. Pricing is tailored and discussed directly via WhatsApp or Email for guaranteed transparency and personalised arrangements.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Documentation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Nationwide Inspection & Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>Direct Line: <strong className="text-white">0811 162 1502</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by make (e.g. Mercedes, Porsche), model, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-sm text-[#171717] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-[#737373] whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white cursor-pointer"
              >
                <option value="newest">Newest Inventory</option>
                <option value="oldest">Oldest Inventory</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick Brand Filter Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Filter by Brand:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedBrand === b
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'bg-[#F7F8FA] text-slate-600 hover:text-slate-900 border border-[#E5E7EB] hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-4 border-t border-[#E5E7EB]">
            {/* Condition */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-[#171717]"
              >
                <option value="All">All Conditions</option>
                <option value="Brand New">Brand New</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                <option value="Foreign Used">Foreign Used</option>
                <option value="Local Used">Local Used</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Transmission
              </label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-[#171717]"
              >
                <option value="All">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Fuel Type</label>
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-[#171717]"
              >
                <option value="All">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Min Price ($)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-[#171717]"
              />
            </div>

            {/* Max Price */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Price ($)</label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-[#171717]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-[#171717]">{filteredVehicles.length}</strong> available vehicle{filteredVehicles.length === 1 ? '' : 's'}
            </span>

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#171717] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">No vehicles match your filters</h3>
            <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
              Try adjusting your price range, clearing your search keywords, or selecting another brand.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div
                    onClick={() => onSelectVehicle(vehicle)}
                    className="relative h-60 bg-[#F7F8FA] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs font-semibold text-white inline-flex items-center gap-1">
                        View Full Gallery & Specs <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#171717] border border-[#E5E7EB] shadow-xs">
                      {vehicle.condition}
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      {vehicle.year}
                    </div>
                  </div>

                  {/* Vehicle Specs Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {vehicle.make}
                      </span>
                      <h3
                        onClick={() => onSelectVehicle(vehicle)}
                        className="text-lg font-bold text-[#171717] hover:text-[#2563EB] transition-colors cursor-pointer leading-snug mt-0.5"
                      >
                        {vehicle.model}
                      </h3>
                    </div>

                    {/* Technical Icons Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 bg-[#FAFBFD] -mx-6 px-6 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="truncate font-medium">{vehicle.mileage}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Cog className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="truncate font-medium">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="truncate font-medium">{vehicle.fuelType}</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] uppercase font-semibold text-slate-400 block">
                          Guide Price
                        </span>
                        <div className="text-xl font-extrabold text-[#171717] tabular-nums tracking-tight">
                          {formatCurrency(vehicle.price, settings.currencySymbol)}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Discuss With Dealer
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Channel Action Buttons */}
                <div className="p-6 pt-0 space-y-2.5">
                  <button
                    onClick={() => {
                      const text = `Hello NEXUNIT, I would like to inquire about the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Mileage: ${vehicle.mileage}). Can we discuss the price and inspection schedule?`;
                      window.open(buildWhatsAppUrl(settings.whatsappNumber, text), '_blank');
                    }}
                    className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Discuss on WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const subject = `Price Inquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
                        const body = `Hello NEXUNIT Team,\n\nI would like to inquire about the ${vehicle.year} ${vehicle.make} ${vehicle.model}.\n\nPlease share price discussion, inspection location and details.\n\nThank you!`;
                        window.open(buildEmailMailto(settings.businessEmail, subject, body), '_blank');
                      }}
                      className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-[#F7F8FA] hover:bg-slate-200 border border-[#E5E7EB] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Email</span>
                    </button>

                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 hover:text-[#171717] bg-white border border-[#E5E7EB] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

