import { FlaskConical, ChevronRight } from 'lucide-react';

export interface Lab {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'maintenance' | 'inactive';
  equipmentCount: number;
}

export const labs: Lab[] = [
  { id: 'basic-applied-control', name: 'Basic & Applied Control', icon: 'Sliders', status: 'active', equipmentCount: 12 },
  { id: 'advanced-electronics', name: 'Advanced Electronics', icon: 'Cpu', status: 'active', equipmentCount: 6 },
  { id: 'basic-electronic', name: 'Basic Electronic', icon: 'CircuitBoard', status: 'active', equipmentCount: 18 },
  { id: 'micro-electronic', name: 'Micro-electronic', icon: 'Chip', status: 'active', equipmentCount: 9 },
  { id: 'digital-electronics', name: 'Digital Electronics', icon: 'Binary', status: 'maintenance', equipmentCount: 14 },
  { id: 'advanced-power', name: 'Advanced Power', icon: 'Zap', status: 'active', equipmentCount: 8 },
  { id: 'basic-machine', name: 'Basic Machine', icon: 'Cog', status: 'active', equipmentCount: 11 },
];

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
  inactive: 'bg-gray-50 text-gray-500 border-gray-200',
};

interface LaboratoryListProps {
  onLabClick: (labId: string) => void;
}

export default function LaboratoryList({ onLabClick }: LaboratoryListProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-utm-maroon/10 flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-utm-maroon" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Faculty Laboratories</h3>
          <p className="text-xs text-gray-500">{labs.length} laboratories registered</p>
        </div>
      </div>

      {/* Lab Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {labs.map((lab) => (
          <button
            key={lab.id}
            onClick={() => onLabClick(lab.id)}
            className="group bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-lg hover:border-utm-maroon/30 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-lg bg-utm-maroon/5 group-hover:bg-utm-maroon/10 flex items-center justify-center transition-colors">
                <FlaskConical className="w-5 h-5 text-utm-maroon" />
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[lab.status]}`}
              >
                {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-utm-maroon transition-colors">
              {lab.name}
            </h3>
            <p className="text-xs text-gray-400 mb-4">{lab.equipmentCount} equipment items</p>

            <div className="flex items-center gap-1 text-xs font-medium text-utm-maroon opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
