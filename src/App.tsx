import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './views/HomePage';
import { CarsPage } from './views/CarsPage';
import { ProductsPage } from './views/ProductsPage';
import { VehicleDetailsModal } from './views/VehicleDetailsModal';
import { ProductDetailsModal } from './views/ProductDetailsModal';
import type { Vehicle, Product, PlatformSettings } from './types';

const INITIAL_SETTINGS: PlatformSettings = {
  businessName: 'NEXUNIT Automotive & Products',
  businessEmail: 'nextunitco@gmail.com',
  businessPhone: '+234 811 162 1502',
  whatsappNumber: '2348111621502',
  vehicleCommissionType: 'percentage',
  vehicleCommissionValue: 2.5,
  productCommissionType: 'percentage',
  productCommissionValue: 7.0,
  deliveryFee: 15.0,
  freeDeliveryThreshold: 120.0,
  vehicleDirectCheckoutEnabled: false,
  bankName: 'Standard Commerce Bank',
  bankAccountName: 'NEXUNIT AUTO SALES & TRADING',
  bankAccountNumber: '1029384756',
  bankSortCodeOrSwift: 'SCBNG044',
  paystackEnabled: false,
  paystackPublicKey: '',
  flutterwaveEnabled: false,
  flutterwavePublicKey: '',
  currencySymbol: '$',
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);

  // Modals & Active selections
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch initial public data
  const loadPlatformData = async () => {
    try {
      const [resVehicles, resProducts, resSettings] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/products'),
        fetch('/api/settings'),
      ]);

      if (resVehicles.ok) setVehicles(await resVehicles.json());
      if (resProducts.ok) setProducts(await resProducts.json());
      if (resSettings.ok) setSettings(await resSettings.json());
    } catch (err) {
      console.error('Failed to load platform data:', err);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#171717]">
        {/* Navigation Bar */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          whatsappNumber={settings.whatsappNumber}
          businessEmail={settings.businessEmail}
          businessPhone={settings.businessPhone}
        />

        {/* Main View Router */}
        <main className="flex-1">
          {currentView === 'home' && (
            <HomePage
              vehicles={vehicles}
              products={products}
              settings={settings}
              onNavigate={handleNavigate}
              onSelectVehicle={handleSelectVehicle}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {currentView === 'cars' && (
            <CarsPage
              vehicles={vehicles}
              settings={settings}
              onSelectVehicle={handleSelectVehicle}
            />
          )}

          {currentView === 'products' && (
            <ProductsPage
              products={products}
              settings={settings}
              onSelectProduct={handleSelectProduct}
            />
          )}
        </main>

        {/* Vehicle Details Modal */}
        {selectedVehicle && (
          <VehicleDetailsModal
            vehicle={selectedVehicle}
            settings={settings}
            onClose={() => setSelectedVehicle(null)}
          />
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            allProducts={products}
            settings={settings}
            onClose={() => setSelectedProduct(null)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Multi-Item Inquiry List Drawer */}
        <CartDrawer
          settings={settings}
          onNavigateToProducts={() => handleNavigate('products')}
        />

        {/* Floating WhatsApp Contact Concierge */}
        <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />

        {/* Minimalist Light Mode Footer */}
        <Footer
          onNavigate={handleNavigate}
          whatsappNumber={settings.whatsappNumber}
          businessEmail={settings.businessEmail}
          businessPhone={settings.businessPhone}
        />
      </div>
    </CartProvider>
  );
}
