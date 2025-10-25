import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { userService, UserProfile, NewUserProfile } from './lib/supabase';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserProfileView from './components/UserProfile';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import { UserPlus } from 'lucide-react';

type View = 'list' | 'add';

function AppContent() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('list');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: NewUserProfile) => {
    try {
      await userService.createUser(userData);
      await loadUsers();
      setActiveView('list');
    } catch (err) {
      setError('Failed to create user');
      console.error(err);
      throw err;
    }
  };

  const handleUpdateUser = async (userData: NewUserProfile) => {
    if (!editingUser) return;

    try {
      await userService.updateUser(editingUser.id, userData);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
      throw err;
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await userService.deleteUser(deletingUser.id);
      await loadUsers();
      setDeletingUser(null);
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="flex-1 p-6 lg:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {activeView === 'list' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Users</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage and view all user profiles
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('add')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/30 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Add User
                </button>
              </div>

              <UserList
                users={users}
                loading={loading}
                onEdit={setEditingUser}
                onDelete={setDeletingUser}
                onView={setViewingUser}
              />
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New User</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Create a new user profile with detailed information
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <UserForm
                  onSubmit={handleCreateUser}
                  onCancel={() => setActiveView('list')}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User Profile"
        size="xl"
      >
        {editingUser && (
          <UserForm
            user={editingUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setEditingUser(null)}
          />
        )}
      </Modal>

      {viewingUser && (
        <UserProfileView
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
