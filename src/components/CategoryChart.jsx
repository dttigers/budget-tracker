import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ transactions }) {
  const [viewType, setViewType] = useState('expense');
  
  const filtered = transactions.filter(t => t.type === viewType);
  
  // Group by category
  const categoryTotals = filtered.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const expenseColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF'
  ];

  const incomeColors = [
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#009688',
    '#00BCD4',
    '#03A9F4',
    '#2196F3'
  ];

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: viewType === 'expense' ? 'Spending by Category' : 'Income by Category',
        data: Object.values(categoryTotals),
        backgroundColor: viewType === 'expense' ? expenseColors : incomeColors,
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: $${context.parsed.toFixed(2)}`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {viewType === 'expense' ? 'Spending' : 'Income'} by Category
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('expense')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewType === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setViewType('income')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewType === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Income
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No {viewType === 'expense' ? 'expenses' : 'income'} to display
        </p>
      ) : (
        <div className="max-w-md mx-auto">
          <Doughnut data={data} options={options} />
        </div>
      )}
    </div>
  );
}

export default CategoryChart;
