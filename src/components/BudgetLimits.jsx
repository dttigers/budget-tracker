import { useState } from 'react';

const CATEGORIES = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];

function BudgetLimits({ transactions, limits, onSetLimit, onRemoveLimit }) {
  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState('Food');
  const [limitAmount, setLimitAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!limitAmount) return;

    onSetLimit({
      category,
      limit: parseFloat(limitAmount)
    });

    setLimitAmount('');
    setIsAdding(false);
  };

  // Calculate spending per category
  const getCategorySpending = (cat) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get status color based on spending
  const getStatusColor = (spending, limit) => {
    const percentage = (spending / limit) * 100;
    if (percentage >= 100) return 'text-red-600 bg-red-50';
    if (percentage >= 80) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (spending, limit) => {
    const percentage = (spending / limit) * 100;
    if (percentage >= 100) return '⚠️ Over budget!';
    if (percentage >= 80) return '⚡ Close to limit';
    return '✓ On track';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Budget Limits</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          {isAdding ? 'Cancel' : '+ Set Limit'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-md space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Limit
            </label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="500.00"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Set Budget Limit
          </button>
        </form>
      )}

      <div className="space-y-3">
        {Object.keys(limits).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No budget limits set yet</p>
        ) : (
          Object.entries(limits).map(([cat, limit]) => {
            const spending = getCategorySpending(cat);
            const percentage = Math.min((spending / limit) * 100, 100);

            return (
              <div key={cat} className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{cat}</h3>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(spending, limit)}`}>
                        {getStatusText(spending, limit)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ${spending.toFixed(2)} of ${limit.toFixed(2)} spent
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveLimit(cat)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    ×
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      percentage >= 100 ? 'bg-red-500' :
                      percentage >= 80 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {percentage.toFixed(0)}%
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BudgetLimits;
