/**
 * Empty state component for the system page when no system information is available
 */
export function SystemEmptyState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <span className="text-sm">Unable to load system information</span>
      </div>
    </div>
  );
}