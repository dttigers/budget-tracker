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

      if (lastCheck === todayStr) return; // Already processed today

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
    const interval = setInterval(processRecurring, 3600000); // Check every hour
    return () => clearInterval(interval);
  }, [recurring]);

  const shouldProcessRecurring = (r, today) => {
    const dayOfMonth = today.getDate();
    
    if (r.frequency === 'monthly') {
      return dayOfMonth === r.dayOfMonth;
    }
    // Add daily/weekly logic here if needed
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

  const addRecurring = (recurring) => {
    const newRecurring = {
      id: Date.now(),
      ...recurring
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Budget Tracker</h1>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
            Premium Features 🎯
          </span>
        </div>
        
        <DateFilter currentFilter={dateFilter} onFilterChange={setDateFilter} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Summary transactions={filteredTransactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TransactionForm onAddTransaction={addTransaction} />
          <CategoryChart transactions={filteredTransactions} />
        </div>

        {/* NEW: Premium Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecurringManager 
            recurring={recurring}
            onAdd={addRecurring}
            onDelete={deleteRecurring}
          />
          <BudgetLimits 
            transactions={filteredTransactions}
            limits={budgetLimits}
            onSetLimit={setLimit}
            onRemoveLimit={removeLimit}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TransactionList 
              transactions={filteredTransactions} 
              onDeleteTransaction={deleteTransaction} 
            />
          </div>
          <DataExport transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default App;
