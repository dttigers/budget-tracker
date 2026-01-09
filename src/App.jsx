import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import CategoryChart from './components/CategoryChart';
import DateFilter from './components/DateFilter';
import RecurringManager from './components/RecurringManager';
import BudgetLimits from './components/BudgetLimits';
import DataExport from './components/DataExport';

function App() {
  // Load transactions from localStorage
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Load recurring transactions
  const [recurring, setRecurring] = useState(() => {
    const saved = localStorage.getItem('recurring');
    return saved ? JSON.parse(saved) : [];
  });

  // Load budget limits
  const [budgetLimits, setBudgetLimits] = useState(() => {
    const saved = localStorage.getItem('budgetLimits');
    return saved ? JSON.parse(saved) : {};
  });

  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save recurring transactions to localStorage
  useEffect(() => {
    localStorage.setItem('recurring', JSON.stringify(recurring));
  }, [recurring]);

  // Save budget limits to localStorage
  useEffect(() => {
    localStorage.setItem('budgetLimits', JSON.stringify(budgetLimits));
  }, [budgetLimits]);

  // Process recurring transactions daily
  useEffect(() => {
    const processRecurring = () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const lastCheck = localStorage.getItem('lastRecurringCheck');

      if (lastCheck === todayStr) return;

      recurring.forEach(r => {
        if (shouldProcessRecurring(r, today)) {
          addTransaction({
            description: `${r.description} (Recurring)`,
            amount: r.amount,
            type: r.type,
            category: r.category
          });
        }
      });

      localStorage.setItem('lastRecurringCheck', todayStr);
    };

    processRecurring();
    const interval = setInterval(processRecurring, 3600000);
    return () => clearInterval(interval);
  }, [recurring]);

  const shouldProcessRecurring = (r, today) => {
    const dayOfMonth = today.getDate();
    
    if (r.frequency === 'monthly') {
      return dayOfMonth === r.dayOfMonth;
    }
    return false;
  };

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

  const addRecurring = (recurringItem) => {
    const newRecurring = {
      id: Date.now(),
      ...recurringItem
    };
    setRecurring([...recurring, newRecurring]);
  };

  const deleteRecurring = (id) => {
    setRecurring(recurring.filter(r => r.id !== id));
  };

  const setLimit = ({ category, limit }) => {
    setBudgetLimits({
      ...budgetLimits,
      [category]: limit
    });
  };

  const removeLimit = (category) => {
    const newLimits = { ...budgetLimits };
    delete newLimits[category];
    setBudgetLimits(newLimits);
  };

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
      
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with gradient */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2 animate-fadeIn">
              💰 Budget Tracker
            </h1>
            <p className="text-gray-400 text-sm">Track smarter, spend better</p>
          </div>
          <div className="badge-premium animate-fadeIn">
            ✨ Premium Features
          </div>
        </div>
        
        <DateFilter currentFilter={dateFilter} onFilterChange={setDateFilter} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
          <Summary 
            transactions={filteredTransactions} 
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-fadeIn">
            <TransactionForm onAddTransaction={addTransaction} />
          </div>
          <div className="animate-fadeIn">
            <CategoryChart transactions={filteredTransactions} />
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-fadeIn">
            <RecurringManager 
              recurring={recurring}
              onAdd={addRecurring}
              onDelete={deleteRecurring}
            />
          </div>
          <div className="animate-fadeIn">
            <BudgetLimits 
              transactions={filteredTransactions}
              limits={budgetLimits}
              onSetLimit={setLimit}
              onRemoveLimit={removeLimit}
            />
          </div>
        </div>

        {/* Transactions and Export */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 animate-fadeIn">
            <TransactionList 
              transactions={filteredTransactions} 
              onDeleteTransaction={deleteTransaction}
              typeFilter={typeFilter}
              onClearFilter={() => setTypeFilter('all')}
            />
          </div>
          <div className="animate-fadeIn">
            <DataExport transactions={transactions} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>Built with ❤️ • Dark Mode Premium Edition</p>
        </div>
      </div>
    </div>
  );
}

export default App;
