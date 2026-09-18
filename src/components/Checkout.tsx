import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Upload, X, Image as ImageIcon, Building2, ShieldCheck, CheckCircle2, AlertCircle, FileText, Globe } from 'lucide-react';
import { CartItem, CheckoutDetails, Currency } from '../types';
import { BANK_DETAILS, formatPrice, convertPrice, getCurrencySymbol } from '../currency';

interface CheckoutProps {
  cartItems: CartItem[];
  currency?: Currency;
  onCurrencyChange?: (c: Currency) => void;
  onBackToCart: () => void;
  onOrderSuccess: (details: CheckoutDetails) => void;
}

export default function Checkout({ 
  cartItems, 
  currency = 'EUR',
  onCurrencyChange,
  onBackToCart, 
  onOrderSuccess 
}: CheckoutProps) {
  const [formData, setFormData] = useState<CheckoutDetails>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Germany',
    currency: 'EUR',
    paymentMethod: 'bank_transfer',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedBankRegion] = useState<'DE' | 'EUR'>('DE');
  
  // Bank modal state
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = 0; // 0% Estimated Tax as requested
  const shippingFee = 0; // 100% Free Shipping
  const total = subtotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenBankModal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Form Validations for shipping address
    if (!formData.fullName || !formData.email || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode) {
      setErrorMessage('Please complete all standard shipping address fields to proceed.');
      return;
    }

    setShowBankModal(true);
  };

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setModalError('Please upload an image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setModalError('');
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentDisplayCurrency: Currency = 'EUR';
  const totalAmountInRegion = formatPrice(total, 'EUR');

  const handleCompleteOrder = () => {
    setModalError('');
    if (!screenshot) {
      setModalError('Please upload your EUR payment transfer screenshot (SS) to verify order payment.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowBankModal(false);
      
      const generatedOrderId = `114-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
      const generatedTrackingNumber = `US-DE-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const orderTimestamp = new Date().toISOString();

      onOrderSuccess({
        ...formData,
        orderId: generatedOrderId,
        trackingNumber: generatedTrackingNumber,
        orderDate: orderTimestamp,
        country: 'Germany',
        currency: 'EUR',
        totalPaidFormatted: totalAmountInRegion,
        bankRegion: 'DE',
        paymentScreenshot: screenshot,
        items: cartItems,
      });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <button
        onClick={onBackToCart}
        className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-amber-500 transition-colors gap-2 cursor-pointer mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to shopping basket
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Shipping Address Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs space-y-5">
            <h3 className="text-lg font-bold font-sans text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 bg-amber-500 rounded-full text-slate-950 text-xs font-black flex items-center justify-center">1</span>
                Prime Delivery Shipping Address
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                🇩🇪 Germany Delivery (EUR €)
              </span>
            </h3>

            {errorMessage && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Lukas Weber"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="lukas.weber@example.de"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+49 30 12345678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Shipping Country / Destination
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value="Germany"
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-400 bg-amber-50/50 text-sm font-bold text-slate-900 cursor-not-allowed"
                  >
                    <option value="Germany">🇩🇪 Germany (Deutschland) — Store Exclusive Destination</option>
                  </select>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1 flex items-center gap-1">
                  ✓ Direct 10-Day Transatlantic Shipping from USA to Germany (DHL / Deutsche Post) • 100% Free
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Street Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  placeholder={formData.country === 'Germany' ? 'Friedrichstraße 45' : '10 Downing Street'}
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Street Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Apt / Suite / Floor"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder={formData.country === 'Germany' ? 'Berlin' : 'Frankfurt'}
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  State / Region
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder={formData.country === 'Germany' ? 'Berlin / Hessen' : 'Region'}
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  placeholder={formData.country === 'Germany' ? '10117' : '60311'}
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Bank Payment Method Info Card */}
          <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl flex items-center gap-3">
            <Building2 className="w-6 h-6 text-amber-600 shrink-0" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block">
                🇩🇪 Direct EUR Bank Transfer (Clear Bank)
              </span>
              Clicking <span className="font-bold text-amber-700">Pay & Complete Secure Order</span> will display our Clear Bank EUR Account (<span className="font-bold text-slate-900">Account Holder: Faran ahmed</span>, <span className="font-bold text-slate-900">IBAN: GB06CLRB04281222476203</span>, BIC/SWIFT: <span className="font-bold">CLRBGB22XXX</span>) and upload input for transfer receipt.
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Button */}
        <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-5 lg:sticky lg:top-28 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 font-bold text-base font-sans uppercase tracking-wide">
              Purchase Summary
            </h3>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">
              EUR (€)
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-md p-1 flex items-center justify-center shrink-0">
                    <img src={item.product.image} className="w-full h-full object-contain" referrerPolicy="no-referrer" alt={item.product.name} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity} {item.selectedColor ? `| ${item.selectedColor}` : ''}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 shrink-0">
                  {formatPrice(item.product.price * item.quantity, currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full h-px border-t border-slate-200"></div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Checkout Subtotal</span>
              <span className="font-mono text-slate-700">{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Estimated Tax (0%)</span>
              <span className="font-mono text-emerald-600 font-bold">{formatPrice(0, currency)} (Zero Tax)</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Prime Shipping & Delivery</span>
              <span className="text-emerald-600 font-bold text-xs uppercase">FREE (€0.00)</span>
            </div>
            <div className="w-full h-px border-t border-slate-200 my-2"></div>
            <div className="flex justify-between font-bold text-sm text-slate-800">
              <span>Grand Total</span>
              <span className="font-mono text-slate-950 text-base">{formatPrice(total, currency)}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenBankModal}
              className="w-full inline-flex items-center justify-center p-3.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-md gap-2 cursor-pointer group"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
              <span>PAY & COMPLETE SECURE ORDER • {formatPrice(total, currency)}</span>
            </button>
            
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100/60 flex gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-[10px] text-emerald-700 leading-tight">
                <span className="font-bold block">MzAmazon Trusted Escrow</span>
                Bank transfer verified under standard buyer protection and instant cashbacks.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BANK DETAILS & SCREENSHOT UPLOAD MODAL */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 relative space-y-5 my-8">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full inline-block mb-1">
                  Direct Bank Transfer
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Bank Payment Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transfer exactly <span className="font-bold text-slate-900 font-mono text-sm">{totalAmountInRegion}</span> ({currentDisplayCurrency}) to the account below
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bank details card matching the provided Clear Bank EUR Account screenshot */}
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
              {/* Account Type Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-amber-600 text-base">
                    €
                  </div>
                  <div>
                    <span className="font-black text-slate-900 text-base block leading-none">
                      EUR Account
                    </span>
                    <span className="text-[11px] text-rose-600 font-bold block mt-1">
                      Only for EUR Transfers
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Due</span>
                  <span className="font-mono font-black text-slate-950 text-base">{totalAmountInRegion}</span>
                </div>
              </div>

              {/* Account Holder Name */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Account Holder Name</span>
                  <span className="font-bold text-slate-950 text-base tracking-wide select-all">
                    {BANK_DETAILS.accountHolder || 'Faran ahmed'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(BANK_DETAILS.accountHolder || 'Faran ahmed', 'accountHolder')}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 font-bold text-xs"
                  title="Copy Account Holder Name"
                >
                  {copiedField === 'accountHolder' ? (
                    <span className="text-xs font-bold text-slate-950 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* IBAN */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-200/80 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">IBAN</span>
                  <span className="font-mono font-bold text-slate-950 text-sm sm:text-base tracking-wider break-all select-all">
                    {BANK_DETAILS.iban}
                  </span>
                  <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                    Only for EUR Transfers
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(BANK_DETAILS.iban, 'iban')}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 mt-1"
                  title="Copy IBAN"
                >
                  {copiedField === 'iban' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* BIC/SWIFT code */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">BIC/SWIFT code</span>
                  <span className="font-mono font-bold text-slate-950 text-sm sm:text-base tracking-wider select-all">
                    {BANK_DETAILS.bicSwift}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(BANK_DETAILS.bicSwift, 'bicSwift')}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Copy BIC/SWIFT code"
                >
                  {copiedField === 'bicSwift' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Account number */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Account number</span>
                  <span className="font-mono font-bold text-slate-950 text-sm sm:text-base tracking-wider select-all">
                    {BANK_DETAILS.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(BANK_DETAILS.accountNumber, 'accountNumber')}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Copy account number"
                >
                  {copiedField === 'accountNumber' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Sort code */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sort code</span>
                  <span className="font-mono font-bold text-slate-950 text-sm sm:text-base tracking-wider select-all">
                    {BANK_DETAILS.sortCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(BANK_DETAILS.sortCode, 'sortCode')}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Copy sort code"
                >
                  {copiedField === 'sortCode' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Bank (Based in GB) */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bank (Based in GB)</span>
                  <span className="font-bold text-slate-950 text-sm sm:text-base">
                    {BANK_DETAILS.bankName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(BANK_DETAILS.bankName, 'bankName')}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Copy bank name"
                >
                  {copiedField === 'bankName' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Bank address */}
              <div className="flex items-start justify-between pb-1 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bank address</span>
                  <span className="font-semibold text-slate-900 text-xs sm:text-sm leading-relaxed block max-w-xs">
                    {BANK_DETAILS.bankAddress}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(BANK_DETAILS.bankAddress, 'bankAddress')}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 mt-1"
                  title="Copy bank address"
                >
                  {copiedField === 'bankAddress' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* SCREENSHOT UPLOAD SECTION */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 sm:p-5 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Upload Payment Screenshot (SS)</span>
                <span className="text-rose-600 text-[10px] font-black">* Required</span>
              </label>

              {/* Explicit Account Holder Reminder in Screenshot Section */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/80 border border-amber-300/90 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block font-mono">
                    Official Account Holder (Empfänger)
                  </span>
                  <span className="font-black text-slate-950 text-base tracking-wide select-all block mt-0.5">
                    Faran ahmed
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5 font-medium">
                    Clear Bank EUR • IBAN: <span className="font-mono font-bold text-slate-900">GB06CLRB04281222476203</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText('Faran ahmed', 'accountHolderSS')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                  title="Copy Account Holder Name"
                >
                  {copiedField === 'accountHolderSS' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Name</span>
                    </>
                  )}
                </button>
              </div>

              {!screenshot ? (
                <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white p-5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Click to upload payment screenshot (SS)</span>
                    <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">Verify transfer sent to Faran ahmed</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Supports PNG, JPG, JPEG, WEBP</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={screenshot} alt="Screenshot proof" className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{screenshotName || 'Payment_Screenshot.png'}</p>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Image attached
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshot(null);
                      setScreenshotName('');
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Complete Order Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 ${
                  isSubmitting ? 'bg-slate-700 cursor-not-allowed' : 'bg-slate-900 hover:bg-amber-500 hover:text-slate-950 cursor-pointer'
                } text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying Screenshot & Placing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                    <span>Submit Screenshot & Complete Order ({totalAmountInRegion})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
