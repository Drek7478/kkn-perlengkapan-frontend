// File: src/components/ui/StatCard.jsx

import { Package } from 'lucide-react';

/**
 * Komponen Kartu Statistik untuk Dashboard
 * 
 * @param {string} title - Label statistik
 * @param {number|string} value - Nilai statistik
 * @param {string} color - 'blue', 'emerald', 'amber', 'red', 'gray'
 * @param {React.Component} icon - Icon dari lucide-react
 * @param {string} className - Class tambahan
 * 
 * Contoh:
 * <StatCard title="Total Aktif" value={25} color="blue" icon={Package} />
 */

const colorConfig = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-600 dark:text-amber-400',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/40',
    text: 'text-red-600 dark:text-red-400',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
  },
};

const StatCard = ({ title, value, color = 'blue', icon: Icon, className = '' }) => {
  const colorStyle = colorConfig[color] || colorConfig.blue;

  return (
    <div
      className={`
        bg-white dark:bg-gray-900
        rounded-2xl p-5
        border border-gray-200 dark:border-gray-700
        hover:shadow-md transition-shadow duration-200
        ${className}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Icon dalam lingkaran */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center shrink-0
          ${colorStyle.bg}
        `}>
          {Icon && <Icon size={24} className={colorStyle.text} />}
        </div>

        {/* Nilai & Label */}
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;