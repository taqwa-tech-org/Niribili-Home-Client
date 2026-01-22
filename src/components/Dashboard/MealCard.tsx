import  { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, AlertCircle, Lock, Calendar, X } from 'lucide-react';

interface MealOrder {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  quantity: number;
  createdAt: Date;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface DayMeals {
  date: string;
  meals: {
    breakfast?: MealOrder;
    lunch?: MealOrder;
    dinner?: MealOrder;
  };
}

export default function MealOrderingSystem() {
  const [orders, setOrders] = useState<MealOrder[]>([
   
  ]);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 18));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [mealQuantities, setMealQuantities] = useState<{ breakfast: number; lunch: number; dinner: number }>({
    breakfast: 1,
    lunch: 1,
    dinner: 1
  });

  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const isCutoffPassed = useMemo(() => {
    return getCurrentTime() >= 22 * 60;
  }, []);

  const cutoffTime = '22:00 (10:00 PM)';

  const getStatusByTime = (): 'pending' | 'confirmed' => {
    return isCutoffPassed ? 'confirmed' : 'pending';
  };

  const canEditOrder = (orderDate: string): boolean => {
    const orderDateObj = new Date(orderDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (orderDateObj <= today) return false;
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
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  const formatDateString = (year: number, month: number, day: number): string => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!isValidOrderDate(date)) return;
    setSelectedDate(dateStr);
  };

  const handleAddMeals = () => {
    if (!selectedDate) return;

    const newOrders: MealOrder[] = [];
    const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

    mealTypes.forEach(mealType => {
      const qty = mealQuantities[mealType];
      if (qty > 0) {
        const existingOrder = orders.find(
          o => o.date === selectedDate && o.mealType === mealType
        );

        if (existingOrder) {
          setOrders(prev =>
            prev.map(o =>
              o.id === existingOrder.id
                ? { ...o, quantity: o.quantity + qty }
                : o
            )
          );
        } else {
          newOrders.push({
            id: `order_${Date.now()}_${Math.random()}`,
            date: selectedDate,
            mealType: mealType,
            quantity: qty,
            createdAt: new Date()
          });
        }
      }
    });

    if (newOrders.length > 0) {
      setOrders([...orders, ...newOrders]);
    }

    setSelectedDate(null);
    setCalendarOpen(false);
    setMealQuantities({ breakfast: 1, lunch: 1, dinner: 1 });
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

  // Group orders by date
  const groupOrdersByDate = (): DayMeals[] => {
    const grouped = new Map<string, DayMeals>();

    orders.forEach(order => {
      if (!grouped.has(order.date)) {
        grouped.set(order.date, { date: order.date, meals: {} });
      }
      const dayMeal = grouped.get(order.date)!;
      dayMeal.meals[order.mealType] = order;
    });

    return Array.from(grouped.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-lg border border-gray-200 p-4 sm:p-6 shadow-xl w-full sm:w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select Date & Add Meals</h2>
            <button
              onClick={() => setCalendarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day.charAt(0)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty_${idx}`} />;
              }

              const dateStr = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isValid = isValidOrderDate(date);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={`day_${day}`}
                  onClick={() => isValid && handleDateClick(day)}
                  disabled={!isValid}
                  className={`p-1 sm:p-2 text-xs sm:text-sm rounded transition-colors font-medium aspect-square flex items-center justify-center ${
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

          {selectedDate && (
            <>
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Selected Date: <span className="text-blue-600">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-4">Select Meals & Quantities</label>
                <div className="space-y-3">
                  {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(type => (
                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMealIcon(type)}</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMealQuantities(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-semibold text-gray-900">{mealQuantities[type]}</span>
                        <button
                          onClick={() => setMealQuantities(prev => ({ ...prev, [type]: prev[type] + 1 }))}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => {
                setCalendarOpen(false);
                setSelectedDate(null);
                setMealQuantities({ breakfast: 1, lunch: 1, dinner: 1 });
              }}
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-semibold transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMeals}
              disabled={!selectedDate}
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors text-sm sm:text-base"
            >
              Add Meals
            </button>
          </div>
        </div>
      </div>
    );
  };

  const groupedOrders = groupOrdersByDate();
  const status = getStatusByTime();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Meal Ordering</h1>
              <p className="text-xs sm:text-base text-gray-600 mt-1">Plan your meals in advance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3 w-full">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-3 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Orders</h2>
                  <button
                    onClick={() => setCalendarOpen(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-xs sm:text-base whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Order</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>

              {groupedOrders.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <Calendar className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-sm sm:text-base">No orders yet</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Click "Add" to place your first meal order</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max sm:min-w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Breakfast</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Lunch</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Dinner</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                        <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedOrders.map(dayMeal => (
                        <tr key={dayMeal.date} className="border-b border-gray-200 bg-white hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                            <span className="font-medium text-gray-900 block">
                              {new Date(dayMeal.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </td>

                          {['breakfast', 'lunch', 'dinner'].map(mealType => {
                            const meal = dayMeal.meals[mealType as MealType];
                            return (
                              <td key={mealType} className="px-3 sm:px-6 py-3 sm:py-4">
                                {meal ? (
                                  <div className={`p-2 sm:p-3 rounded-lg border ${getMealColor(meal.mealType)}`}>
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="text-base sm:text-lg">{getMealIcon(meal.mealType)}</span>
                                        <span className="capitalize font-medium text-gray-900 text-xs sm:text-sm">{mealType}</span>
                                      </div>
                                    </div>
                                    {canEditOrder(dayMeal.date) && !isCutoffPassed ? (
                                      <div className="flex items-center justify-between gap-1 sm:gap-2 mt-2">
                                        <button
                                          onClick={() => updateQuantity(meal.id, meal.quantity - 1)}
                                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center font-semibold text-gray-900 text-xs sm:text-sm">{meal.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(meal.id, meal.quantity + 1)}
                                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="block font-semibold text-gray-900 text-xs sm:text-sm mt-2">Qty: {meal.quantity}</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs sm:text-sm">—</span>
                                )}
                              </td>
                            );
                          })}

                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${getStatusColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                            <button
                              onClick={() => {
                                if (dayMeal.meals.breakfast) deleteOrder(dayMeal.meals.breakfast.id);
                                if (dayMeal.meals.lunch) deleteOrder(dayMeal.meals.lunch.id);
                                if (dayMeal.meals.dinner) deleteOrder(dayMeal.meals.dinner.id);
                              }}
                              className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap"
                            >
                              Delete Day
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

          <div className="space-y-4 w-full">
            <div className={`${isCutoffPassed ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3 sm:p-4`}>
              <div className="flex items-start gap-3">
                {isCutoffPassed ? (
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <h3 className={`font-semibold text-xs sm:text-base ${isCutoffPassed ? 'text-red-900' : 'text-blue-900'}`}>
                    {isCutoffPassed ? 'Editing Locked' : 'Editing Available'}
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isCutoffPassed ? 'text-red-700' : 'text-blue-700'}`}>
                    {isCutoffPassed
                      ? `Cutoff at ${cutoffTime}. Edit again at midnight.`
                      : `Edit until ${cutoffTime}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-xs sm:text-base">Order Rules</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">✓</span>
                  <span>Order multiple meals per day</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">✓</span>
                  <span>1 day advance</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">✓</span>
                  <span>Cutoff: <strong>10 PM</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">✓</span>
                  <span>Status: Pending before 10 PM</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">✓</span>
                  <span>Status: Confirmed after 10 PM</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-600">Current Time</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Cutoff in {Math.max(0, 22 - new Date().getHours())}h {Math.max(0, 60 - new Date().getMinutes())}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {calendarOpen && renderCalendar()}
    </div>
  );
}