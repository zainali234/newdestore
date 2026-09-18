import React, { useState, useMemo } from 'react';
import { 
  Plane, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Package, 
  Building2, 
  Search, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink, 
  AlertCircle,
  Calendar,
  Compass,
  FileText,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Box
} from 'lucide-react';
import { CheckoutDetails, Currency } from '../types';
import { formatPrice } from '../currency';

interface OrderTrackingProps {
  orderDetails?: CheckoutDetails | null;
  currency: Currency;
  onBackToShop: () => void;
  onContactSupport?: () => void;
}

export default function OrderTracking({
  orderDetails,
  currency,
  onBackToShop,
  onContactSupport
}: OrderTrackingProps) {
  // Search query for tracking
  const [searchCode, setSearchCode] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [activeDayView, setActiveDayView] = useState<number>(2); // Default to Day 2 in transit
  const [isSimulatingLive, setIsSimulatingLive] = useState(false);

  // Derive order details or fallback to default sample UK order
  const activeOrder: CheckoutDetails = useMemo(() => {
    if (orderDetails && (orderDetails.orderId || orderDetails.fullName)) {
      return {
        ...orderDetails,
        orderId: orderDetails.orderId || '114-849-204',
        trackingNumber: orderDetails.trackingNumber || 'US-DE-8492019',
        orderDate: orderDetails.orderDate || new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        country: 'Germany',
      };
    }

    // Default sample USA to Germany transit order
    return {
      orderId: '114-729-381',
      trackingNumber: 'US-DE-9182341',
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      fullName: 'Lukas Weber',
      email: 'lukas.weber@example.de',
      phone: '+49 30 12345678',
      addressLine1: 'Friedrichstraße 43',
      addressLine2: 'Apt 4B',
      city: 'Berlin',
      state: 'Berlin',
      postalCode: '10117',
      country: 'Germany',
      currency: 'EUR',
      totalPaidFormatted: '€189.50',
      bankRegion: 'DE',
      items: [],
    };
  }, [orderDetails]);

  // Calculate delivery dates (Order date + 10 Days)
  const orderDateObj = useMemo(() => {
    try {
      return new Date(activeOrder.orderDate || Date.now());
    } catch {
      return new Date();
    }
  }, [activeOrder.orderDate]);

  const deliveryDateObj = useMemo(() => {
    const d = new Date(orderDateObj);
    d.setDate(d.getDate() + 10);
    return d;
  }, [orderDateObj]);

  const formatDate = (date: Date, addDays: number = 0) => {
    const target = new Date(date);
    target.setDate(target.getDate() + addDays);
    return target.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Copy tracking ID
  const handleCopyTracking = () => {
    if (activeOrder.trackingNumber) {
      navigator.clipboard.writeText(activeOrder.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  // 10-Day Step Journey from USA to Germany
  const journeyMilestones = useMemo(() => [
    {
      day: 1,
      stageNumber: 1,
      dateFormatted: formatDate(orderDateObj, 0),
      time: '09:30 AM EST',
      title: 'Order Verified & Warehouse Queue',
      location: 'USA Fulfillment Hub, Edison, New Jersey, USA',
      carrier: 'MzAmazonSeller USA Logistics',
      description: 'Customer payment approved and international dispatch order generated. Products allocated from US warehouse stock for Germany transatlantic forwarding.',
      icon: CheckCircle2,
      country: 'USA',
      flag: '🇺🇸',
      status: activeDayView >= 1 ? 'completed' : 'pending',
    },
    {
      day: 2,
      stageNumber: 2,
      dateFormatted: formatDate(orderDateObj, 1),
      time: '02:15 PM EST',
      title: 'Quality Check & Export Shockproof Packaging',
      location: 'New Jersey Export Center, USA',
      carrier: 'MzAmazonSeller Export Operations',
      description: 'Items passed 10-point electronic and physical inspection. Packed in heavy-duty weatherproof shockproof packaging with EU/German customs declaration barcodes.',
      icon: Package,
      country: 'USA',
      flag: '🇺🇸',
      status: activeDayView >= 2 ? (activeDayView === 2 ? 'current' : 'completed') : 'pending',
    },
    {
      day: 3,
      stageNumber: 3,
      dateFormatted: formatDate(orderDateObj, 2),
      time: '11:00 AM EST',
      title: 'Cleared US Export Customs (CBP)',
      location: 'JFK Cargo Logistics Port, New York, USA',
      carrier: 'US Customs & Border Protection',
      description: 'Export declaration cleared. Consignment transferred to secure bonded holding area for air cargo palletizing.',
      icon: ShieldCheck,
      country: 'USA',
      flag: '🇺🇸',
      status: activeDayView >= 3 ? (activeDayView === 3 ? 'current' : 'completed') : 'pending',
    },
    {
      day: 4,
      stageNumber: 4,
      dateFormatted: formatDate(orderDateObj, 3),
      time: '06:45 PM EST',
      title: 'Tendered to Transatlantic Air Cargo',
      location: 'John F. Kennedy International Airport (JFK), New York',
      carrier: 'Transatlantic Air Cargo Express (Flight MZ-702)',
      description: 'Pallet loaded into Boeing 777-F cargo aircraft container. Air Waybill (AWB #849-0192) issued for flight to Frankfurt Airport (FRA).',
      icon: Plane,
      country: 'USA',
      flag: '🇺🇸',
      status: activeDayView >= 4 ? (activeDayView === 4 ? 'current' : 'completed') : 'pending',
    },
    {
      day: 5,
      stageNumber: 5,
      dateFormatted: formatDate(orderDateObj, 4),
      time: '04:20 AM CET',
      title: 'In Flight — Atlantic Air Crossing',
      location: 'Mid-Atlantic Flight Corridor (JFK ➔ FRA)',
      carrier: 'Transatlantic Air Cargo Express',
      description: 'Direct nonstop international cargo flight in transit over the Atlantic Ocean heading toward German airspace.',
      icon: Compass,
      country: 'International Airspace',
      flag: '✈️',
      status: activeDayView >= 5 ? (activeDayView === 5 ? 'current' : 'completed') : 'pending',
    },
    {
      day: 6,
      stageNumber: 6,
      dateFormatted: formatDate(orderDateObj, 5),
      time: '08:30 AM CET',
      title: 'Landed at Frankfurt Airport (FRA) CargoCity',
      location: 'Frankfurt Airport CargoCity South, Frankfurt am Main, Germany',
      carrier: 'FRA Inward Cargo Operations',
      description: 'Flight touched down safely at Frankfurt Airport. Consignment transferred from tarmac to German Border Cargo Receiving Terminal.',
      icon: Building2,
      country: 'Germany',
      flag: '🇩🇪',
      status: activeDayView >= 6 ? (activeDayView === 6 ? 'current' : 'completed') : 'pending',
    },
    {
      day: 7,
      stageNumber: 7,
      dateFormatted: formatDate(orderDateObj, 6),
      time: '01:10 PM CET',
      title: 'German Customs Clearance Approved (Zollamt)',
      location: 'Zollamt Frankfurt Flughafen, Germany',
      carrier: 'German Customs (Bundeszollverwaltung)',
      description: 'Full German customs import clearance approved with zero import tax or duty due from the buyer (pre-paid by seller). Package released for domestic delivery.',
      icon: ShieldCheck,
      country: 'Germany',
      flag: '🇩🇪',
      status: activeDayView >= 7 ? (activeDayView === 7 ? 'current' : 'completed') : 'pending',
    },
    {
      day: 8,
      stageNumber: 8,
      dateFormatted: formatDate(orderDateObj, 7),
      time: '07:45 PM CET',
      title: 'Handed to DHL Express / Deutsche Post Germany',
      location: 'DHL Paketzentrum / HUB Niederaula, Germany',
      carrier: 'DHL Paket Express / Deutsche Post',
      description: 'Package inducted into DHL Germany priority sorting network. German domestic parcel barcode generated and assigned to regional routing.',
      icon: Truck,
      country: 'Germany',
      flag: '🇩🇪',
      status: activeDayView >= 8 ? (activeDayView === 8 ? 'current' : 'completed') : 'pending',
    },
    {
      day: 9,
      stageNumber: 9,
      dateFormatted: formatDate(orderDateObj, 8),
      time: '05:15 AM CET',
      title: 'Arrived at Regional German Zustellbasis',
      location: `DHL Zustellbasis, Near ${activeOrder.city || 'Berlin'} (${activeOrder.postalCode || '10117'}, Germany)`,
      carrier: 'DHL Regional Zustellungsdienst',
      description: 'Package arrived at buyer’s nearest German delivery depot. Sorted into local neighborhood delivery route for morning courier dispatch.',
      icon: MapPin,
      country: 'Germany',
      flag: '🇩🇪',
      status: activeDayView >= 9 ? (activeDayView === 9 ? 'current' : 'completed') : 'pending',
    },
    {
      day: 10,
      stageNumber: 10,
      dateFormatted: formatDate(orderDateObj, 9),
      time: '08:45 AM CET',
      title: 'Out for Delivery to German Address',
      location: `${activeOrder.addressLine1 || 'Customer Address'}, ${activeOrder.city || 'Berlin'} ${activeOrder.postalCode || ''}, Germany`,
      carrier: 'DHL Delivery Vehicle / Zusteller',
      description: 'Package is with the local DHL courier driver on the delivery vehicle. Arriving at the buyer’s German address today with delivery confirmation.',
      icon: CheckCircle2,
      country: 'Germany',
      flag: '🇩🇪',
      status: activeDayView >= 10 ? 'completed' : 'pending',
    },
  ], [orderDateObj, activeDayView, activeOrder]);

  const currentMilestone = journeyMilestones[Math.min(activeDayView - 1, 9)];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-8 animate-fade-in">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="cursor-pointer hover:text-amber-400 transition-colors" onClick={onBackToShop}>Store</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-amber-400 font-bold">Transatlantic 10-Day Tracking</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                LIVE DISPATCH FEED
              </span>
            </div>
          </div>

          {/* Main Title & Route Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇺🇸</span>
                <span className="text-slate-400 font-mono text-sm font-semibold">USA Central Hub</span>
                <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-2xl">🇩🇪</span>
                <span className="text-amber-400 font-mono text-sm font-bold">Germany Destination Address</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Transatlantic 10-Day Expedited Delivery (USA ➔ Germany)
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Your order is dispatched directly from our USA Central Logistics Center to your German address. Complete 10-day guaranteed door-to-door transit with German customs clearance (Zoll) pre-approved.
              </p>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Estimated Delivery:</span>
                <span className="font-bold text-amber-400 font-mono">{formatDate(deliveryDateObj)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Delivery Window:</span>
                <span className="font-bold text-emerald-400 font-mono">10 Calendar Days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Current Status:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[11px] font-mono">
                  Day {activeDayView} of 10
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">German Import Customs:</span>
                <span className="text-emerald-400 font-bold text-[11px]">Paid by Seller (0% Fee / Free)</span>
              </div>
            </div>
          </div>

          {/* Tracking Number Bar */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Tracking Reference:</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-700/80 rounded-lg font-mono font-black text-amber-400 text-sm tracking-wider flex items-center gap-2">
                {activeOrder.trackingNumber}
              </span>
              <button
                onClick={handleCopyTracking}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy tracking number"
              >
                {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTracking ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>Order ID: <strong className="text-slate-200">{activeOrder.orderId}</strong></span>
              <span className="text-slate-600">|</span>
              <span>Carrier: <strong className="text-slate-200">Transatlantic Air Cargo ➔ DHL / Deutsche Post</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 10-Day Visual Journey Tracker */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Plane className="w-5 h-5 text-amber-500" />
              Transatlantic Route Map: USA to Germany (10 Days)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Trace each step of your product from the US logistics fulfillment center to your German address.
            </p>
          </div>

          {/* Interactive Day Inspector Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">Preview Transit Day:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDayView(d)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeDayView === d
                      ? 'bg-amber-500 text-slate-950 shadow-sm scale-105'
                      : activeDayView > d
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                  title={`View Day ${d} Transit Status`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Progress Map Bar */}
        <div className="relative py-4">
          {/* Progress track line */}
          <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-2 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${((activeDayView - 1) / 9) * 100}%` }}
            ></div>
          </div>

          {/* 5 Primary Transit Milestones */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
            
            {/* Step 1: USA Warehouse (Day 1-2) */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              activeDayView >= 2 
                ? 'bg-amber-50/70 border-amber-300 text-slate-900 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                🇺🇸
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 block">Days 1 - 2</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">USA Warehouse</h4>
              <p className="text-[10px] text-slate-500 mt-1">Edison, NJ (USA) Packed & Inspected</p>
            </div>

            {/* Step 2: US Export Customs (Day 3-4) */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              activeDayView >= 4 
                ? 'bg-amber-50/70 border-amber-300 text-slate-900 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                🛫
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Days 3 - 4</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">JFK Air Export</h4>
              <p className="text-[10px] text-slate-500 mt-1">US Customs Cleared & Loaded</p>
            </div>

            {/* Step 3: Atlantic Air Transit (Day 5) */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              activeDayView >= 5 
                ? 'bg-blue-50 border-blue-300 text-slate-900 shadow-xs ring-2 ring-blue-500/20' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                ✈️
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 block">Day 5</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">Atlantic Crossing</h4>
              <p className="text-[10px] text-slate-500 mt-1">Nonstop Flight JFK ➔ FRA</p>
            </div>

            {/* Step 4: German Customs & Frankfurt (Day 6-7) */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              activeDayView >= 7 
                ? 'bg-emerald-50/80 border-emerald-300 text-slate-900 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                🇩🇪
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">Days 6 - 7</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">Frankfurt FRA Hub</h4>
              <p className="text-[10px] text-slate-500 mt-1">German Customs (Zoll) Cleared</p>
            </div>

            {/* Step 5: DHL Express to German Address (Day 8-10) */}
            <div className={`col-span-2 sm:col-span-1 p-4 rounded-2xl border text-center transition-all ${
              activeDayView >= 10 
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-md ring-2 ring-emerald-500/30' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-2 shadow-xs">
                🏡
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">Days 8 - 10</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">German Address</h4>
              <p className="text-[10px] text-slate-500 mt-1">DHL Direct Doorstep Delivery</p>
            </div>

          </div>
        </div>

        {/* Current Active Status Spotlight Banner */}
        <div className="bg-slate-950 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-inner">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                STAGE {currentMilestone.stageNumber} OF 10
              </span>
              <span className="text-xs text-slate-400 font-mono">{currentMilestone.dateFormatted} • {currentMilestone.time}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{currentMilestone.flag}</span>
              <span>{currentMilestone.title}</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              {currentMilestone.description}
            </p>
          </div>

          <div className="shrink-0 bg-slate-900 border border-slate-800 rounded-xl p-3 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Location</span>
            <span className="text-xs font-bold text-amber-400 block max-w-[200px] truncate">{currentMilestone.location}</span>
            <span className="text-[11px] text-slate-400 block font-mono">{currentMilestone.carrier}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Detailed 10-Day Milestones Log & Customer Order Specifics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Full Day-by-Day Milestone Log */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              10-Day Daily Dispatch Log (USA ➔ Germany)
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Total 10 Day Transit
            </span>
          </div>

          <div className="space-y-4">
            {journeyMilestones.map((m) => {
              const isPastOrCurrent = activeDayView >= m.day;
              const isCurrent = activeDayView === m.day;

              return (
                <div 
                  key={m.day}
                  onClick={() => setActiveDayView(m.day)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isCurrent 
                      ? 'bg-amber-50/90 border-amber-400 shadow-sm ring-1 ring-amber-400' 
                      : isPastOrCurrent 
                      ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/80' 
                      : 'bg-white border-slate-100 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Day Badge */}
                  <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 font-mono font-black ${
                    isCurrent 
                      ? 'bg-amber-500 text-slate-950 shadow-xs' 
                      : isPastOrCurrent 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    <span className="text-[9px] uppercase tracking-tighter leading-none">DAY</span>
                    <span className="text-sm leading-none mt-0.5">{m.day}</span>
                  </div>

                  {/* Log Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{m.flag}</span>
                        <span>{m.title}</span>
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">{m.dateFormatted}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        {m.location}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 font-semibold">{m.carrier}</span>
                    </div>

                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: UK Destination Details & Package Info */}
        <div className="space-y-6">
          
          {/* Destination Details Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              Germany Delivery Coordinates
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Buyer Recipient</span>
                <span className="font-bold text-slate-900 block mt-0.5">{activeOrder.fullName}</span>
                <span className="text-slate-500 text-xs block font-mono">{activeOrder.phone}</span>
                <span className="text-slate-500 text-xs block font-mono">{activeOrder.email}</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Delivery Address (Germany)</span>
                <span className="text-slate-800 font-medium block mt-0.5 leading-relaxed">
                  {activeOrder.addressLine1}
                  {activeOrder.addressLine2 ? `, ${activeOrder.addressLine2}` : ''}
                </span>
                <span className="text-slate-800 font-bold block">
                  {activeOrder.city}, {activeOrder.state} {activeOrder.postalCode}
                </span>
                <span className="text-amber-700 font-bold text-xs inline-flex items-center gap-1 mt-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  🇩🇪 Germany Delivery (Deutschland)
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Service Level:</span>
                <span className="font-bold text-slate-900">Transatlantic Express 10D</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">German Domestic Carrier:</span>
                <span className="font-bold text-slate-900">DHL Express / Deutsche Post</span>
              </div>

              {activeOrder.totalPaidFormatted && (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Order Amount Paid:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {activeOrder.totalPaidFormatted}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Search Another Order */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-500" />
              Track Another Order
            </h4>
            <p className="text-xs text-slate-500">
              Enter your MzAmazonSeller Order ID (e.g. 114-xxx) or Tracking Number:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="e.g. US-DE-8492019"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
              <button
                onClick={() => {
                  if (searchCode.trim()) {
                    alert(`Tracking record synchronized for: ${searchCode.trim()}`);
                  }
                }}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Track
              </button>
            </div>
          </div>

          {/* Help & Actions */}
          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Transatlantic Guarantee</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every shipment from USA to Germany is fully insured against damage or loss with signature delivery verification at your doorstep.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={onBackToShop}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Continue Shopping
              </button>
              {onContactSupport && (
                <button
                  onClick={onContactSupport}
                  className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Contact Delivery Support
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
