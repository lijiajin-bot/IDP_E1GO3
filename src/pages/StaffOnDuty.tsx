import { UserCheck, Phone, Mail, Clock } from 'lucide-react';

const staff = [
  { id: 1, name: 'Dr. Ahmad Razif bin Hassan', role: 'Lab Coordinator', labs: ['Power Systems Lab', 'High Voltage Lab'], shift: 'Morning', phone: '+60-12-345-6789', email: 'ahmad.razif@utm.my', avatar: 'AR' },
  { id: 2, name: 'Siti Aminah binti Osman', role: 'Lab Technician', labs: ['Electronics Lab'], shift: 'Morning', phone: '+60-13-456-7890', email: 'siti.aminah@utm.my', avatar: 'SA' },
  { id: 3, name: 'Lim Chong Wei', role: 'Lab Assistant', labs: ['Microprocessor Lab', 'Control Systems Lab'], shift: 'Afternoon', phone: '+60-14-567-8901', email: 'lim.chongwei@utm.my', avatar: 'LC' },
  { id: 4, name: 'Nurul Huda binti Abdullah', role: 'Lab Technician', labs: ['Communications Lab'], shift: 'Full Day', phone: '+60-15-678-9012', email: 'nurul.huda@utm.my', avatar: 'NH' },
  { id: 5, name: 'Rajesh a/l Kumar', role: 'Lab Assistant', labs: ['Electronics Lab', 'Power Systems Lab'], shift: 'Evening', phone: '+60-16-789-0123', email: 'rajesh.kumar@utm.my', avatar: 'RK' },
];

const shiftStyles: Record<string, string> = {
  Morning: 'bg-sky-50 text-sky-700 border-sky-200',
  Afternoon: 'bg-utm-gold/10 text-utm-gold-dark border-utm-gold/30',
  Evening: 'bg-gray-50 text-gray-600 border-gray-200',
  'Full Day': 'bg-utm-maroon/5 text-utm-maroon border-utm-maroon/20',
};

export default function StaffOnDuty() {
  const onDuty = staff.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-utm-maroon/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-utm-maroon" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{onDuty}</p>
              <p className="text-xs text-gray-500">Staff On Duty Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-utm-gold/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-utm-gold-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">Active Shifts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-utm-maroon flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {member.avatar}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{member.name}</h3>
                <p className="text-xs text-utm-gold-dark font-medium">{member.role}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-1">
                {member.labs.map((lab) => (
                  <span key={lab} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                    {lab}
                  </span>
                ))}
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block ${shiftStyles[member.shift]}`}
              >
                {member.shift} Shift
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1.5">
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <Phone className="w-3.5 h-3.5" />
                {member.phone}
              </p>
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <Mail className="w-3.5 h-3.5" />
                {member.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
