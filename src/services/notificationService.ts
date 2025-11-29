import { AdvancedDatabaseAPI } from './advancedDatabaseApi';

export interface NotificationData {
  id: string;
  userId: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: any;
}

export class NotificationService {
  private dbApi: AdvancedDatabaseAPI;

  constructor(userEmail: string) {
    this.dbApi = new AdvancedDatabaseAPI(userEmail);
  }

  async createNotification(
    userId: string,
    type: 'success' | 'warning' | 'info' | 'error',
    title: string,
    message: string,
    actionUrl?: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      const notification: NotificationData = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl,
        metadata
      };

      const response = await this.dbApi.createData('notifications', notification, ['notification', type, 'unread']);
      return response.success;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }

  async createQuoteNotification(quoteId: string, customerEmail: string, status: string): Promise<boolean> {
    let title = '';
    let message = '';
    let type: 'success' | 'warning' | 'info' | 'error' = 'info';

    switch (status) {
      case 'approved':
        title = 'Quote Approved';
        message = 'Your quote request has been approved and is ready for processing.';
        type = 'success';
        break;
      case 'rejected':
        title = 'Quote Rejected';
        message = 'Your quote request has been rejected. Please contact us for more information.';
        type = 'error';
        break;
      case 'pending':
        title = 'Quote Received';
        message = 'We have received your quote request and are reviewing it.';
        type = 'info';
        break;
      default:
        title = 'Quote Updated';
        message = 'Your quote status has been updated.';
        type = 'info';
    }

    return await this.createNotification(
      customerEmail,
      type,
      title,
      message,
      `/quotes/${quoteId}`,
      { quoteId, status }
    );
  }

  async createShipmentNotification(trackingNumber: string, customerEmail: string, status: string, location?: string): Promise<boolean> {
    let title = '';
    let message = '';
    let type: 'success' | 'warning' | 'info' | 'error' = 'info';

    switch (status) {
      case 'picked-up':
        title = 'Shipment Picked Up';
        message = `Your shipment ${trackingNumber} has been picked up and is on its way.`;
        type = 'info';
        break;
      case 'in-transit':
        title = 'Shipment In Transit';
        message = `Your shipment ${trackingNumber} is currently in transit${location ? ` at ${location}` : ''}.`;
        type = 'info';
        break;
      case 'delivered':
        title = 'Shipment Delivered';
        message = `Your shipment ${trackingNumber} has been successfully delivered.`;
        type = 'success';
        break;
      case 'delayed':
        title = 'Shipment Delayed';
        message = `Your shipment ${trackingNumber} has been delayed. We will update you with new delivery information.`;
        type = 'warning';
        break;
      case 'exception':
        title = 'Shipment Exception';
        message = `There is an issue with your shipment ${trackingNumber}. Please contact customer service.`;
        type = 'error';
        break;
      default:
        title = 'Shipment Update';
        message = `Your shipment ${trackingNumber} status has been updated.`;
        type = 'info';
    }

    return await this.createNotification(
      customerEmail,
      type,
      title,
      message,
      `/tracking/${trackingNumber}`,
      { trackingNumber, status, location }
    );
  }

  async createSystemNotification(userId: string, title: string, message: string): Promise<boolean> {
    return await this.createNotification(
      userId,
      'info',
      title,
      message,
      undefined,
      { source: 'system' }
    );
  }

  async createWelcomeNotification(userId: string, userName: string): Promise<boolean> {
    return await this.createNotification(
      userId,
      'success',
      'Welcome to Torchline Freight Group!',
      `Welcome ${userName}! Your account has been successfully created. Explore our services and start shipping with confidence.`,
      '/services',
      { source: 'welcome' }
    );
  }

  async createMaintenanceNotification(userId: string): Promise<boolean> {
    return await this.createNotification(
      userId,
      'warning',
      'Scheduled Maintenance',
      'We will be performing scheduled maintenance tonight from 2:00 AM to 4:00 AM EST. Some services may be temporarily unavailable.',
      undefined,
      { source: 'maintenance' }
    );
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await this.dbApi.updateData(
        notificationId,
        { read: true },
        ['notification', 'read'],
        true
      );
      return response.success;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const response = await this.dbApi.readData('notifications', undefined, 100, 0);
      
      if (response.success && response.data) {
        const userNotifications = response.data.filter(
          (n: any) => n.data.userId === userId && !n.data.read
        );

        for (const notification of userNotifications) {
          await this.markAsRead(notification.id);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await this.dbApi.deleteData(notificationId, true);
      return response.success;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  async getNotifications(userId: string, limit: number = 20, skip: number = 0): Promise<NotificationData[]> {
    try {
      const response = await this.dbApi.readData('notifications', undefined, limit * 2, skip);
      
      if (response.success && response.data) {
        return response.data
          .filter((n: any) => n.data.userId === userId)
          .map((n: any) => n.data)
          .sort((a: NotificationData, b: NotificationData) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, limit);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getNotifications(userId, 100, 0);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Bulk notification methods for admin use
  async sendBulkNotification(
    userIds: string[],
    type: 'success' | 'warning' | 'info' | 'error',
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<boolean> {
    try {
      const promises = userIds.map(userId => 
        this.createNotification(userId, type, title, message, actionUrl)
      );
      
      const results = await Promise.all(promises);
      return results.every(result => result);
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      return false;
    }
  }

  async sendAnnouncementToAllUsers(
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<boolean> {
    try {
      // Get all users
      const usersResponse = await this.dbApi.readData('users', undefined, 1000, 0);
      
      if (usersResponse.success && usersResponse.data) {
        const userEmails = usersResponse.data.map((u: any) => u.data.email);
        return await this.sendBulkNotification(userEmails, 'info', title, message, actionUrl);
      }
      
      return false;
    } catch (error) {
      console.error('Error sending announcement:', error);
      return false;
    }
  }
}