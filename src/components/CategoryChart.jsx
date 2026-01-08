function DateFilter({ currentFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All Time' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' }
  ];

  return (
    <div className="mb-6 flex gap-2">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentFilter === filter.value
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default DateFilter;