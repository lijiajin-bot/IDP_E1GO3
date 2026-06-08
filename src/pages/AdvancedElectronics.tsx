import { ArrowLeft, AlertTriangle, Cpu, Zap } from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'available' | 'in-use' | 'maintenance';
  quantity: number;
}

const equipment: EquipmentItem[] = [
  { id: 'function-generator', name: 'Function Generator', icon: Zap, status: 'available', quantity: 8 },
  { id: 'multimeter', name: 'Multimeter', icon: Cpu, status: 'available', quantity: 15 },
  { id: 'oscilloscope', name: 'Oscilloscope', icon: Cpu, status: 'in-use', quantity: 6 },
  { id: 'soldering-iron', name: 'Soldering Iron', icon: Zap, status: 'available', quantity: 20 },
  { id: 'component-ammeter', name: 'Component Ammeter', icon: Cpu, status: 'available', quantity: 10 },
  { id: 'filter', name: 'Filter', icon: Cpu, status: 'maintenance', quantity: 4 },
];

const statusStyles: Record<string, { bg: string; dot: string; label: string }> = {
  available: { bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', label: 'Available' },
  'in-use': { bg: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500', label: 'In Use' },
  maintenance: { bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', label: 'Maintenance' },
};

interface AdvancedElectronicsProps {
  onBack: () => void;
  onEquipmentClick: (equipmentId: string) => void;
}

export default function AdvancedElectronics({ onBack, onEquipmentClick }: AdvancedElectronicsProps) {
  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Advanced Electronics</h3>
          <p className="text-xs text-gray-500">{equipment.length} equipment items in this laboratory</p>
        </div>
      </div>

      {/* Warning Card */}
      <div className="bg-utm-maroon/5 border-2 border-utm-maroon/20 rounded-xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-lg bg-utm-maroon/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-utm-maroon" />
        </div>
        <p className="text-sm font-bold text-utm-maroon tracking-wide">
          REMINDER: PLEASE MAKE SURE TO CHECK THE CALIBRATION DATE
        </p>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((item) => {
          const Icon = item.icon;
          const status = statusStyles[item.status];
          return (
            <button
              key={item.id}
              onClick={() => onEquipmentClick(item.id)}
              className="group bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-lg hover:border-utm-maroon/30 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-utm-gold/10 group-hover:bg-utm-gold/20 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-utm-gold-dark" />
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-utm-maroon transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
