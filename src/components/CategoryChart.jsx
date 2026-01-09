import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ transactions }) {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 2,
        borderColor: '#1f2937'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af'
        }
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

  const hasData = totalIncome > 0 || totalExpenses > 0;

  return (
    <div className="premium-card p-6">
      <h2 className="section-header mb-4">Income vs Expenses</h2>
      {!hasData ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">📊</div>
          <p className="text-gray-400">No transactions to display</p>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <Doughnut data={data} options={options} />
          <div className="mt-4 flex justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-gray-400">Income</p>
              <p className="text-lg font-semibold text-green-400">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Expenses</p>
              <p className="text-lg font-semibold text-red-400">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Balance</p>
              <p className={`text-lg font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                ${(totalIncome - totalExpenses).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryChart;
