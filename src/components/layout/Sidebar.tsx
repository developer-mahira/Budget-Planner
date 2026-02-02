import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  FileText, 
  Calculator, 
  StickyNote, 
  BarChart3,
  Settings,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/budget', icon: DollarSign, label: 'Budget Planner' },
    { path: '/expenses', icon: FileText, label: 'Expenses' },
    { path: '/calculator', icon: Calculator, label: 'Calculator' },
    { path: '/notes', icon: StickyNote, label: 'Notes' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile menu button - Fixed positioning to avoid conflicts */}
      {isMobile && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-primary text-white rounded-lg shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-gray-200 h-screen flex flex-col
        fixed lg:sticky top-0 left-0 z-40
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header with close button on mobile */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">BudgetPro</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Smart Budget Planner</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <nav className="space-y-1 sm:space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Monthly Budget</h3>
                <p className="text-xl sm:text-2xl font-bold text-primary mt-1">$2,450</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Remaining: $850</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;     