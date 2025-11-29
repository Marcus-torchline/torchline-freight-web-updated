import axios from 'axios';

export interface DatabaseRecord {
  id: string;
  data: any;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface AnalyticsData {
  totalRecords: number;
  recordsByTag: Record<string, number>;
  recentActivity: Array<{
    action: string;
    timestamp: string;
    recordId: string;
    user: string;
  }>;
  performanceMetrics: {
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
  };
}

export class AdvancedDatabaseAPI {
  private baseURL: string;
  private userEmail: string;
  private apiKey: string;

  constructor(userEmail: string) {
    this.baseURL = 'https://api.blick.dev';
    this.userEmail = userEmail;
    this.apiKey = process.env.REACT_APP_BLICK_API_KEY || 'demo-key';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-User-Email': this.userEmail
    };
  }

  async createData(collection: string, data: any, tags: string[] = []): Promise<DatabaseRecord> {
    try {
      const response = await axios.post(
        `${this.baseURL}/collections/${collection}/records`,
        {
          data,
          tags,
          createdBy: this.userEmail
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating data:', error);
      throw new Error('Failed to create data');
    }
  }

  async readData(collection: string, options: QueryOptions = {}): Promise<DatabaseRecord[]> {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          params.append(`filter[${key}]`, value.toString());
        });
      }

