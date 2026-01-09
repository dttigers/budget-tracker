function DateFilter({ currentFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: '🌐 All Time', icon: '∞' },
    { value: 'thisMonth', label: '📅 This Month', icon: '30' },
    { value: 'lastMonth', label: '📆 Last Month', icon: '-1' }
  ];

  return (
    <div className="mb-8 flex flex-wrap gap-3 animate-fadeIn">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            currentFilter === filter.value
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 transform scale-105'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-cyan-500 hover:text-cyan-400'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default DateFilter;
