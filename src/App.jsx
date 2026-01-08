import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import CategoryChart from './components/CategoryChart';
import DateFilter from './components/DateFilter';

function App() {
  // Load transactions from localStorage on startup
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [dateFilter, setDateFilter] = useState('all');

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Filter transactions by date
  const getFilteredTransactions = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      
      if (dateFilter === 'thisMonth') {
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      }
      
      if (dateFilter === 'lastMonth') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return transactionDate.getMonth() === lastMonth && 
               transactionDate.getFullYear() === lastMonthYear;
      }
      
      return true; // 'all'
    });
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Budget Tracker</h1>
        
        <DateFilter currentFilter={dateFilter} onFilterChange={setDateFilter} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Summary transactions={filteredTransactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TransactionForm onAddTransaction={addTransaction} />
          <CategoryChart transactions={filteredTransactions} />
        </div>

        <TransactionList 
          transactions={filteredTransactions} 
          onDeleteTransaction={deleteTransaction} 
        />
      </div>
    </div>
  );
}

export default App;