// File: src/components/ui/Spinner.jsx

/**
 * Komponen Spinner untuk menampilkan loading state
 * 
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {string} className - class tambahan
 */
const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`
        ${sizes[size]}
        border-gray-200 dark:border-gray-700
        border-t-blue-600 dark:border-t-blue-400
        rounded-full animate-spin
        ${className}
      `}
    />
  );
};

export default Spinner;