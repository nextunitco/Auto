import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Car, Package, HelpCircle, Phone } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/formatters';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLaunch = (topic: string) => {
    let msg = '';
    if (topic === 'car') {
      msg = 'Hello NEXUNIT, I would like to inquire about available vehicles in your inventory.';
    } else if (topic === 'product') {
      msg = 'Hello NEXUNIT, I have a question regarding your WD-40 and automotive care products.';
    } else {
      msg = 'Hello NEXUNIT, I need general assistance with an order or service.';
    }

    const url = buildWhatsAppUrl(whatsappNumber, msg);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-4 text-[#171717] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#171717]">NEXUNIT Concierge</h4>
                <p className="text-[11px] text-[#737373]">Live WhatsApp Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#737373] hover:text-[#171717] rounded-md transition-colors cursor-pointer"
              aria-label="Close WhatsApp options"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#737373] my-3 leading-relaxed">
            How can our automotive sales & product specialists assist you today?
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleLaunch('car')}
              className="w-full flex items-center justify-between p-2.5 text-xs font-medium text-left bg-[#F7F8FA] hover:bg-blue-50 hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#2563EB]" />
                Inquire About a Vehicle
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => handleLaunch('product')}
              className="w-full flex items-center justify-between p-2.5 text-xs font-medium text-left bg-[#F7F8FA] hover:bg-blue-50 hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#16A34A]" />
                WD-40 & Product Inquiries
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => handleLaunch('general')}
              className="w-full flex items-center justify-between p-2.5 text-xs font-medium text-left bg-[#F7F8FA] hover:bg-blue-50 hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#737373]" />
                Customer Support & Orders
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <a
              href="tel:+2348111621502"
              className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-left bg-blue-50 text-[#2563EB] hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2563EB]" />
                Call Directly: 0811 162 1502
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-[#16A34A] hover:bg-[#15803d] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
        aria-label="Open WhatsApp conversation"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};
