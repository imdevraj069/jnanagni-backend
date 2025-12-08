import { Users, Shield, GraduationCap, HeartHandshake } from 'lucide-react';

export default function StatsCards({ users }) {
  // Calculate real-time stats
  const total = users.length;
  const admins = users.filter(u => u.role === 'admin').length;
  const volunteers = users.filter(u => u.role === 'volunteer').length;
  const students = users.filter(u => u.role === 'student').length;

  const cards = [
    { label: 'Total Users', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Volunteers', value: volunteers, icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Students', value: students, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Admins', value: admins, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}