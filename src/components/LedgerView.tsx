import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  Receipt,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const LedgerView: React.FC = () => {
  const { ledger } = useGameStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | 'category' | 'description' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const categories: string[] = [
    'ALL',
    'Seed',
    'Harvest',
    'Farmstand Sales',
    'Wholesale Spot Sales',
    'Contract Sales',
    'Land Purchase',
    'Maintenance',
    'Upgrades',
  ];

  const handleSort = (field: 'date' | 'category' | 'description' | 'amount') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const renderSortIcon = (field: 'date' | 'category' | 'description' | 'amount') => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-stone-600 group-hover:text-stone-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-amber-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-amber-400" />
    );
  };

  const filteredLedger = ledger.filter((entry) => {
    const matchesCategory = selectedCategory === 'ALL' || entry.category === selectedCategory;
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAndFilteredLedger = [...filteredLedger].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      const aTime = a.year * 365 + a.day;
      const bTime = b.year * 365 + b.day;
      comparison = aTime - bTime;
    } else if (sortField === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === 'description') {
      comparison = a.description.localeCompare(b.description);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalRevenue = ledger.filter((e) => e.amount > 0).reduce((acc, e) => acc + e.amount, 0);

  const totalExpense = ledger.filter((e) => e.amount < 0).reduce((acc, e) => acc + Math.abs(e.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header & Financial Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Gross Revenue</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-400 font-mono">
            +${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Operating Expenses</span>
            <TrendingDown className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-rose-400 font-mono">
            -${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Net Operating Income</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <h3
            className={`text-2xl font-extrabold font-mono ${
              totalRevenue - totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalRevenue - totalExpense >= 0 ? '+' : '-'}
            ${Math.abs(totalRevenue - totalExpense).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
          <Filter className="w-4 h-4 text-stone-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search transaction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredLedger.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <Receipt className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-stone-300">No Transactions Found</h4>
            <p className="text-xs mt-1">Try resetting search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-950 border-b border-stone-800 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th
                    onClick={() => handleSort('date')}
                    className="py-3 px-6 cursor-pointer select-none hover:text-stone-200 transition group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Date</span>
                      {renderSortIcon('date')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('category')}
                    className="py-3 px-6 cursor-pointer select-none hover:text-stone-200 transition group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Category</span>
                      {renderSortIcon('category')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('description')}
                    className="py-3 px-6 cursor-pointer select-none hover:text-stone-200 transition group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Transaction Description</span>
                      {renderSortIcon('description')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('amount')}
                    className="py-3 px-6 text-right cursor-pointer select-none hover:text-stone-200 transition group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Amount</span>
                      {renderSortIcon('amount')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {sortedAndFilteredLedger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-stone-850/50 transition">
                    <td className="py-3.5 px-6 font-mono text-stone-400">
                      Y{entry.year} {entry.season} D{entry.day}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-950 border border-stone-800 text-amber-400">
                        {entry.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-stone-200 font-medium">{entry.description}</td>
                    <td
                      className={`py-3.5 px-6 text-right font-mono font-bold text-sm ${
                        entry.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {entry.amount >= 0 ? '+' : ''}
                      ${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
