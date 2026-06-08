import { useState, useMemo } from 'react';
import { useAppState, type OscilloscopeRow } from '../context';
import { 
  Boxes, 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  Search,
  ClipboardList
} from 'lucide-react';

interface InventoryManagementProps {
  userRole: string;
  currentUserEmail: string;
}

export default function InventoryManagement({ userRole, currentUserEmail }: InventoryManagementProps) {
  // Pull core arrays safely out of your existing shared state engine
  const { componentInventory, equipmentRows, applicationQueue } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track which parent equipment models are expanded to show their unique serial sub-ledgers
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({
    'Digital Oscilloscope': true, 
    'Regulated DC Power Supply': true,
    'RF Spectrum Analyzer': true
  });

  const toggleModelExpand = (modelName: string) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelName]: !prev[modelName]
    }));
  };

  // 1. DYNAMIC STATE TRANSLATOR: 
  // Intercepts the queue and maps out who is currently holding or waiting on which auto-routed asset numbers
  const liveAssetAssignments = useMemo(() => {
    const registry: Record<string, { status: string; borrower: any }> = {};

    (applicationQueue || []).forEach((app) => {
      if (!app.equipmentCode) return;

      // Map Stage 1 and Stage 2 queue item locks to the active view rows
      if (app.stage === 'PENDING') {
        registry[app.equipmentCode] = {
          status: 'PENDING PICKUP',
          borrower: app.formData
        };
      } else if (app.stage === 'ACTIVE_BORROW') {
        registry[app.equipmentCode] = {
          status: app.isReturned ? 'RETURN_PENDING' : 'BORROWED',
          borrower: app.formData
        };
      }
    });

    return registry;
  }, [applicationQueue]);

  // Helper styling functions for unique asset statuses
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            In Stock / Available
          </span>
        );
      case 'BORROWED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold bg-rose-50 text-rose-700 rounded-full border border-rose-200 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            In Student Possession
          </span>
        );
      case 'PENDING PICKUP':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Awaiting Gatekeeper Handout
          </span>
        );
      case 'RETURN_PENDING':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Return Reviewing Queue
          </span>
        );
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
    }
  };

  // Filter models based on search query string text matches
  const filteredInventory = useMemo(() => {
    return (componentInventory || []).filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [componentInventory, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn text-xs">
      {/* Upper Status Title Banner Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-utm-maroon" />
            Master Inventory Management
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Faculty of Electrical Engineering — Aggregated Stock Analytics & Individual Physical Asset Tracking Ledger.
          </p>
        </div>
        
        {/* Search Bar Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search equipment type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-utm-maroon focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* PARENT TABLE: Aggregated Equipment Stock Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Layers className="w-4 h-4 text-utm-gold" />
            <h3 className="font-bold text-xs tracking-wide">General Equipment Categories Summary Spreadsheet</h3>
          </div>
          <span className="bg-slate-800 text-utm-gold text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
            SYSTEM AUDIT TIME: {new Date().toISOString().split('T')[0]}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-5 w-12 text-center">View Units</th>
                <th className="py-2.5 px-5">Equipment Model Type</th>
                <th className="py-2.5 px-5 text-center">Total Registered Stock</th>
                <th className="py-2.5 px-5 text-center text-rose-700 bg-rose-50/40">Units In Possession</th>
                <th className="py-2.5 px-5 text-center text-amber-700 bg-amber-50/40">Pending Verification</th>
                <th className="py-2.5 px-5 text-center text-emerald-700 bg-emerald-50/40">Net Available On Shelf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
              {filteredInventory.map((item) => {
                const isExpanded = !!expandedModels[item.name];
                
                // Categorize counts live depending on prefix classes
                let itemPrefix = item.name === 'Digital Oscilloscope' ? 'AGT' : item.name.includes('Power') ? 'MXW' : 'RFE';
                
                const activeForThisCategory = (applicationQueue || []).filter(app => {
                  let appPrefix = app.equipmentCode?.startsWith('AGT') ? 'AGT' : app.equipmentCode?.startsWith('MXW') ? 'MXW' : 'RFE';
                  return appPrefix === itemPrefix;
                });

                const unitsOut = activeForThisCategory.filter(a => a.stage === 'ACTIVE_BORROW' && !a.isReturned).length;
                const pendingUnits = activeForThisCategory.filter(a => a.stage === 'PENDING' || (a.stage === 'ACTIVE_BORROW' && a.isReturned)).length;
                const onShelfStock = Math.max(0, item.totalUnits - (unitsOut + pendingUnits));

                return (
                  <tr key={item.name} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-5 text-center">
                      <button 
                        onClick={() => toggleModelExpand(item.name)}
                        className="p-1 rounded text-gray-400 hover:text-utm-maroon hover:bg-gray-100 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="py-3 px-5 font-bold text-gray-900">{item.name}</td>
                    <td className="py-3 px-5 text-center font-mono">{item.totalUnits} items</td>
                    <td className="py-3 px-5 text-center font-mono text-rose-700 bg-rose-50/20 font-bold">{unitsOut} x</td>
                    <td className="py-3 px-5 text-center font-mono text-amber-700 bg-amber-50/20">{pendingUnits} x</td>
                    <td className="py-3 px-5 text-center bg-emerald-50/20">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">
                        {onShelfStock} / {item.totalUnits} Available
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHILD SUB-TABLES: Segmented Absolute Item Unit Ledgers */}
      {filteredInventory.map((item) => {
        const isExpanded = !!expandedModels[item.name];
        if (!isExpanded) return null;

        // Generate full asset index rows matching your equipment family codes dynamically (1 to 4 or up to total capacity)
        let prefix = item.name === 'Digital Oscilloscope' ? 'AGT' : item.name.includes('Power') ? 'MXW' : 'RFE';
        
        const relevantUnits = Array.from({ length: 4 }).map((_, idx) => {
          const serialNum = idx + 1;
          const entryCode = prefix === 'AGT' ? `${prefix}${566 + serialNum}` : `${prefix}-${String(serialNum).padStart(2, '0')}`;
          
          // Pull status updates directly from our shared transactional assignment loop mapping
          const activeTransaction = liveAssetAssignments[entryCode];
          
          return {
            code: entryCode,
            labLocation: prefix === 'AGT' ? 'Electrical Lab 1' : prefix === 'MXW' ? 'Instrumentation Lab' : 'RF Communication Lab',
            lastDateUsed: '2026-06-01',
            status: activeTransaction ? activeTransaction.status : 'AVAILABLE',
            borrower: activeTransaction ? activeTransaction.borrower : null
          };
        });

        return (
          <div key={`${item.name}-child`} className="bg-white rounded-xl border border-gray-200 overflow-hidden border-l-4 border-l-utm-maroon animate-fadeIn">
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-utm-maroon" />
                <h4 className="text-[11px] font-bold text-gray-800">
                  Granular Traceability Assets Under: <span className="text-utm-maroon">{item.name}</span>
                </h4>
              </div>
              <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">
                {relevantUnits.length} Tracked Core Serials
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100/50 border-b border-gray-200 text-gray-500 uppercase text-[9px] font-bold tracking-wider">
                    <th className="py-2 px-5">Hardware Item Code</th>
                    <th className="py-2 px-5">Assigned Laboratory Base</th>
                    <th className="py-2 px-5 text-center">Last Calibration / Audit</th>
                    <th className="py-2 px-5 text-center">Absolute Lifespan Status</th>
                    <th className="py-2 px-5">Active Borrower Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {relevantUnits.map((row) => (
                    <tr key={row.code} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-2.5 px-5 font-mono font-bold text-utm-maroon text-[13px]">{row.code}</td>
                      <td className="py-2.5 px-5 font-bold text-gray-700">{row.labLocation}</td>
                      <td className="py-2.5 px-5 text-center font-mono text-gray-400">{row.lastDateUsed}</td>
                      <td className="py-2.5 px-5 text-center">{getStatusBadge(row.status)}</td>
                      <td className="py-2.5 px-5">
                        {row.borrower ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-[10px] uppercase">{row.borrower.fullName}</span>
                            <span className="text-gray-400 font-mono text-[9px]">{row.borrower.emailAddress} &bull; {row.borrower.yearCourse}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No Active Borrow Records</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}