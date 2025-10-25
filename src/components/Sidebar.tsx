import { Users, UserPlus, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  activeView: 'list' | 'add';
  onViewChange: (view: 'list' | 'add') => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'list' as const, label: 'All Users', icon: Users },
    { id: 'add' as const, label: 'Add User', icon: UserPlus }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors">
      <div className="p-4">
        <div className="flex items-center gap-2 px-3 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Dashboard</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
