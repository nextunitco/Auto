import React from 'react';
import { MessageCircle, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl, buildEmailMailto } from '../utils/formatters';

interface FooterProps {
  onNavigate: (view: string) => void;
  whatsappNumber: string;
  businessEmail: string;
  businessPhone: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  whatsappNumber,
  businessEmail,
  businessPhone,
}) => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const url = buildWhatsAppUrl(
      whatsappNumber,
      'Hello NEXUNIT, I would like to get in touch to discuss pricing and product availability.'
    );
    window.open(url, '_blank');
  };

  const handleEmailClick = () => {
    const url = buildEmailMailto(
      businessEmail,
      'Price Inquiry & Order Discussion',
      'Hello NEXUNIT Team,\n\nI would like to discuss prices and order details for your automotive products.\n\nThank you!'
    );
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-[#F7F8FA] border-t border-[#E5E7EB] text-[#171717] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E5E7EB]">
          {/* Brand & Management */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-xl font-bold tracking-tight text-[#171717]">
              NEXUNIT <span className="font-light text-[#737373]">AUTO</span>
            </span>
            <p className="text-sm text-[#737373] leading-relaxed">
              Premium automotive marketplace and direct supplier for automobiles, genuine WD-40 products, and car care maintenance essentials.
            </p>
            <div className="pt-1">
              <span className="text-xs uppercase font-semibold text-[#737373] tracking-wider block">
                Operated & Managed By
              </span>
              <span className="text-sm font-bold text-[#171717]">
                NEXUNIT COOPERATION
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#737373]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cars')}
                  className="hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  Cars for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  WD-40 & Automotive Products
                </button>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp & Email Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Discuss Prices & Inquire
            </h4>
            <ul className="space-y-2.5 text-sm text-[#737373]">
              <li>
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center gap-1.5 text-[#16A34A] hover:underline cursor-pointer font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>DM on WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={handleEmailClick}
                  className="flex items-center gap-1.5 text-[#2563EB] hover:underline cursor-pointer font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email: {businessEmail}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <a
                  href={`tel:${businessPhone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 hover:text-[#171717] transition-colors font-medium text-[#171717]"
                  title="Call NEXUNIT directly"
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <span>Call: {businessPhone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#737373]" />
                <span>Direct Showroom & Dispatch</span>
              </li>
            </ul>
          </div>

          {/* Price Discussion Model Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Direct Inquiries
            </h4>
            <p className="text-xs text-[#737373] leading-relaxed">
              When you're ready to order vehicles or automotive care supplies, reach out to us directly on WhatsApp or Email. Our team will promptly discuss unit and wholesale pricing, delivery, and invoice terms with you.
            </p>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>
            © {currentYear} NEXUNIT AUTO. All rights reserved.
          </div>
          <div className="font-medium text-[#171717]">
            Platform Architecture & Management by <span className="text-[#2563EB]">NEXUNIT COOPERATION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
