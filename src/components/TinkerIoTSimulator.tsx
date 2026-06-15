import { Radio, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';

interface TinkerIoTSimulatorProps {
  onSimulateRemove: () => void;
  onSimulatePlace: () => void;
  agt567Status: string;
}

export default function TinkerIoTSimulator({ onSimulateRemove, onSimulatePlace, agt567Status }: TinkerIoTSimulatorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-900 border-b border-gray-700 flex items-center gap-2">
        <Radio className="w-4 h-4 text-emerald-400" />
        <h4 className="text-xs font-bold text-white tracking-wide">TinkerIoT Sensor Simulator</h4>
      </div>

      {/* Status indicator */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">AGT567 Status</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              agt567Status === 'AVAILABLE'
                ? 'bg-emerald-50 text-emerald-700'
                : agt567Status === 'PENDING PICKUP'
                ? 'bg-orange-50 text-orange-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {agt567Status}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 space-y-2">
        <button
          onClick={onSimulateRemove}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
        >
          <ArrowUpFromLine className="w-4 h-4" />
          <span className="text-left">Simulate Weight Removed (Locker Empty)</span>
        </button>
        <button
          onClick={onSimulatePlace}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span className="text-left">Simulate Weight Placed (Locker Loaded)</span>
        </button>
      </div>
    </div>
  );
}
