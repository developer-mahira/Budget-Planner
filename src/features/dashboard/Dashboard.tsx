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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your financial overview</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: Today, {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalBudget.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Spending</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary rounded-full"
                style={{ width: `${(stats.totalSpent / stats.totalBudget) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Savings Progress</p>
              <p className="text-2xl font-bold text-gray-900">${stats.savings.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {stats.savingsPercentage.toFixed(1)}% of budget saved
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Budget Alert</p>
              <p className="text-2xl font-bold text-gray-900">80% Reached</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-red-600">Food budget almost exceeded</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Spending by Category" padding="lg">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Trend" padding="lg">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#FF5722" 
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_EXPENSES.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      {expense.note && (
                        <p className="text-sm text-gray-500">{expense.note}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{expense.date}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-red-600">-${expense.amount.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;