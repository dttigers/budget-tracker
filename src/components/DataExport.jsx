function DataExport({ transactions }) {
  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export!');
      return;
    }

    // Create CSV header
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    
    // Create CSV rows
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount.toFixed(2)
    ]);

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `budget-tracker-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Export Data</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Ready to export:</strong> {transactions.length} transactions
        </p>
        <p className="text-sm text-gray-600">
          Total Income: <span className="text-green-600 font-semibold">${income.toFixed(2)}</span>
          {' | '}
          Total Expenses: <span className="text-red-600 font-semibold">${expenses.toFixed(2)}</span>
        </p>
      </div>

      <button
        onClick={exportToCSV}
        disabled={transactions.length === 0}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          transactions.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        📥 Download CSV
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Opens in Excel, Google Sheets, or any spreadsheet app
      </p>
    </div>
  );
}

export default DataExport;
