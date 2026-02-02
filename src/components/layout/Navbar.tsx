import React, { useState } from 'react';
import { Bell, Search, LogOut, User, Settings, HelpCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const menuItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: 'Profile',
      onClick: () => {
        navigate('/settings');
        setIsDropdownOpen(false);
      },
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Settings',
      onClick: () => {
        navigate('/settings');
        setIsDropdownOpen(false);
      },
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: 'Help & Support',
      onClick: () => {
        // Add help route if needed
        setIsDropdownOpen(false);
      },
    },
    {
      icon: <LogOut className="w-4 h-4" />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button - Now in navbar */}
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Search - Hidden on very small screens, visible on larger mobile */}
        <div className="hidden sm:flex flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search transactions, budgets..."
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Mobile search icon */}
        <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 sm:gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base flex-shrink-0">
                {user?.avatar || user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User info for mobile */}
                  <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.onClick}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          item.danger
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="w-5 flex justify-center">{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile search bar - appears when needed */}
      <div className="sm:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;