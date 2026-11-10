import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Mail, Phone, Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { buildWhatsAppUrl, buildEmailMailto } from '../utils/formatters';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  whatsappNumber: string;
  businessEmail: string;
  businessPhone: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  whatsappNumber,
  businessEmail,
  businessPhone,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'cars', label: 'Cars for Sale' },
    { id: 'products', label: 'WD-40 & Products' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const handleDirectWhatsApp = () => {
    const url = buildWhatsAppUrl(
      whatsappNumber,
      'Hello NEXUNIT, I would like to inquire about your automotive products and discuss pricing.'
    );
    window.open(url, '_blank');
  };

  const handleDirectEmail = () => {
    const url = buildEmailMailto(
      businessEmail,
      'Price & Product Inquiry - NEXUNIT AUTO',
      'Hello NEXUNIT Team,\n\nI would like to enquire about your available automotive inventory and discuss product pricing.\n\nThank you!'
    );
    window.open(url, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      {/* Top Announcement & Quick Contact Bar */}
      <div className="bg-[#171717] text-white text-[11px] py-2 px-4 sm:px-6 lg:px-8 border-b border-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="font-medium text-gray-200">
              Direct Sales & Wholesale Inquiries · Nationwide Dispatch Across Nigeria
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <a
              href={`tel:${businessPhone.replace(/[^0-9+]/g, '')}`}
              className="hover:text-white transition-colors flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3 text-[#2563EB]" />
              <span>Call: 0811 162 1502</span>
            </a>
            <span className="hidden sm:inline text-gray-600">·</span>
            <button
              onClick={handleDirectWhatsApp}
              className="hover:text-white transition-colors flex items-center gap-1 text-[#16A34A] font-semibold cursor-pointer"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp: 0811 162 1502</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Brand Identity Lockup */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left cursor-pointer group focus-visible:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#171717] to-[#2563EB] text-white flex items-center justify-center font-black text-lg tracking-wider shadow-sm group-hover:scale-102 transition-transform">
              NX
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-[#171717] group-hover:text-[#2563EB] transition-colors whitespace-nowrap leading-none flex items-center gap-1.5">
                <span>NEXUNIT</span>
                <span className="font-light text-[#2563EB]">AUTO</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#737373] mt-1 block">
                Automotive & Lubrication
              </span>
            </div>
          </button>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#737373]">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#2563EB] font-bold'
                      : 'hover:text-[#171717]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary Action Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Inquiry List Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#171717] hover:text-[#2563EB] hover:bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] transition-all cursor-pointer shadow-xs"
              title="View Inquiry List"
              aria-label="View selected items inquiry list"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-[#2563EB] rounded-full shadow-sm ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Direct Phone Call Button */}
            <a
              href={`tel:${businessPhone.replace(/[^0-9+]/g, '')}`}
              className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-xl transition-all shadow-xs"
              title="Call directly"
            >
              <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>0811 162 1502</span>
            </a>

            {/* Email DM Button */}
            <button
              onClick={handleDirectEmail}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#171717] bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
              title="Email Us to Discuss Prices"
            >
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Email Us</span>
            </button>

            {/* WhatsApp DM Button */}
            <button
              onClick={handleDirectWhatsApp}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-98"
              title="Chat on WhatsApp (08111621502) to Discuss Prices"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp DM</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-[#737373] hover:text-[#171717] hover:bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-semibold rounded-xl text-left transition-colors ${
                  isActive
                    ? 'bg-[#2563EB]/10 text-[#2563EB]'
                    : 'text-[#171717] hover:bg-[#F7F8FA]'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#E5E7EB] space-y-2.5">
            <a
              href={`tel:${businessPhone.replace(/[^0-9+]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-[#171717] rounded-xl shadow-sm"
            >
              <Phone className="w-4 h-4 text-[#2563EB]" />
              <span>Call Us: 0811 162 1502</span>
            </a>
            <button
              onClick={handleDirectWhatsApp}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-[#16A34A] rounded-xl shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp DM: 0811 162 1502</span>
            </button>
            <button
              onClick={handleDirectEmail}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#171717] bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <span>Email: {businessEmail}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
