import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, MessageCircle, Mail, Plus, Check } from 'lucide-react';
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

  const handleAddToList = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemName(product.name);
    setTimeout(() => setAddedItemName(null), 2000);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice('');
    setSortBy('featured');
  };

  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Direct E-Commerce & Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] mt-1">
            Automotive Essentials & WD-40
          </h1>
          <p className="text-sm sm:text-base text-[#737373] mt-2 max-w-2xl">
            To purchase products, DM us directly on WhatsApp or Email to discuss quantities, unit rates, and delivery arrangements.
          </p>
        </div>

        {/* Floating toast notification */}
        {addedItemName && (
          <div className="fixed top-20 right-6 z-50 bg-[#171717] text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-[#16A34A]" />
            <span>Added to Multi-Item Inquiry List!</span>
          </div>
        )}

        {/* Filter controls */}
        <div className="bg-[#F7F8FA] p-6 rounded-xl border border-[#E5E7EB] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                placeholder="Search lubricants, WD-40, car care..."
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
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#171717] text-white'
                        : 'bg-white text-[#737373] hover:text-[#171717] border border-[#E5E7EB]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#737373]">
              Showing <strong className="text-[#171717]">{filteredProducts.length}</strong> product{filteredProducts.length === 1 ? '' : 's'}
            </span>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#171717] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] p-8">
            <h3 className="text-base font-bold text-[#171717]">No products match this selection</h3>
            <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
              Try switching categories or clearing your search keywords.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] rounded-lg cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative h-52 bg-[#F7F8FA] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-[#16A34A] border border-[#E5E7EB]">
                      In Stock
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-bold text-[#171717] line-clamp-1 hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#737373]">{product.sizeVariant}</p>
                    <p className="text-xs text-[#737373] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-[10px] text-[#737373] uppercase font-semibold block">
                        Guide Price
                      </span>
                      <div className="text-base font-extrabold text-[#171717] tabular-nums">
                        {formatCurrency(product.price, settings.currencySymbol)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Purchase & Discussion Actions */}
                <div className="p-4 pt-0 space-y-2">
                  <button
                    onClick={(e) => handleWhatsAppDM(product, e)}
                    className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
        )}
      </div>
    </div>
  );
};
