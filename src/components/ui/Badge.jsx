// File: src/components/ui/Badge.jsx

/**
 * Komponen Badge universal
 * 
 * @param {string} variant - 'success', 'danger', 'warning', 'info', 'neutral'
 * @param {string} size - 'sm', 'md'
 * @param {string} className - Class tambahan
 * @param {ReactNode} children - Isi badge
 * 
 * Contoh:
 * <Badge variant="success">Baik</Badge>
 * <Badge variant="danger">Hilang</Badge>
 * <Badge variant="warning">Rusak Ringan</Badge>
 */

const variants = {
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

const Badge = ({ variant = 'neutral', size = 'sm', className = '', children }) => {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant] || variants.neutral}
        ${sizes[size] || sizes.sm}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;