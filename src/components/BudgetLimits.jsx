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
    if (percentage >= 100) return 'text-red-400 bg-red-400/10';
    if (percentage >= 80) return 'text-orange-400 bg-orange-400/10';
    return 'text-green-400 bg-green-400/10';
  };

  const getStatusText = (spending, limit) => {
    const percentage = (spending / limit) * 100;
    if (percentage >= 100) return '⚠️ Over budget!';
    if (percentage >= 80) return '⚡ Close to limit';
    return '✓ On track';
  };

  return (
    <div className="premium-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-header">Budget Limits</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          {isAdding ? 'Cancel' : '+ Set Limit'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-field"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Monthly Limit
            </label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              className="input-field"
              placeholder="500.00"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Set Budget Limit
          </button>
        </form>
      )}

      <div className="space-y-3">
        {Object.keys(limits).length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2 opacity-20">📊</div>
            <p className="text-gray-400">No budget limits set yet</p>
          </div>
        ) : (
          Object.entries(limits).map(([cat, limit]) => {
            const spending = getCategorySpending(cat);
            const percentage = Math.min((spending / limit) * 100, 100);

            return (
              <div key={cat} className="p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-100">{cat}</h3>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(spending, limit)}`}>
                        {getStatusText(spending, limit)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      ${spending.toFixed(2)} of ${limit.toFixed(2)} spent
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveLimit(cat)}
                    className="text-gray-500 hover:text-red-400 font-bold text-lg transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
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
