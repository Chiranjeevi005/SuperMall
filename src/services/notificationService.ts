// Notification service for handling in-app notifications

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();
    
    // Keep only the last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    
    return newNotification.id;
  }

  // Get all notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Mark a notification as read
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.notifyListeners();
  }

  // Remove a notification
  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Add listener for notification changes
  addListener(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
  }

  // Remove listener
  removeListener(listener: (notifications: Notification[]) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Notify all listeners of changes
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Simulate receiving real-time notifications
  simulateNotification() {
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error'];
    const titles = [
      'Order Update',
      'New Message',
      'Product Approved',
      'Payment Received',
      'Low Stock Alert'
    ];
    const messages = [
      'Your order #ORD-001 has been shipped',
      'You have a new message from a customer',
      'Your product "Organic Brown Rice" has been approved',
      'Payment of ₹2,450 received for order #ORD-001',
      'Low stock alert: Only 5 units left for "Handmade Pottery Set"'
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomIndex = Math.floor(Math.random() * titles.length);
    
    this.addNotification({
      title: titles[randomIndex],
      message: messages[randomIndex],
      type: randomType
    });
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

// Simulate periodic notifications for demo purposes
if (typeof window !== 'undefined') {
  setInterval(() => {
    // 30% chance of receiving a notification every 30 seconds
    if (Math.random() < 0.3) {
      notificationService.simulateNotification();
    }
  }, 30000);
}

export default notificationService;