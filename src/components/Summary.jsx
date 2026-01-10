function Summary({ transactions, onStatClick, activeFilter }) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <>
      {/* Income Card - Clickable */}
      <button
        onClick={() => onStatClick('income')}
        className={`stat-card group cursor-pointer transition-all ${
          activeFilter === 'income' ? 'ring-2 ring-green-400 scale-105' : ''
        }`}
      >
        <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
          Income {activeFilter === 'income' && '✓'}
        </h3>
        <p className="text-3xl font-bold text-green-400 glow-green">
          ${income.toFixed(2)}
        </p>
        <div className="absolute top-2 right-2 text-green-400 opacity-20 group-hover:opacity-40 transition-opacity text-4xl">
          ↑
        </div>
        <div className="absolute bottom-2 right-2 text-green-400/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          Click to filter
        </div>
      </button>

      {/* Expenses Card - Clickable */}
      <button
        onClick={() => onStatClick('expense')}
        className={`stat-card group cursor-pointer transition-all ${
          activeFilter === 'expense' ? 'ring-2 ring-red-400 scale-105' : ''
        }`}
      >
        <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">
          Expenses {activeFilter === 'expense' && '✓'}
        </h3>
        <p className="text-3xl font-bold text-red-400 glow-red">
          ${expenses.toFixed(2)}
        </p>
        <div className="absolute top-2 right-2 text-red-400 opacity-20 group-hover:opacity-40 transition-opacity text-4xl">
          ↓
        </div>
        <div className="absolute bottom-2 right-2 text-red-400/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          Click to filter
        </div>
      </button>

      {/* Balance Card - Not clickable */}
      <div className="stat-card group">
        <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Balance</h3>
        <p className={`text-3xl font-bold ${
          balance >= 0 
            ? 'text-cyan-400 glow-cyan' 
            : 'text-red-400 glow-red'
        }`}>
          ${balance.toFixed(2)}
        </p>
        <div className={`absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity text-4xl ${
          balance >= 0 ? 'text-cyan-400' : 'text-red-400'
        }`}>
          {balance >= 0 ? '💰' : '⚠️'}
        </div>
      </div>
    </>
  );
}

export default Summary;
