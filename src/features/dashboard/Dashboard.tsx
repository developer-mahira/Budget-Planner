import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import Card from '../../components/common/Card';
import { INITIAL_BUDGETS, INITIAL_EXPENSES } from '../../utils/constants';

const Dashboard: React.FC = () => {
  // Calculate statistics using useMemo for performance
  const stats = useMemo(() => {
    const totalBudget = INITIAL_BUDGETS.reduce((sum, item) => sum + item.budget, 0);
    const totalSpent = INITIAL_BUDGETS.reduce((sum, item) => sum + item.spent, 0);
    const totalExpenses = INITIAL_EXPENSES.reduce((sum, item) => sum + item.amount, 0);
    const savings = totalBudget - totalSpent;
    const savingsPercentage = totalBudget > 0 ? (savings / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      totalExpenses,
      savings,
      savingsPercentage,
    };
  }, []);

  // Pie chart data for categories
  const pieData = useMemo(() => {
    return INITIAL_BUDGETS.map(item => ({
      name: item.category,
      value: item.spent,
    }));
  }, []);

  // Monthly trend data
  const monthlyData = useMemo(() => [
    { month: 'Jan', income: 4000, expenses: 2400 },
    { month: 'Feb', income: 3000, expenses: 1398 },
    { month: 'Mar', income: 2000, expenses: 9800 },
    { month: 'Apr', income: 2780, expenses: 3908 },
    { month: 'May', income: 1890, expenses: 4800 },
    { month: 'Jun', income: 2390, expenses: 3800 },
  ], []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Responsive with border and proper sizing */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="hidden sm:block w-2 h-8 bg-primary rounded-full"></div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Welcome back! Here's your financial overview
                </p>
              </div>
            </div>
            
            {/* Status Indicators - Mobile only */}
            <div className="flex items-center gap-3 sm:hidden mt-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Active</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="text-xs text-gray-600">
                {INITIAL_EXPENSES.length} transactions
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            {/* Date Display */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="text-xs font-medium text-gray-500 mb-1">Last updated</div>
              <div className="text-sm sm:text-base font-semibold text-gray-900">
                Today, {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            
            {/* Quick Stats - Desktop only */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500">Budget Used</div>
                <div className="text-lg font-bold text-primary">
                  {((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500">Savings Rate</div>
                <div className="text-lg font-bold text-green-600">
                  {stats.savingsPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar - Shows overall budget usage */}
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Monthly Budget Progress
            </span>
            <span className="text-xs sm:text-sm font-semibold text-primary">
              ${stats.totalSpent.toFixed(0)} / ${stats.totalBudget.toFixed(0)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((stats.totalSpent / stats.totalBudget) * 100, 100)}%` 
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-xs text-gray-500">50%</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </Card>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Total Balance</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                ${stats.totalBudget.toFixed(2)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0 ml-2">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
            <span className="text-green-600 truncate">+12% from last month</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Monthly Spending</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                ${stats.totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0 ml-2">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary rounded-full"
                style={{ width: `${Math.min((stats.totalSpent / stats.totalBudget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Savings Progress</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                ${stats.savings.toFixed(2)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {stats.savingsPercentage.toFixed(1)}% of budget saved
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Budget Alert</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">80% Reached</p>
            </div>
            <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0 ml-2">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-red-600 truncate">Food budget almost exceeded</p>
          </div>
        </Card>
      </div>

      {/* Charts Section - Stack on mobile, side-by-side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card 
          title="Spending by Category" 
          className="p-4 sm:p-6 lg:p-8"
        >
          <div className="h-60 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={60}
                  innerRadius={20}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: '12px',
                    paddingTop: '10px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card 
          title="Monthly Trend" 
          className="p-4 sm:p-6 lg:p-8"
        >
          <div className="h-60 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={monthlyData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  width={40}
                />
                <Tooltip />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#FF5722" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Transactions - Responsive Table */}
      <Card title="Recent Transactions" className="p-4 sm:p-6">
        <div className="overflow-x-auto -mx-4 sm:-mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {INITIAL_EXPENSES.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900">
                        <div>
                          <p className="font-medium truncate max-w-[120px] sm:max-w-none">{expense.description}</p>
                          {expense.note && (
                            <p className="text-gray-500 text-xs truncate max-w-[120px] sm:max-w-none">{expense.note}</p>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-500">
                        {expense.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-red-600">
                        -${expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Mobile alternative view for very small screens */}
        <div className="block sm:hidden mt-4">
          <div className="space-y-3">
            {INITIAL_EXPENSES.slice(0, 3).map((expense) => (
              <div key={`mobile-${expense.id}`} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{expense.description}</p>
                    {expense.note && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{expense.note}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-red-600 ml-2 flex-shrink-0">
                    -${expense.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {expense.category}
                  </span>
                  <span className="text-xs text-gray-500">{expense.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;