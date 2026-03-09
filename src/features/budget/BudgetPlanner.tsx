import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { CATEGORIES, INITIAL_BUDGETS } from '../../utils/constants';

interface BudgetItem {
  id: string;
  category: string;
  budget: number;
  spent: number;
}

const BudgetPlanner: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetItem[]>(INITIAL_BUDGETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    budget: '',
  });

  const stats = useMemo(() => {
    const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);
    const totalSpent = budgets.reduce((sum, item) => sum + item.spent, 0);
    const remaining = totalBudget - totalSpent;
    const utilizationRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return { totalBudget, totalSpent, remaining, utilizationRate };
  }, [budgets]);

  const handleAddBudget = () => {
    if (!formData.category || !formData.budget) return;

    const newBudget: BudgetItem = {
      id: Date.now().toString(),
      category: formData.category,
      budget: parseFloat(formData.budget),
      spent: 0,
    };

    setBudgets([...budgets, newBudget]);
    setIsModalOpen(false);
    setFormData({ category: '', budget: '' });
  };

  const handleEditBudget = (budget: BudgetItem) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      budget: budget.budget.toString(),
    });
    setIsModalOpen(true);
  };

  const handleUpdateBudget = () => {
    if (!editingBudget || !formData.category || !formData.budget) return;

    setBudgets(budgets.map(b => 
      b.id === editingBudget.id 
        ? { ...b, category: formData.category, budget: parseFloat(formData.budget) }
        : b
    ));
    
    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({ category: '', budget: '' });
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const getProgressColor = (budget: number, spent: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-primary';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Budget Planner</h1>
          <p className="text-gray-600 text-sm sm:text-base">Plan and manage your monthly budgets</p>
        </div>
        <Button 
          onClick={() => {
            setEditingBudget(null);
            setFormData({ category: '', budget: '' });
            setIsModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          <span className="hidden sm:inline">Add Budget</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500">Total Budget</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">${stats.totalBudget.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl sm:text-3xl font-bold text-secondary">${stats.totalSpent.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500">Remaining</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">${stats.remaining.toFixed(2)}</p>
          </div>
        </Card>
      </div>

      {/* Budget List */}
      <Card title="Category Budgets" padding="lg">
        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.budget) * 100;
            const isOverBudget = budget.spent > budget.budget;

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{budget.category}</span>
                    {isOverBudget && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3" />
                        Over Budget
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Spent: <span className="font-medium">${budget.spent.toFixed(2)}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Budget: <span className="font-medium">${budget.budget.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBudget(budget)}
                        icon={<Edit2 className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getProgressColor(budget.budget, budget.spent)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${budget.spent.toFixed(2)} spent</span>
                  <span>${(budget.budget - budget.spent).toFixed(2)} remaining</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add/Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
          setFormData({ category: '', budget: '' });
        }}
        title={editingBudget ? 'Edit Budget' : 'Add New Budget'}
      >
        <div className="space-y-4">
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
          <Input
            label="Budget Amount"
            type="number"
            placeholder="0.00"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            icon={<span className="text-gray-500">$</span>}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBudget(null);
                setFormData({ category: '', budget: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingBudget ? handleUpdateBudget : handleAddBudget}
              disabled={!formData.category || !formData.budget}
            >
              {editingBudget ? 'Update Budget' : 'Add Budget'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetPlanner;