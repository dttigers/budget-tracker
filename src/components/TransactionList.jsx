function TransactionList({ transactions, onDeleteTransaction }) {
  return (
    <div className="premium-card p-6">
      <h2 className="section-header mb-6">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">📊</div>
          <p className="text-gray-400">No transactions yet</p>
          <p className="text-gray-500 text-sm mt-2">Add your first transaction above!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className="transaction-item group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-100 truncate">
                    {transaction.description}
                  </span>
                  <span className={`badge ${
                    transaction.type === 'income' ? 'badge-income' : 'badge-expense'
                  }`}>
                    {transaction.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <span
                  className={`font-bold text-lg ${
                    transaction.type === 'income' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toFixed(2)}
                </span>
                
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-red-500/10"
                  title="Delete transaction"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} total
          </p>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
