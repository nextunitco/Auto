import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, Mail, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, buildWhatsAppUrl, buildEmailMailto } from '../utils/formatters';
import type { PlatformSettings } from '../types';

interface CartDrawerProps {
  onNavigateToProducts: () => void;
  settings: PlatformSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToProducts,
  settings,
}) => {
  const { items, removeFromCart, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isCartOpen) return null;

  // Format list for WhatsApp & Email
  const itemsTextList = items
    .map((item) => `- ${item.quantity}x ${item.name} (${item.sizeVariant})`)
    .join('\n');

  const handleWhatsAppInquiry = () => {
    const message = `Hello NEXUNIT, I would like to discuss prices and availability for the following items:\n\n${itemsTextList}\n\nEstimated Reference Total: ${formatCurrency(
      subtotal,
      settings.currencySymbol
    )}\n\nPlease let me know your best offer and delivery arrangements.`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, message);
    window.open(url, '_blank');
  };

  const handleEmailInquiry = () => {
    const subject = `Price Discussion for ${items.length} Automotive Product(s)`;
    const body = `Hello NEXUNIT Team,\n\nI am interested in purchasing the following items and would like to discuss the prices:\n\n${itemsTextList}\n\nEstimated Reference Subtotal: ${formatCurrency(
      subtotal,
      settings.currencySymbol
    )}\n\nPlease provide your quotation and available fulfillment options.\n\nThank you!`;
    const url = buildEmailMailto(settings.businessEmail, subject, body);
    window.open(url, '_blank');
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product',
          itemTitle: `${items.length} Products Inquiry (${items.map((i) => i.name).join(', ')})`,
          customerName: inquiryName,
          customerPhone: inquiryPhone,
          message: `Inquiry to discuss prices for:\n${itemsTextList}\nReference Total: ${formatCurrency(
            subtotal,
            settings.currencySymbol
          )}`,
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E5E7EB]">
          {/* Header */}
          <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base font-bold text-[#171717]">Inquiry List</h2>
              <span className="text-xs text-[#737373]">({items.length} items)</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#737373] hover:text-[#171717] rounded-lg transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info Banner */}
          <div className="px-6 py-2.5 bg-blue-50/70 border-b border-blue-100 text-[11px] text-blue-900 leading-relaxed">
            Discuss prices directly with us on WhatsApp or Email for unit and bulk orders.
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#737373] mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-[#171717]">No items in your inquiry list</h3>
                <p className="text-xs text-[#737373] mt-1 max-w-xs">
                  Browse our WD-40 products and automotive essentials to discuss pricing.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToProducts();
                  }}
                  className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA]/60"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md bg-white border border-[#E5E7EB]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-[#171717] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#737373] mt-0.5">{item.sizeVariant}</p>
                      <p className="text-xs font-bold text-[#171717] mt-1 tabular-nums">
                        Ref. {formatCurrency(item.price, settings.currencySymbol)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7EB]/60">
                      <div className="flex items-center border border-[#E5E7EB] rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-[#737373] hover:text-[#171717] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#171717] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-[#737373] hover:text-[#171717] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#737373] hover:text-red-600 transition-colors cursor-pointer p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E5E7EB] bg-[#F7F8FA] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#737373]">
                  <span>Items Selected</span>
                  <span className="font-semibold text-[#171717]">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} units
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#171717]">
                  <span>Reference Value</span>
                  <span className="tabular-nums">
                    {formatCurrency(subtotal, settings.currencySymbol)}
                  </span>
                </div>
                <p className="text-[11px] text-[#737373]">
                  Final unit price, volume discounts, and delivery charges are confirmed directly in conversation.
                </p>
              </div>

              {/* Direct WhatsApp & Email Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Prices on WhatsApp</span>
                </button>

                <button
                  onClick={handleEmailInquiry}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#171717] bg-white hover:bg-gray-100 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  <span>Discuss Prices via Email</span>
                </button>

                {showQuickForm ? (
                  <div className="pt-2">
                    {submitted ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>Inquiry received! We will contact you shortly.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleQuickSubmit} className="space-y-2 pt-1">
                        <input
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full py-1.5 px-2.5 bg-white border border-[#E5E7EB] rounded text-xs"
                        />
                        <input
                          type="tel"
                          required
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="Phone / WhatsApp Number"
                          className="w-full py-1.5 px-2.5 bg-white border border-[#E5E7EB] rounded text-xs"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded cursor-pointer"
                          >
                            {submitting ? 'Submitting...' : 'Submit Inquiry'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowQuickForm(false)}
                            className="px-2 py-1.5 text-xs text-[#737373]"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowQuickForm(true)}
                    className="w-full text-center text-[11px] text-[#737373] hover:text-[#171717] py-1 cursor-pointer"
                  >
                    Or send a quick message directly on this page
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
