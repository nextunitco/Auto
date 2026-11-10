import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  MessageCircle,
  Mail,
  Plus,
  Check,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import type { Product, ProductCategory, PlatformSettings } from '../types';
import { formatCurrency, buildWhatsAppUrl, buildEmailMailto } from '../utils/formatters';
import { useCart } from '../context/CartContext';

interface ProductsPageProps {
  products: Product[];
  settings: PlatformSettings;
  onSelectProduct: (product: Product) => void;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'WD-40 Products',
  'Lubricants',
  'Cleaning Products',
  'Car Care',
  'Automotive Accessories',
  'Other Products',
];

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  settings,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Max price
        if (maxPrice && p.price > Number(maxPrice)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleWhatsAppDM = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Hello NEXUNIT, I would like to buy *${product.name}* (${product.sizeVariant}). Can we discuss the price and delivery options?`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const handleEmailDM = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const subject = `Price Inquiry: ${product.name} (${product.sizeVariant})`;
    const body = `Hello NEXUNIT Team,\n\nI want to inquire about purchasing ${product.name} (${product.sizeVariant}). Could you please share the unit and bulk package pricing?\n\nThank you!`;
    const url = buildEmailMailto(settings.businessEmail, subject, body);
    window.open(url, '_blank');
  };

  const handleAddToList = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemName(product.name);
    setTimeout(() => setAddedItemName(null), 2200);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice('');
    setSortBy('featured');
  };

  return (
    <div className="bg-[#FAFBFD] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Elevated Product Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8 sm:p-12 text-white overflow-hidden shadow-xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authentic WD-40 & Automotive Essentials</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Workshop Grade Car Care & Lubricants
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Genuine WD-40 formulations, synthetic oils, detailing kits, and high-performance lubricants. Chat with our sales desk on WhatsApp to order singles or wholesale cases with rapid courier dispatch.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Nationwide Same-Day Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>Direct Sales Desk: <strong className="text-white">0811 162 1502</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating toast notification */}
        {addedItemName && (
          <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-2 border border-slate-700">
            <Check className="w-4 h-4 text-[#16A34A]" />
            <span>Added to Multi-Item Inquiry List!</span>
          </div>
        )}

        {/* Filter controls */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search lubricants, WD-40, silicone, car care kits..."
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
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Product Categories:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'bg-[#F7F8FA] text-slate-600 hover:text-slate-900 border border-[#E5E7EB] hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-[#171717]">{filteredProducts.length}</strong> available item{filteredProducts.length === 1 ? '' : 's'}
            </span>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#171717] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">No products match this selection</h3>
            <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
              Try switching categories or clearing your search keywords.
            </p>
            <button
              onClick={handleReset}
              className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl cursor-pointer transition-colors"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative h-56 bg-[#F7F8FA] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs font-semibold text-white inline-flex items-center gap-1">
                        View Product Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-700 border border-[#E5E7EB]">
                      {product.sizeVariant}
                    </div>

                    <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      In Stock
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-base font-bold text-[#171717] line-clamp-1 hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#737373] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="pt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Guide Price
                        </span>
                        <div className="text-lg font-extrabold text-[#171717] tabular-nums tracking-tight">
                          {formatCurrency(product.price, settings.currencySymbol)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleAddToList(product, e)}
                        title="Add to Multi-Item Inquiry List"
                        className="p-2 text-slate-600 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Purchase & Discussion Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={(e) => handleWhatsAppDM(product, e)}
                    className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Discuss on WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEmailDM(product, e)}
                      className="flex-1 py-2 px-2.5 text-xs font-semibold text-slate-700 bg-[#F7F8FA] hover:bg-slate-200 border border-[#E5E7EB] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[#2563EB]" />
                      <span>Email</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-2 px-2.5 text-xs font-semibold text-slate-700 hover:text-[#171717] bg-white border border-[#E5E7EB] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-center"
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

