import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Save } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    theme: 'light',
    language: 'en'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    console.log('Settings saved:', formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  disabled
                  value={user?.name}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  disabled
                  value={user?.email}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="emailNotif"
                  checked={formData.notifications.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      email: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="emailNotif" className="text-sm text-gray-700">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pushNotif"
                  checked={formData.notifications.push}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      push: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="pushNotif" className="text-sm text-gray-700">
                  Push Notifications
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="smsNotif"
                  checked={formData.notifications.sms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      sms: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="smsNotif" className="text-sm text-gray-700">
                  SMS Notifications
                </label>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                <select
                  value={formData.theme}
                  onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}