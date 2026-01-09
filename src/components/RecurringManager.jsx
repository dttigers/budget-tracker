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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recurring Transactions</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {isAdding ? 'Cancel' : '+ Add Recurring'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-md space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (e.g., "Rent", "Salary")
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FREQUENCIES.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>
          </div>

          {frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day of Month (1-28)
              </label>
              <input
                type="number"
                min="1"
                max="28"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Recurring Transaction
          </button>
        </form>
      )}

      <div className="space-y-2">
        {recurring.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recurring transactions yet</p>
        ) : (
          recurring.map(r => (
            <div
              key={r.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.description}</span>
                  <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
                    {r.frequency}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
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
                <span className={`font-semibold ${r.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {r.type === 'income' ? '+' : '-'}${r.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDelete(r.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
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
