import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Mail, Phone, Menu, X } from 'lucide-react';
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
    { id: 'cars', label: 'Cars' },
    { id: 'products', label: 'Automotive Products' },
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar 3-Zone Contract */}
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left cursor-pointer group focus-visible:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-[#171717] group-hover:text-[#2563EB] transition-colors whitespace-nowrap shrink-0">
              NEXUNIT <span className="font-light text-[#737373]">AUTO</span>
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#737373]">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                    isActive
                      ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB]'
                      : 'hover:text-[#171717]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Direct Phone Call Button */}
            <a
              href={`tel:${businessPhone.replace(/[^0-9+]/g, '')}`}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#171717] hover:text-[#2563EB] transition-colors"
              title="Call 08111621502 directly"
            >
              <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>0811 162 1502</span>
            </a>

            {/* Inquiry List / Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#171717] hover:text-[#2563EB] hover:bg-[#F7F8FA] rounded-lg transition-colors cursor-pointer"
              title="View Inquiry List"
              aria-label="View selected items inquiry list"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[11px] font-bold text-white bg-[#2563EB] rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Email DM CTA */}
            <button
              onClick={handleDirectEmail}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#171717] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Email Us to Discuss Prices"
            >
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Email Us</span>
            </button>

            {/* WhatsApp DM CTA */}
            <button
              onClick={handleDirectWhatsApp}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
              title="Chat on WhatsApp (08111621502) to Discuss Prices"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp DM</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#737373] hover:text-[#171717] hover:bg-[#F7F8FA] rounded-lg transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold'
                    : 'text-[#171717] hover:bg-[#F7F8FA]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
            <a
              href={`tel:${businessPhone.replace(/[^0-9+]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-lg shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us: 0811 162 1502</span>
            </a>
            <button
              onClick={handleDirectWhatsApp}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#16A34A] rounded-lg shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp DM (0811 162 1502)</span>
            </button>
            <button
              onClick={handleDirectEmail}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#171717] bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg shadow-xs"
            >
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <span>Email Us ({businessEmail})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