      const response = await axios.get(
        `${this.baseURL}/collections/${collection}/records?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error reading data:', error);
      throw new Error('Failed to read data');
    }
  }

  async updateData(recordId: string, data: any, tags: string[] = []): Promise<DatabaseRecord> {
    try {
      const response = await axios.put(
        `${this.baseURL}/records/${recordId}`,
        {
          data,
          tags,
          updatedBy: this.userEmail
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw new Error('Failed to update data');
    }
  }

  async deleteData(recordId: string): Promise<boolean> {
    try {
      await axios.delete(
        `${this.baseURL}/records/${recordId}`,
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw new Error('Failed to delete data');
    }
  }

  async searchByTags(tags: string[], collection?: string): Promise<DatabaseRecord[]> {
    try {
      const params = new URLSearchParams();
      tags.forEach(tag => params.append('tags', tag));
      if (collection) params.append('collection', collection);

      const response = await axios.get(
        `${this.baseURL}/search/tags?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching by tags:', error);
      throw new Error('Failed to search by tags');
    }
  }

  async fullTextSearch(query: string, collection?: string): Promise<DatabaseRecord[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (collection) params.append('collection', collection);

      const response = await axios.get(
        `${this.baseURL}/search/text?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error performing full-text search:', error);
      throw new Error('Failed to perform full-text search');
    }
  }

  async getAnalytics(collection?: string): Promise<AnalyticsData> {
    try {
      const params = collection ? `?collection=${collection}` : '';
      const response = await axios.get(
        `${this.baseURL}/analytics${params}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw new Error('Failed to get analytics');
    }
  }

  async bulkCreate(collection: string, records: Array<{ data: any; tags: string[] }>): Promise<DatabaseRecord[]> {
    try {
      const response = await axios.post(
        `${this.baseURL}/collections/${collection}/bulk`,
        {
          records: records.map(record => ({
            ...record,
            createdBy: this.userEmail
          }))
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error bulk creating data:', error);
      throw new Error('Failed to bulk create data');
    }
  }

  async bulkUpdate(updates: Array<{ id: string; data: any; tags?: string[] }>): Promise<DatabaseRecord[]> {
    try {
      const response = await axios.put(
        `${this.baseURL}/records/bulk`,
        {
          updates: updates.map(update => ({
            ...update,
            updatedBy: this.userEmail
          }))
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error bulk updating data:', error);
      throw new Error('Failed to bulk update data');
    }
  }

  async bulkDelete(recordIds: string[]): Promise<boolean> {
    try {
      await axios.delete(
        `${this.baseURL}/records/bulk`,
        {
          headers: this.getHeaders(),
          data: { recordIds }
        }
      );
      return true;
    } catch (error) {
      console.error('Error bulk deleting data:', error);
      throw new Error('Failed to bulk delete data');
    }
  }

  async exportData(collection: string, format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<Blob> {
    try {
      const response = await axios.get(
        `${this.baseURL}/collections/${collection}/export?format=${format}`,
        {
          headers: this.getHeaders(),
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  async importData(collection: string, file: File, options: { overwrite?: boolean; tags?: string[] } = {}): Promise<{ success: number; errors: number; details: any[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify({
        ...options,
        createdBy: this.userEmail
      }));

      const response = await axios.post(
        `${this.baseURL}/collections/${collection}/import`,
        formData,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  async createBackup(collections?: string[]): Promise<{ backupId: string; downloadUrl: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/backup`,
        {
          collections,
          createdBy: this.userEmail
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Failed to create backup');
    }
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    try {
      await axios.post(
        `${this.baseURL}/backup/${backupId}/restore`,
        { restoredBy: this.userEmail },
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw new Error('Failed to restore backup');
    }
  }

  async getCollections(): Promise<Array<{ name: string; recordCount: number; lastModified: string }>> {
    try {
      const response = await axios.get(
        `${this.baseURL}/collections`,
        { headers: this.getHeaders() }
      )
      return response.data;
    } catch (error) {
      console.error('Error getting collections:', error);
      throw new Error('Failed to get collections');
    }
  }

  async createCollection(name: string, schema?: any): Promise<{ name: string; created: boolean }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/collections`,
        {
          name,
          schema,
          createdBy: this.userEmail
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw new Error('Failed to create collection');
    }
  }

  async deleteCollection(name: string): Promise<boolean> {
    try {
      await axios.delete(
        `${this.baseURL}/collections/${name}`,
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw new Error('Failed to delete collection');
    }
  }

  async getQuotes(filters?: { status?: string; dateRange?: { start: string; end: string } }): Promise<DatabaseRecord[]> {
    return this.readData('quotes', {
      filters,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }

  async createQuote(quoteData: any): Promise<DatabaseRecord> {
    return this.createData('quotes', quoteData, ['quote', 'freight']);
  }

  async updateQuoteStatus(quoteId: string, status: string): Promise<DatabaseRecord> {
    return this.updateData(quoteId, { status, updatedAt: new Date().toISOString() }, ['quote', 'status-update']);
  }

  async getShipments(filters?: { status?: string; customerId?: string }): Promise<DatabaseRecord[]> {
    return this.readData('shipments', {
      filters,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }

  async createShipment(shipmentData: any): Promise<DatabaseRecord> {
    return this.createData('shipments', shipmentData, ['shipment', 'freight']);
  }

  async updateShipmentStatus(shipmentId: string, status: string, location?: string): Promise<DatabaseRecord> {
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
      ...(location && { currentLocation: location })
    };
    return this.updateData(shipmentId, updateData, ['shipment', 'tracking-update']);
  }

  async getCustomers(searchTerm?: string): Promise<DatabaseRecord[]> {
    if (searchTerm) {
      return this.fullTextSearch(searchTerm, 'customers');
    }
    return this.readData('customers', {
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }

  async createCustomer(customerData: any): Promise<DatabaseRecord> {
    return this.createData('customers', customerData, ['customer', 'contact']);
  }

  async updateCustomer(customerId: string, customerData: any): Promise<DatabaseRecord> {
    return this.updateData(customerId, customerData, ['customer', 'contact']);
  }

  async getVendors(searchTerm?: string): Promise<DatabaseRecord[]> {
    if (searchTerm) {
      return this.fullTextSearch(searchTerm, 'vendors');
    }
    return this.readData('vendors', {
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }

  async createVendor(vendorData: any): Promise<DatabaseRecord> {
    return this.createData('vendors', vendorData, ['vendor', 'supplier']);
  }

  async updateVendor(vendorId: string, vendorData: any): Promise<DatabaseRecord> {
    return this.updateData(vendorId, vendorData, ['vendor', 'supplier']);
  }

  async getReports(type?: string): Promise<DatabaseRecord[]> {
    const filters = type ? { type } : undefined;
    return this.readData('reports', {
      filters,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }

  async generateReport(reportData: any): Promise<DatabaseRecord> {
    return this.createData('reports', {
      ...reportData,
      generatedAt: new Date().toISOString(),
      generatedBy: this.userEmail
    }, ['report', reportData.type || 'general']);
  }

  async getDocuments(entityId?: string, entityType?: string): Promise<DatabaseRecord[]> {
    const filters: any = {};
    if (entityId) filters.entityId = entityId;
    if (entityType) filters.entityType = entityType;
    
    return this.readData('documents', {
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }

  async uploadDocument(documentData: any, file?: File): Promise<DatabaseRecord> {
    if (file) {
      // In a real implementation, you would upload the file to a storage service
      // and store the URL in the document data
      documentData.fileUrl = `https://storage.example.com/documents/${file.name}`;
      documentData.fileName = file.name;
      documentData.fileSize = file.size;
      documentData.mimeType = file.type;
    }
    
    return this.createData('documents', documentData, ['document', documentData.type || 'general']);
  }

  async getNotifications(userId?: string): Promise<DatabaseRecord[]> {
    const filters = userId ? { userId } : undefined;
    return this.readData('notifications', {
      filters,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 50
    });
  }

  async createNotification(notificationData: any): Promise<DatabaseRecord> {
    return this.createData('notifications', {
      ...notificationData,
      createdAt: new Date().toISOString(),
      read: false
    }, ['notification', notificationData.type || 'general']);
  }

  async markNotificationAsRead(notificationId: string): Promise<DatabaseRecord> {
    return this.updateData(notificationId, {
      read: true,
      readAt: new Date().toISOString()
    }, ['notification', 'read']);
  }

  async getDashboardMetrics(): Promise<any> {
    try {
      // This would typically aggregate data from multiple collections
      const [shipments, customers, vendors, revenue] = await Promise.all([
        this.readData('shipments', { limit: 1000 }),
        this.readData('customers'),
        this.readData('vendors'),
        this.readData('financial_records', { filters: { type: 'revenue' } })
      ]);

      return {
        totalShipments: shipments.length,
        activeShipments: shipments.filter(s => s.data.status === 'in_transit').length,
        totalCustomers: customers.length,
        totalVendors: vendors.length,
        totalRevenue: revenue.reduce((sum, r) => sum + (r.data.amount || 0), 0),
        recentShipments: shipments.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw new Error('Failed to get dashboard metrics');
    }
  }
}

export default AdvancedDatabaseAPI;