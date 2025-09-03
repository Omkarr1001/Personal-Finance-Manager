import React from 'react';
import { useQuery } from 'react-query';
import { tradeAPI, expenseAPI, goalAPI } from '../services/api';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  TargetIcon as TargetOutlineIcon, // Alternative icon substitution below
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Since 'TargetIcon' does not exist in heroicons, you can use a close alternative like 'TargetOutlineIcon' in heroicons v2.
// If you don't want to rename import, just use above and replace usages accordingly.

const Dashboard = () => {
  const { data: portfolio } = useQuery('portfolio', tradeAPI.getPortfolio);
  const { data: expenses } = useQuery('expenses', expenseAPI.getAll);
  const { data: goals } = useQuery('goals', goalAPI.getActive);

  const totalExpenses =
    expenses?.reduce((sum, expense) => sum + parseFloat(expense.amount), 0) || 0;
  const totalInvested = portfolio?.totalInvested || 0;
  const currentValue = portfolio?.currentValue || 0;
  const totalProfitLoss = portfolio?.totalProfitLoss || 0;
  const activeGoals = goals?.length || 0;

  const stats = [
    {
      name: 'Total Invested',
      value: `$${totalInvested.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Current Value',
      value: `$${currentValue.toLocaleString()}`,
      icon: ArrowTrendingUpIcon, // Correct icon name
      color: 'bg-green-500',
    },
    {
      name: 'Total P&L',
      value: `$${totalProfitLoss.toLocaleString()}`,
      icon: totalProfitLoss >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon, // Correct icon names
      color: totalProfitLoss >= 0 ? 'bg-green-500' : 'bg-red-500',
    },
    {
      name: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Active Goals',
      value: activeGoals.toString(),
      icon: TargetOutlineIcon, // Using alternative icon import name
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Trades */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Trades</h3>
            <div className="mt-4 flow-root">
              <div className="-my-4 divide-y divide-gray-200">
                {expenses?.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center py-4">
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(expense.expenseDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="text-sm font-medium text-gray-900">
                        ${parseFloat(expense.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Goals */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Goals</h3>
            <div className="mt-4 flow-root">
              <div className="-my-4 divide-y divide-gray-200">
                {goals?.slice(0, 5).map((goal) => {
                  const progress = Math.min(
                    (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100,
                    100
                  );
                  return (
                    <div key={goal.id} className="flex items-center py-4">
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{goal.name}</p>
                        <div className="mt-1">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{Math.round(progress)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${parseFloat(goal.currentAmount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          of ${parseFloat(goal.targetAmount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="relative rounded-lg border border-gray-300 bg-white px-4 py-5 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Add Trade</p>
                  <p className="text-xs text-gray-500">Record a new trade</p>
                </div>
              </div>
            </button>

            <button className="relative rounded-lg border border-gray-300 bg-white px-4 py-5 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Add Expense</p>
                  <p className="text-xs text-gray-500">Track spending</p>
                </div>
              </div>
            </button>

            <button className="relative rounded-lg border border-gray-300 bg-white px-4 py-5 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TargetOutlineIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Set Goal</p>
                  <p className="text-xs text-gray-500">Create investment goal</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
