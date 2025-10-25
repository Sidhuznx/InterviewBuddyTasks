import { useState, useMemo } from 'react';
import { Edit2, Trash2, Eye, Search, ArrowUpDown } from 'lucide-react';
import { UserProfile } from '../lib/supabase';
import Spinner from './Spinner';

interface UserListProps {
  users: UserProfile[];
  loading: boolean;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
  onView: (user: UserProfile) => void;
}

type SortField = 'name' | 'role' | 'email';
type SortOrder = 'asc' | 'desc';

export default function UserList({ users, loading, onEdit, onDelete, onView }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField].toLowerCase();
      const bVal = b[sortField].toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return result;
  }, [users, searchTerm, sortField, sortOrder]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'User':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Moderator':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Sr. No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('role')}
                    className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Role
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(user)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        {filteredAndSortedUsers.map((user, index) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">#{index + 1}</span>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => onView(user)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-all"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => onEdit(user)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-lg transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(user)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No users found</p>
        </div>
      )}
    </div>
  );
}
