import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Gauge, Cog, Fuel, MessageCircle, Mail } from 'lucide-react';
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
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Automotive Inventory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] mt-1">
            Find Your Next Car
          </h1>
          <p className="text-sm sm:text-base text-[#737373] mt-2 max-w-2xl">
            Explore our selection of vehicles and find one that suits your needs.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#F7F8FA] p-6 rounded-xl border border-[#E5E7EB] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                placeholder="Search by make, model, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-[#737373] whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="newest">Newest Listings</option>
                <option value="oldest">Oldest Listings</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Secondary Filter Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-[#E5E7EB]">
            {/* Brand */}
            <div>
              <label className="block text-[11px] font-semibold text-[#737373] mb-1">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-[11px] font-semibold text-[#737373] mb-1">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
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
              <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                Transmission
              </label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
              >
                <option value="All">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-[11px] font-semibold text-[#737373] mb-1">Fuel</label>
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
              >
                <option value="All">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-[11px] font-semibold text-[#737373] mb-1">Min Price</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-[11px] font-semibold text-[#737373] mb-1">Max Price</label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#737373]">
              Showing <strong className="text-[#171717]">{filteredVehicles.length}</strong> matching vehicle{filteredVehicles.length === 1 ? '' : 's'}
            </span>

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#171717] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] p-8">
            <SlidersHorizontal className="w-8 h-8 text-[#737373] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#171717]">No vehicles match your criteria</h3>
            <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
              Try adjusting your price range, fuel type, or clear the search query to view all available listings.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] rounded-lg cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Status Badge */}
                  <div className="relative h-56 bg-[#F7F8FA] overflow-hidden">
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-semibold text-[#171717] border border-[#E5E7EB]">
                      {vehicle.condition}
                    </div>
                    {vehicle.status !== 'Available' && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded text-[11px] font-bold">
                        {vehicle.status}
                      </div>
                    )}
                  </div>

                  {/* Vehicle Specs */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-xs text-[#737373]">
                        {vehicle.year} · {vehicle.make}
                      </span>
                      <h3 className="text-base font-bold text-[#171717] mt-0.5 group-hover:text-[#2563EB] transition-colors">
                        {vehicle.model}
                      </h3>
                    </div>

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

                    <div className="pt-1">
                      <div className="text-lg font-extrabold text-[#171717] tabular-nums">
                        {formatCurrency(vehicle.price, settings.currencySymbol)}
                      </div>
                      <span className="text-[11px] text-[#737373] block">
                        Sample demonstration price
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => {
                      const text = `Hello NEXUNIT, I would like to inquire about the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Mileage: ${vehicle.mileage}). Can we discuss the price?`;
                      window.open(buildWhatsAppUrl(settings.whatsappNumber, text), '_blank');
                    }}
                    className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Discuss on WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const subject = `Price Inquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
                        const body = `Hello NEXUNIT Team,\n\nI would like to inquire about the ${vehicle.year} ${vehicle.make} ${vehicle.model}.\n\nPlease share price and inspection details.\n\nThank you!`;
                        window.open(buildEmailMailto(settings.businessEmail, subject, body), '_blank');
                      }}
                      className="flex-1 py-1.5 px-2 text-xs font-medium text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[#2563EB]" />
                      <span>Email</span>
                    </button>

                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="flex-1 py-1.5 px-2 text-xs font-medium text-[#737373] hover:text-[#171717] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Details
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
