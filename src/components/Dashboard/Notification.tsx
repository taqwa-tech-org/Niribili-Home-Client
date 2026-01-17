import React, { useState } from 'react';
import { Bell, Clock, CreditCard, AlertCircle, CheckCircle, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'cutoff' | 'payment' | 'overdue' | 'restriction' | 'confirmation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'cutoff',
      title: 'Meal Order Cutoff Reminder',
      message: 'Your meal order for tomorrow closes in 2 hours. Place your order now to secure your meal.',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Due Reminder',
      message: 'Your payment of $150.00 is due on January 20, 2026. Please make the payment to avoid late fees.',
      timestamp: new Date(Date.now() - 1 * 60 * 60000),
      read: false,
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: '3',
      type: 'confirmation',
      title: 'Payment Confirmation',
      message: 'Your payment of $75.50 has been successfully processed. Transaction ID: #TXN2026001',
      timestamp: new Date(Date.now() - 3 * 60 * 60000),
      read: true,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: '4',
      type: 'overdue',
      title: 'Overdue Alert',
      message: 'You have an overdue payment from January 15, 2026. Please settle this immediately to avoid account restrictions.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000),
      read: true,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'bg-red-50 border-red-200'
    },
    {
      id: '5',
      type: 'restriction',
      title: 'Account Restriction Notice',
      message: 'Your account has been temporarily restricted due to pending payments. Contact support to resolve this issue.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000),
      read: true,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: '6',
      type: 'cutoff',
      title: 'Meal Order Cutoff Reminder',
      message: 'Your meal order for Friday closes in 4 hours. Place your order now.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000),
      read: true,
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-blue-50 border-blue-200'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getIconColor = (type: string) => {
    switch (type) {
      case 'cutoff':
        return 'text-blue-600';
      case 'payment':
        return 'text-yellow-600';
      case 'confirmation':
        return 'text-green-600';
      case 'overdue':
        return 'text-red-600';
      case 'restriction':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(notifs =>
      notifs.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifs => notifs.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-8 h-8 text-gray-800" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">Stay updated with important alerts</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notif => (
              <div
                key={notif.id}
                className={`${notif.color} border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 mt-1 ${getIconColor(notif.type)}`}>
                    {notif.icon}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatTime(notif.timestamp)}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}