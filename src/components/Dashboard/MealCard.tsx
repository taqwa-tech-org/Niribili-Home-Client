import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, AlertCircle, Lock, Calendar, X } from 'lucide-react';

interface MealOrder {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  quantity: number;
  status: 'pending' | 'confirmed' | 'paused';
  createdAt: Date;
  canEdit: boolean;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

export default function MealOrderingSystem() {
  const [orders, setOrders] = useState<MealOrder[]>([
    {
      id: '1',
      date: '2026-01-22',
      mealType: 'lunch',
      quantity: 2,
      status: 'confirmed',
      createdAt: new Date(),
      canEdit: true
    },
    {
      id: '2',
      date: '2026-01-23',
      mealType: 'dinner',
      quantity: 1,
      status: 'confirmed',
      createdAt: new Date(),
      canEdit: true
    }
  ]);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 17));
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Get current time and check if past cutoff
  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const isCutoffPassed = useMemo(() => {
    return getCurrentTime() >= 22 * 60; // 10:00 PM = 22:00
  }, []);

  const cutoffTime = '22:00 (10:00 PM)';

  const canEditOrder = (orderDate: string): boolean => {
    const orderDateObj = new Date(orderDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Can't edit if date is today or past
    if (orderDateObj <= today) return false;
    // Can't edit if cutoff passed
    if (isCutoffPassed) return false;
    return true;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isValidOrderDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isValidOrderDate(date)) return;

    const dateStr = date.toISOString().split('T')[0];
    const newSelected = new Set(selectedDates);
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
  };

  const handleAdvanceOrder = () => {
    if (selectedDates.size === 0) return;

    const newOrders = Array.from(selectedDates).map((dateStr, idx) => ({
      id: `order_${Date.now()}_${idx}`,
      date: dateStr,
      mealType: selectedMealType,
      quantity: selectedQuantity,
      status: 'pending' as const,
      createdAt: new Date(),
      canEdit: true
    }));

    setOrders([...orders, ...newOrders]);
    setSelectedDates(new Set());
    setCalendarOpen(false);
    setSelectedQuantity(1);
    setSelectedMealType('lunch');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setOrders(orders.map(order =>
      order.id === id ? { ...order, quantity } : order
    ));
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const getMealColor = (type: MealType) => {
    const colors = {
      breakfast: 'bg-orange-50 border-orange-200',
      lunch: 'bg-green-50 border-green-200',
      dinner: 'bg-blue-50 border-blue-200'
    };
    return colors[type];
  };

  const getMealIcon = (type: MealType) => {
    const icons = {
      breakfast: '🌅',
      lunch: '🍽️',
      dinner: '🌙'
    };
    return icons[type];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      paused: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const sortedOrders = [...orders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const calendarDays = [];
  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const renderCalendar = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add Meal Order</h2>
            <button
              onClick={() => setCalendarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty_${idx}`} />;
              }

              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const dateStr = date.toISOString().split('T')[0];
              const isValid = isValidOrderDate(date);
              const isSelected = selectedDates.has(dateStr);

              return (
                <button
                  key={day}
                  onClick={() => isValid && handleDateClick(day)}
                  disabled={!isValid}
                  className={`p-2 text-sm rounded-lg transition-colors font-medium ${
                    !isValid
                      ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-gray-700 bg-gray-50 hover:bg-blue-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Meal Type Selection */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Select Meal Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`py-3 px-2 rounded-lg text-sm font-medium transition-colors capitalize flex flex-col items-center gap-1 ${
                    selectedMealType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">{getMealIcon(type)}</span>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Select Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-bold text-gray-900 w-12 text-center">{selectedQuantity}</span>
              <button
                onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Selected Dates Info */}
          {selectedDates.size > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                {selectedDates.size} date{selectedDates.size > 1 ? 's' : ''} selected
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedDates).sort().map(dateStr => (
                  <div key={dateStr} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
                    {new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setCalendarOpen(false);
                setSelectedDates(new Set());
                setSelectedQuantity(1);
                setSelectedMealType('lunch');
              }}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdvanceOrder}
              disabled={selectedDates.size === 0}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              Advance Order ({selectedDates.size})
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meal Ordering System</h1>
              <p className="text-gray-600 mt-1">Plan your meals in advance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Your Orders</h2>
                  <button
                    onClick={() => setCalendarOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Order
                  </button>
                </div>
              </div>

              {sortedOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">Click "Add Order" to place your first meal order</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Meal Type</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Quantity</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedOrders.map(order => (
                        <tr key={order.id} className={`border-b border-gray-200 ${getMealColor(order.mealType)}`}>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">
                              {new Date(order.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-lg">{getMealIcon(order.mealType)}</span>
                            <span className="ml-2 capitalize font-medium text-gray-900">{order.mealType}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {canEditOrder(order.date) && !isCutoffPassed ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => updateQuantity(order.id, order.quantity - 1)}
                                  className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-semibold text-gray-900">{order.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(order.id, order.quantity + 1)}
                                  className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="font-semibold text-gray-900">{order.quantity}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Cutoff Info & Rules */}
          <div className="space-y-4">
            {/* Cutoff Alert */}
            <div className={`${isCutoffPassed ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                {isCutoffPassed ? (
                  <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-semibold ${isCutoffPassed ? 'text-red-900' : 'text-blue-900'}`}>
                    {isCutoffPassed ? 'Editing Locked' : 'Editing Available'}
                  </h3>
                  <p className={`text-sm mt-1 ${isCutoffPassed ? 'text-red-700' : 'text-blue-700'}`}>
                    {isCutoffPassed
                      ? `Daily cutoff passed at ${cutoffTime}. You can edit orders again from midnight.`
                      : `You can edit orders until ${cutoffTime} daily.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Order Rules</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">✓</span>
                  <span>Orders must be placed 1 day in advance</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">✓</span>
                  <span>Daily cutoff: <strong>10:00 PM</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">✓</span>
                  <span>Orders auto-lock after cutoff</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">✓</span>
                  <span>Edit quantity before cutoff</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">✓</span>
                  <span>Order multiple quantities</span>
                </li>
              </ul>
            </div>

            {/* Current Time */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Next cutoff in {22 - new Date().getHours()}h {60 - new Date().getMinutes()}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {calendarOpen && renderCalendar()}
    </div>
  );
}