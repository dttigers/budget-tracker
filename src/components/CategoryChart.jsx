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
        backgroundColor: ['#4CAF50', '#FF6384'],
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

  const hasData = totalIncome > 0 || totalExpenses > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Income vs Expenses</h2>
      {!hasData ? (
        <p className="text-gray-500 text-center py-8">No transactions to display</p>
      ) : (
        <div className="max-w-md mx-auto">
          <Doughnut data={data} options={options} />
          <div className="mt-4 flex justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Income</p>
              <p className="text-lg font-semibold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Expenses</p>
              <p className="text-lg font-semibold text-red-600">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Balance</p>
              <p className={`text-lg font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
