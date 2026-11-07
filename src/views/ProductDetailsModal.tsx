import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Mail,
  Check,
  ShoppingBag,
  Sparkles,
  Send,
  PhoneCall,
  Clock,
} from 'lucide-react';
import type { Product, PlatformSettings } from '../types';
import { formatCurrency, buildWhatsAppUrl, buildEmailMailto } from '../utils/formatters';
import { useCart } from '../context/CartContext';

interface ProductDetailsModalProps {
  product: Product | null;
  allProducts: Product[];
  settings: PlatformSettings;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  allProducts,
  settings,
  onClose,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showDirectForm, setShowDirectForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) return null;

  const currentVariant = product.variants?.find((v) => v.name === selectedVariant);
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeVariantName = selectedVariant || product.sizeVariant;

  const handleWhatsAppDM = () => {
    const text = `Hello NEXUNIT, I want to purchase *${product.name}* (Variant: ${activeVariantName}, Quantity: ${quantity}). I would like to discuss the price and delivery options with you.`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const handleEmailDM = () => {
    const subject = `Price Inquiry: ${product.name} (${activeVariantName})`;
    const body = `Hello NEXUNIT Team,\n\nI am interested in buying ${quantity}x ${product.name} (${activeVariantName}).\n\nCould we discuss the unit/package price and available dispatch options?\n\nLooking forward to your response.`;
    const url = buildEmailMailto(settings.businessEmail, subject, body);
    window.open(url, '_blank');
  };

  const handleAddToInquiryList = () => {
    addToCart(product, quantity, activeVariantName);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product',
          itemId: product.id,
          itemTitle: `${product.name} (${activeVariantName}, Qty: ${quantity})`,
          customerName,
          customerPhone,
          customerEmail,
          message:
            customNotes ||
            `Customer would like to discuss prices for ${quantity}x ${product.name} (${activeVariantName})`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E5E7EB] flex flex-col text-[#171717]">
        {/* Top Header */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <span className="text-xs text-[#737373] uppercase tracking-wider">
              {product.category}
            </span>
            <h2 className="text-lg font-bold text-[#171717]">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#737373] hover:text-[#171717] rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Image Left */}
            <div className="md:col-span-5 space-y-3">
              <div className="h-64 sm:h-72 rounded-xl overflow-hidden bg-[#F7F8FA] border border-[#E5E7EB]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-[#737373]">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Genuine Authentic Stock · Direct NEXUNIT Supply</span>
              </div>
            </div>

            {/* Purchase & Inquiry Details Right */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                  Reference Guide Price
                </span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-2xl font-extrabold text-[#171717] tabular-nums">
                    {formatCurrency(activePrice, settings.currencySymbol)}
                  </span>
                  <span className="text-xs text-[#737373]">{activeVariantName}</span>
                </div>

                <div className="mt-2 p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  Price is negotiable based on order volume, bulk purchase, and delivery destination. DM us on WhatsApp or Email to discuss directly!
                </div>
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#171717]">Select Size / Variant</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant === v.name;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v.name)}
                          className={`px-3 py-1.5 text-xs rounded-md border font-medium cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                              : 'border-[#E5E7EB] bg-white text-[#737373] hover:text-[#171717]'
                          }`}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Direct Purchase Actions (WhatsApp DM & Email) */}
              <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp DM Button */}
                  <button
                    onClick={handleWhatsAppDM}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>DM on WhatsApp to Discuss Price</span>
                  </button>

                  {/* Email DM Button */}
                  <button
                    onClick={handleEmailDM}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#2563EB]" />
                    <span>Email to Discuss Price</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleAddToInquiryList}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{addedToast ? 'Added to Inquiry List!' : '+ Add to Multi-Item Inquiry'}</span>
                  </button>

                  <button
                    onClick={() => setShowDirectForm(!showDirectForm)}
                    className="py-2 px-3 text-xs text-[#737373] hover:text-[#171717] cursor-pointer"
                  >
                    Leave Contact Info
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Product Description
                </h4>
                <p className="text-xs text-[#737373] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                    Key Characteristics
                  </h4>
                  <ul className="space-y-1.5">
                    {product.specifications.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[#737373]">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quick Direct Message Form if active */}
          {showDirectForm && (
            <div className="p-6 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] space-y-4">
              <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#2563EB]" />
                Request Price Discussion for {product.name}
              </h3>

              {submitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>
                    Thank you! Your inquiry has been received. Our team will contact you via WhatsApp or Email.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Michael"
                        className="w-full py-2 px-3 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. +1 555 234 5678"
                        className="w-full py-2 px-3 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. michael@example.com"
                      className="w-full py-2 px-3 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                      Quantity or Questions
                    </label>
                    <textarea
                      rows={2}
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="State how many units you need or delivery city..."
                      className="w-full py-2 px-3 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Sending...' : 'Send Direct Inquiry'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDirectForm(false)}
                      className="text-xs text-[#737373] hover:text-[#171717] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-[#E5E7EB] space-y-4">
              <h3 className="text-sm font-bold text-[#171717]">Related Automotive Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      setSelectedVariant('');
                      setQuantity(1);
                    }}
                    className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] hover:bg-white hover:shadow-sm transition-all cursor-pointer flex gap-3 items-center"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-14 h-14 object-cover rounded-md bg-white border border-[#E5E7EB]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-[#171717] truncate">{rel.name}</h5>
                      <p className="text-[11px] text-[#737373]">{rel.sizeVariant}</p>
                      <p className="text-xs font-semibold text-[#171717] tabular-nums mt-0.5">
                        {formatCurrency(rel.price, settings.currencySymbol)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
