import { useState } from 'react';

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const CATEGORIES = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Other'];

function RecurringManager({ recurring, onAdd, onDelete }) {
  const [isAdding, setIsAdding] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Bills');
  const [frequency, setFrequency] = useState('monthly');
  const [dayOfMonth, setDayOfMonth] = useState('1');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      type,
      category,
      frequency,
      dayOfMonth: frequency === 'monthly' ? parseInt(dayOfMonth) : null,
      nextRun: new Date().toISOString().split('T')[0]
    });

    // Reset form
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('Bills');
    setFrequency('monthly');
    setDayOfMonth('1');
    setIsAdding(false);
  };

  return (
    <div className="premium-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-header">Recurring Transactions</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          {isAdding ? 'Cancel' : '+ Add Recurring'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (e.g., "Rent", "Salary")
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              placeholder="Rent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="1500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="select-field"
              >
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="select-field"
              >
                {FREQUENCIES.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>
          </div>

          {frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Day of Month (1-28)
              </label>
              <input
                type="number"
                min="1"
                max="28"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(e.target.value)}
                className="input-field"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Save Recurring Transaction
          </button>
        </form>
      )}

      <div className="space-y-2">
        {recurring.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2 opacity-20">🔄</div>
            <p className="text-gray-400">No recurring transactions yet</p>
          </div>
        ) : (
          recurring.map(r => (
            <div
              key={r.id}
              className="transaction-item group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-100">{r.description}</span>
                  <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                    {r.frequency}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {r.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {r.frequency === 'monthly' && `Day ${r.dayOfMonth} of each month`}
                  {r.frequency === 'weekly' && 'Every week'}
                  {r.frequency === 'daily' && 'Every day'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${r.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {r.type === 'income' ? '+' : '-'}${r.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDelete(r.id)}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecurringManager;
