import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, AlertCircle, Lock, Calendar, X, TrendingUp, Filter, Trash2 } from 'lucide-react';
import { axiosSecure } from "@/hooks/useAxiosSecure";

interface MealOrder {
  _id?: string;
  id?: string;
  date: string;
  mealDate?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  status?: string;
  isLocked?: boolean;
  createdAt: Date | string;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface DayMeals {
  date: string;
  meals: {
    breakfast?: MealOrder;
    lunch?: MealOrder;
    dinner?: MealOrder;
  };
  totalCost?: number;
}

interface MonthlySummary {
  totalMeals: number;
  totalBreakfast: number;
  totalLunch: number;
  totalDinner: number;
  totalCost: number;
  month: number;
  year: number;
  daysInMonth: number;
  isPaid: boolean;
}

export default function MealOrderingSystem() {
  const [orders, setOrders] = useState<MealOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<MealOrder[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [mealQuantities, setMealQuantities] = useState<{ breakfast: number; lunch: number; dinner: number }>({
    breakfast: 1,
    lunch: 1,
    dinner: 1
  });
  const [costingData, setCostingData] = useState<{ [key: string]: { meals: MealOrder[], totalCost: number } }>({});
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const handleFilterDateClick = (day: number) => {
    const dateStr = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setFilterDate(dateStr);
  };

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get('/meals/my-orders');
      if (response.data.success) {
        const fetchedOrders = response.data.data.map((meal: any) => ({
          _id: meal._id,
          id: meal._id,
          date: meal.mealDate,
          mealDate: meal.mealDate,
          mealType: meal.mealType,
          quantity: meal.quantity,
          unitPrice: meal.unitPrice,
          totalPrice: meal.totalPrice,
          status: meal.status,
          isLocked: meal.isLocked,
          createdAt: meal.createdAt
        }));
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);

        // Fetch costing data for all unique dates
        const uniqueDates = [...new Set(fetchedOrders.map((o: MealOrder) => o.date || o.mealDate))];
        uniqueDates.forEach(date => {
          if (date) fetchCostingData(date);
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders by date
  const fetchOrdersByDate = async (date: string) => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get(`/meals/my-orders/date/${date}`);
      if (response.data.success) {
        const fetchedOrders = response.data.data.map((meal: any) => ({
          _id: meal._id,
          id: meal._id,
          date: meal.mealDate,
          mealDate: meal.mealDate,
          mealType: meal.mealType,
          quantity: meal.quantity,
          unitPrice: meal.unitPrice,
          totalPrice: meal.totalPrice,
          status: meal.status,
          isLocked: meal.isLocked,
          createdAt: meal.createdAt
        }));
        setFilteredOrders(fetchedOrders);
        await fetchCostingData(date);
      }
    } catch (error) {
      console.error('Error fetching orders by date:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filter
  const applyFilter = async () => {
    if (filterDate) {
      await fetchOrdersByDate(filterDate);
      setFilterModalOpen(false);
    }
  };

  // Clear filter
  const clearFilter = () => {
    setFilterDate(null);
    setFilteredOrders(orders);
    setFilterModalOpen(false);
  };

  // Fetch costing data for a specific date
  const fetchCostingData = async (date: string) => {
    try {
      const response = await axiosSecure.get(`/meals/my-orders/date/${date}`);
      if (response.data.success) {
        const meals = response.data.data;
        const totalCost = meals.reduce((sum: number, meal: MealOrder) => sum + (meal.totalPrice || 0), 0);
        setCostingData(prev => ({
          ...prev,
          [date]: { meals, totalCost }
        }));
      }
    } catch (error) {
      console.error('Error fetching costing data:', error);
    }
  };

  // Fetch monthly summary
  const fetchMonthlySummary = async (month: number, year: number) => {
    try {
      const response = await axiosSecure.get(`/meals/my-summary?month=${month}&year=${year}`);
      if (response.data.success) {
        const data = response.data.data;
        setMonthlySummary({
          totalMeals: data.totalMeals,
          totalBreakfast: data.totalBreakfast,
          totalLunch: data.totalLunch,
          totalDinner: data.totalDinner,
          totalCost: data.totalCost,
          month: data.month,
          year: data.year,
          daysInMonth: data.daysInMonth,
          isPaid: data.isPaid
        });
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    }
  };

  // Create meal orders
  const createMealOrders = async (date: string, mealsToCreate: { mealType: MealType; quantity: number }[]) => {
    try {
      setIsSubmitting(true);
      const response = await axiosSecure.post('/meals/order', {
        mealDate: date,
        meals: mealsToCreate
      });

      if (response.data.success) {
        // Refresh all orders from backend
        await fetchAllOrders();
        return true;
      }
    } catch (error) {
      console.error('Error creating meal orders:', error);
      alert('অর্ডার তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update meal order quantity
  const updateMealOrder = async (mealId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await axiosSecure.patch(`/meals/order/${mealId}`, {
        quantity: newQuantity
      });

      if (response.data.success) {
        // Refresh all orders from backend
        await fetchAllOrders();
      }
    } catch (error) {
      console.error('Error updating meal order:', error);
      alert('অর্ডার আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleAddMeals = async () => {
    if (!selectedDate) return;

    const mealsToCreate: { mealType: MealType; quantity: number }[] = [];
    const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

    // Check existing orders for this date
    const existingMealsForDate = orders.filter(o => (o.date === selectedDate || o.mealDate === selectedDate));

    mealTypes.forEach(mealType => {
      const qty = mealQuantities[mealType];
      if (qty > 0) {
        const existingOrder = existingMealsForDate.find(o => o.mealType === mealType);
        
        if (!existingOrder) {
          mealsToCreate.push({ mealType, quantity: qty });
        }
      }
    });

    if (mealsToCreate.length > 0) {
      const success = await createMealOrders(selectedDate, mealsToCreate);
      if (success) {
        setSelectedDate(null);
        setCalendarOpen(false);
        setMealQuantities({ breakfast: 1, lunch: 1, dinner: 1 });
      }
    } else {
      alert('এই তারিখের জন্য সব meals ইতিমধ্যে অর্ডার করা আছে।');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    await updateMealOrder(id, quantity);
  };

  // Delete individual meal
  const deleteIndividualMeal = async (mealId: string, mealDate: string) => {
    if (!mealId) return;
    
    try {
      const response = await axiosSecure.delete(`/meals/order/${mealId}`);
      if (response.data.success) {
        // Refresh all orders from backend
        await fetchAllOrders();
        
        // If filter is active, refresh filtered data
        if (filterDate) {
          await fetchOrdersByDate(filterDate);
        }
        
        // Update costing data
        await fetchCostingData(mealDate);
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('অর্ডার ডিলিট করতে সমস্যা হয়েছে।');
    }
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

    filteredOrders.forEach(order => {
      const dateKey = order.date || order.mealDate || '';
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, { 
          date: dateKey, 
          meals: {},
          totalCost: 0
        });
      }
      const dayMeal = grouped.get(dateKey)!;
      dayMeal.meals[order.mealType] = order;
      
      // Add costing data if available
      if (costingData[dateKey]) {
        dayMeal.totalCost = costingData[dateKey].totalCost;
      }
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

  // Load data on mount
  useEffect(() => {
    fetchAllOrders();
    fetchMonthlySummary(selectedMonth, selectedYear);
  }, []);

  // Fetch monthly summary when month/year changes
  useEffect(() => {
    fetchMonthlySummary(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const renderCalendar = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-lg border border-gray-200 p-4 sm:p-6 shadow-xl w-full sm:w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">তারিখ নির্বাচন করুন ও অর্ডার করুন</h2>
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
              disabled={!selectedDate || isSubmitting}
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors text-sm sm:text-base"
            >
              {isSubmitting ? 'Adding...' : 'Add Meals'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFilterModal = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-lg border border-gray-200 p-4 sm:p-6 shadow-xl w-full sm:w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">তারিখ অনুযায়ী সর্ট করুন</h2>
            <button
              onClick={() => setFilterModalOpen(false)}
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
              const isSelected = filterDate === dateStr;

              return (
                <button
                  key={`day_${day}`}
                  onClick={() => handleFilterDateClick(day)}
                  className={`p-1 sm:p-2 text-xs sm:text-sm rounded transition-colors font-medium aspect-square flex items-center justify-center ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-gray-700 bg-gray-50 hover:bg-blue-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {filterDate && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Selected Date: <span className="text-blue-600">{new Date(filterDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </p>
            </div>
          )}

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={clearFilter}
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-semibold transition-colors text-sm sm:text-base"
            >
              Clear Filter
            </button>
            <button
              onClick={applyFilter}
              disabled={!filterDate}
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors text-sm sm:text-base"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    );
  };

  const groupedOrders = groupOrdersByDate();
  const status = getStatusByTime();

  // Generate month and year options
  const months = [
    { value: 1, label: 'জানুয়ারি' },
    { value: 2, label: 'ফেব্রুয়ারি' },
    { value: 3, label: 'মার্চ' },
    { value: 4, label: 'এপ্রিল' },
    { value: 5, label: 'মে' },
    { value: 6, label: 'জুন' },
    { value: 7, label: 'জুলাই' },
    { value: 8, label: 'আগস্ট' },
    { value: 9, label: 'সেপ্টেম্বর' },
    { value: 10, label: 'অক্টোবর' },
    { value: 11, label: 'নভেম্বর' },
    { value: 12, label: 'ডিসেম্বর' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">খাবার অর্ডার করুন </h1>
              <p className="text-xs sm:text-base text-gray-600 mt-1">আগামীকালকের খাবার আজই অর্ডার করুন রাত ১০টার  মধ্যে </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3 w-full">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-3 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">আপনার অর্ডার</h2>

                  <div className="flex items-center gap-2">
                    {/* Filter Button */}
                    <button
                      onClick={() => setFilterModalOpen(true)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium transition-colors text-xs sm:text-base whitespace-nowrap"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">সর্ট</span>
                    </button>

                    {/* Show active filter */}
                    {filterDate && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm">
                        <span>{new Date(filterDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <button
                          onClick={clearFilter}
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Add Button */}
                    {isCutoffPassed ? (
                      <button
                        onClick={() => setCalendarOpen(true)}
                        disabled
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors text-xs sm:text-base whitespace-nowrap opacity-50 cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">অ্যাড করুন</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCalendarOpen(true)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-xs sm:text-base whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">অ্যাড করুন</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {groupedOrders.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <Calendar className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-sm sm:text-base">এখনও কোনও অর্ডার নেই।</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">আপনার প্রথম খাবারের অর্ডার দিতে "অ্যাড করুন" এ ক্লিক করুন।</p>
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
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Total Cost</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
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
                                  <div className={`p-2 sm:p-3 rounded-lg border ${getMealColor(meal.mealType)} relative group`}>
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="text-base sm:text-lg">{getMealIcon(meal.mealType)}</span>
                                        <span className="capitalize font-medium text-gray-900 text-xs sm:text-sm">{mealType}</span>
                                      </div>
                                      {/* Individual Delete Button */}
                                      <button
                                        onClick={() => deleteIndividualMeal(meal._id || '', dayMeal.date)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                                        title="Delete this meal"
                                      >
                                        <Trash2 className="w-3 h-3 text-red-600" />
                                      </button>
                                    </div>
                                    {canEditOrder(dayMeal.date) && !isCutoffPassed ? (
                                      <div className="flex items-center justify-between gap-1 sm:gap-2 mt-2">
                                        <button
                                          onClick={() => updateQuantity(meal._id || '', meal.quantity - 1)}
                                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center font-semibold text-gray-900 text-xs sm:text-sm">{meal.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(meal._id || '', meal.quantity + 1)}
                                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="block font-semibold text-gray-900 text-xs sm:text-sm mt-2">Qty: {meal.quantity}</span>
                                    )}
                                    {meal.totalPrice && (
                                      <span className="block text-xs text-gray-600 mt-1">৳{meal.totalPrice}</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs sm:text-sm">—</span>
                                )}
                              </td>
                            );
                          })}

                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span className="font-bold text-gray-900 text-sm sm:text-base">
                              {dayMeal.totalCost ? `৳${dayMeal.totalCost}` : '—'}
                            </span>
                          </td>

                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${getStatusColor(status)}`}>
                              {status}
                            </span>
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
            {/* Monthly Summary Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-xs sm:text-base">মাসিক সামারি</h3>
              </div>

              {/* Month and Year Selector */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-2 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-2 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {monthlySummary ? (
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">মোট খরচ</p>
                    <p className="text-2xl font-bold text-blue-600">৳{monthlySummary.totalCost}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {monthlySummary.isPaid ? (
                        <span className="text-green-600 font-semibold">✓ পেইড</span>
                      ) : (
                        <span className="text-orange-600 font-semibold">অপেইড</span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <p className="text-xs text-gray-600">মোট খাবার</p>
                      <p className="text-lg font-bold text-gray-900">{monthlySummary.totalMeals}</p>
                    </div>
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <p className="text-xs text-gray-600">মাসের দিন</p>
                      <p className="text-lg font-bold text-gray-900">{monthlySummary.daysInMonth}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🌅</span>
                        <span className="text-xs text-gray-700">Breakfast</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{monthlySummary.totalBreakfast}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🍽️</span>
                        <span className="text-xs text-gray-700">Lunch</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{monthlySummary.totalLunch}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🌙</span>
                        <span className="text-xs text-gray-700">Dinner</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{monthlySummary.totalDinner}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500">কোন ডেটা পাওয়া যায়নি</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-xs sm:text-base">অর্ডারের নিয়ম</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">✓</span>
                  <span>প্রতিদিন একাধিক খাবার অর্ডার করুন</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">✓</span>
                  <span>অবস্থা: রাত ১০টার আগে অপেক্ষারত</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 flex-shrink-0">✓</span>
                  <span>অবস্থা: রাত ১০টার পরে অর্ডার নিশ্চিত হবে</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-600">বর্তমান সময়</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
              {!isCutoffPassed && (
                <p className="text-xs text-gray-500 mt-2">
                  সময় বাকি {Math.max(0, 22 - new Date().getHours())}h {Math.max(0, 60 - new Date().getMinutes())}m
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {calendarOpen && renderCalendar()}
      {filterModalOpen && renderFilterModal()}
    </div>
  );
}