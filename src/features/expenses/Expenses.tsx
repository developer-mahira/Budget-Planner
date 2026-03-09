import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Calendar, Tag, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { CATEGORIES, INITIAL_EXPENSES } from '../../utils/constants';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  note?: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  // Filter expenses based on search and category
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.note?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, selectedCategory]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  // Add new expense
  const handleAddExpense = useCallback(() => {
    if (!formData.description || !formData.category || !formData.amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date,
      note: formData.note,
    };

    setExpenses([...expenses, newExpense]);
    resetForm();
  }, [expenses, formData]);

  // Update existing expense
  const handleUpdateExpense = useCallback(() => {
    if (!editingExpense || !formData.description || !formData.category || !formData.amount) return;

    setExpenses(expenses.map(e => 
      e.id === editingExpense.id 
        ? { 
            ...e, 
            description: formData.description,
            category: formData.category,
            amount: parseFloat(formData.amount),
            date: formData.date,
            note: formData.note,
          }
        : e
    ));

    resetForm();
  }, [expenses, editingExpense, formData]);

  // Delete expense
  const handleDeleteExpense = useCallback((id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  }, [expenses]);

  // Reset form
  const resetForm = () => {
    setFormData({
      description: '',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  // Open modal for editing
  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      note: expense.note || '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Track and manage your daily expenses</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          <span className="hidden sm:inline">Add Expense</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl sm:text-3xl font-bold text-secondary">${totalExpenses.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{filteredExpenses.length}</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500">Average Expense</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              ${filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-full sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Expenses List */}
      <Card title="Expense Transactions" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      {expense.note && (
                        <p className="text-sm text-gray-500 mt-1">{expense.note}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Tag className="w-3 h-3" />
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {expense.date}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-red-600">
                      -${expense.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(expense)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <div className="space-y-4">
          <Input
            label="Description"
            placeholder="What did you spend on?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              icon={<span className="text-gray-500">$</span>}
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none h-20"
              placeholder="Add any additional notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={editingExpense ? handleUpdateExpense : handleAddExpense}
              disabled={!formData.description || !formData.category || !formData.amount}
            >
              {editingExpense ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(Expenses);