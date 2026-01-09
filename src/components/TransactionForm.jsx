import { useState } from 'react';

const CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Bills',
  'Shopping',
  'Healthcare',
  'Other'
];

function TransactionForm({ onAddTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!description || !amount) return;

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'Income' : category
    });

    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('Food');
  };

  return (
    <div className="premium-card p-6">
      <h2 className="section-header mb-6">Add Transaction</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            placeholder="e.g., Groceries, Salary, Coffee"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="select-field"
            >
              <option value="expense">💸 Expense</option>
              <option value="income">💰 Income</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${type === 'income' ? 'text-gray-500' : 'text-gray-300'}`}>
              Category
            </label>
            <select
              value={type === 'income' ? 'Income' : category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={type === 'income'}
              className={`select-field ${type === 'income' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {type === 'income' ? (
                <option value="Income">Income</option>
              ) : (
                CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              )}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          ✨ Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
