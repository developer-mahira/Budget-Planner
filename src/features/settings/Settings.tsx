import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  DollarSign, 
  Bell, 
  Shield, 
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [profile, setProfile] = useState({
    name: 'Mahira Noor',
    email: 'mahiranoor.088@gmail.com',
    monthlyIncome: '4000',
    budgetGoal: '20',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'categories', label: 'Categories', icon: Shield },
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ];

  const handleProfileUpdate = () => {
    // In a real app, this would update the user profile
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and app settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <Card className="sticky top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'bg-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card title="Profile Settings">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                  <Input
                    label="Monthly Income"
                    type="number"
                    value={profile.monthlyIncome}
                    onChange={(e) => setProfile({ ...profile, monthlyIncome: e.target.value })}
                    icon={<span className="text-gray-500">$</span>}
                  />
                  <Input
                    label="Savings Goal (%)"
                    type="number"
                    value={profile.budgetGoal}
                    onChange={(e) => setProfile({ ...profile, budgetGoal: e.target.value })}
                    icon={<span className="text-gray-500">%</span>}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card title="Appearance">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {darkMode ? (
                        <Moon className="w-5 h-5 text-gray-700" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-gray-500">
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Accent Color</h4>
                  <div className="flex gap-3">
                    {['#2196F3', '#4CAF50', '#FF5722', '#9C27B0', '#FF9800'].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-full border-2 border-transparent hover:border-gray-300 transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={() => console.log('Selected color:', color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'currency' && (
            <Card title="Currency Settings">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Select Currency</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                        className={`
                          p-4 border rounded-lg text-left transition-all
                          ${currency === curr.code
                            ? 'border-accent bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold">{curr.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{curr.name}</p>
                            <p className="text-sm text-gray-500">{curr.code}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Current Currency: {currency}</p>
                      <p className="text-sm text-gray-500">
                        All amounts will be displayed in {currency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card title="Notification Preferences">
              <div className="space-y-4">
                {[
                  { label: 'Budget Alerts', description: 'Notify when budget reaches 80%' },
                  { label: 'Bill Reminders', description: 'Get reminded about upcoming bills' },
                  { label: 'Savings Goals', description: 'Updates on savings progress' },
                  { label: 'Weekly Reports', description: 'Receive weekly spending reports' },
                  { label: 'Security Alerts', description: 'Important security notifications' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'categories' && (
            <Card title="Category Management">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Add new category" className="flex-1" />
                  <Button>Add Category</Button>
                </div>
                <div className="space-y-2">
                  {['Food & Dining', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Shopping'].map((category) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{category}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;