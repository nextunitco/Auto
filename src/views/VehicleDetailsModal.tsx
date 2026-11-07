import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Mail,
  Check,
  Gauge,
  Cog,
  Fuel,
  Palette,
  ShieldCheck,
  Send,
  AlertCircle,
  PhoneCall,
} from 'lucide-react';
import type { Vehicle, PlatformSettings } from '../types';
import { formatCurrency, buildWhatsAppUrl, buildEmailMailto } from '../utils/formatters';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  settings: PlatformSettings;
  onClose: () => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  settings,
  onClose,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!vehicle) return null;

  const handleWhatsAppEnquiry = () => {
    const text = `Hello NEXUNIT, I am interested in purchasing the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Mileage: ${vehicle.mileage}). I would like to discuss the price and inspection schedule with you.`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const handleEmailEnquiry = () => {
    const subject = `Price Discussion & Inquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    const body = `Hello NEXUNIT Team,\n\nI am inquiring about the ${vehicle.year} ${vehicle.make} ${vehicle.model}.\n\nMileage: ${vehicle.mileage}\nEngine: ${vehicle.engineCapacity}\n\nCould you please share further details and discuss pricing?\n\nThank you!`;
    const url = buildEmailMailto(settings.businessEmail, subject, body);
    window.open(url, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vehicle',
          itemId: vehicle.id,
          itemTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          message: formData.notes || `Price discussion inquiry for ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E5E7EB] flex flex-col text-[#171717]">
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <span className="text-xs text-[#737373]">
              {vehicle.year} · {vehicle.make}
            </span>
            <h2 className="text-xl font-bold text-[#171717]">{vehicle.model}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#737373] hover:text-[#171717] rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="h-[280px] sm:h-[400px] rounded-xl overflow-hidden bg-[#F7F8FA] border border-[#E5E7EB]">
              <img
                src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {vehicle.images.length > 1 && (
              <div className="flex gap-3">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#2563EB] ring-2 ring-blue-100'
                        : 'border-[#E5E7EB] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Discussion Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
            <div>
              <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Guide / Valuation Price
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] tabular-nums mt-0.5">
                {formatCurrency(vehicle.price, settings.currencySymbol)}
              </div>
              <p className="text-xs text-[#737373] mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>
                  DM us on WhatsApp or Email to negotiate and finalize exact price and inspection.
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-white border border-[#E5E7EB] text-[#171717]">
                {vehicle.condition}
              </span>
              <span
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  vehicle.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {vehicle.status}
              </span>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="text-[11px] text-[#737373] flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-[#2563EB]" />
                  Mileage
                </span>
                <p className="text-sm font-bold text-[#171717]">{vehicle.mileage}</p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="text-[11px] text-[#737373] flex items-center gap-1">
                  <Cog className="w-3.5 h-3.5 text-[#2563EB]" />
                  Transmission
                </span>
                <p className="text-sm font-bold text-[#171717]">{vehicle.transmission}</p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="text-[11px] text-[#737373] flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-[#2563EB]" />
                  Fuel Type
                </span>
                <p className="text-sm font-bold text-[#171717]">{vehicle.fuelType}</p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="text-[11px] text-[#737373] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                  Engine Capacity
                </span>
                <p className="text-xs font-bold text-[#171717] truncate">{vehicle.engineCapacity}</p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="text-[11px] text-[#737373] flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#2563EB]" />
                  Exterior Color
                </span>
                <p className="text-xs font-bold text-[#171717] truncate">{vehicle.exteriorColor}</p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="text-[11px] text-[#737373] flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#2563EB]" />
                  Interior Color
                </span>
                <p className="text-xs font-bold text-[#171717] truncate">{vehicle.interiorColor}</p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="text-[11px] text-[#737373]">Year</span>
                <p className="text-sm font-bold text-[#171717]">{vehicle.year}</p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="text-[11px] text-[#737373]">Listing Ref</span>
                <p className="text-xs font-bold text-[#171717] truncate">NX-VEH-{vehicle.id.slice(-4)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Vehicle Overview
            </h3>
            <p className="text-sm text-[#737373] leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Key Equipment & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#171717]">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Inquiry Form */}
          {showEnquiryForm && (
            <div className="p-6 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] space-y-4">
              <h3 className="text-sm font-bold text-[#171717]">
                Request Price Discussion for {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>

              {submitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Inquiry received!</span>
                  </div>
                  <p>
                    Our automotive specialist will contact you via WhatsApp or Email promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. David Sterling"
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
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +1 555 019 2831"
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. david@example.com"
                      className="w-full py-2 px-3 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#737373] mb-1">
                      Inspection Preferences / Offer Note
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Mention your target budget, trade-in, or viewing date..."
                      className="w-full py-2 px-3 bg-white border border-[#E5E7EB] rounded-md text-xs text-[#171717]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Submitting...' : 'Send Inquiry'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEnquiryForm(false)}
                      className="px-4 py-2.5 text-xs text-[#737373] hover:text-[#171717] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Prominent Direct Communication Buttons */}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center gap-3">
            {/* Button 1: Discuss on WhatsApp */}
            <button
              onClick={handleWhatsAppEnquiry}
              className="w-full sm:flex-1 py-3.5 px-4 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuss Price on WhatsApp</span>
            </button>

            {/* Button 2: Discuss via Email */}
            <button
              onClick={handleEmailEnquiry}
              className="w-full sm:flex-1 py-3.5 px-4 text-xs font-semibold text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <span>Discuss Price via Email</span>
            </button>

            {/* Button 3: Form Toggle */}
            <button
              onClick={() => setShowEnquiryForm(!showEnquiryForm)}
              className="w-full sm:w-auto py-3.5 px-4 text-xs font-medium text-[#737373] hover:text-[#171717] rounded-lg border border-[#E5E7EB] hover:bg-[#F7F8FA] cursor-pointer whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 inline mr-1.5" />
              <span>Leave Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
