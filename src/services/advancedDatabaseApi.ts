import { DatabaseAPI } from "./databaseApi";
import { QuoteApproval, PriceCalculation, FileMetadata, AnalyticsData, RealtimeUpdate, Message, ShipmentTracking, Report } from "../types/AdvancedFeatures";
import { DatabaseResponse } from "../types/Database";

export class AdvancedDatabaseAPI extends DatabaseAPI {
  async approveQuote(quoteId: string, approvedBy: string, priceCalculation: PriceCalculation): Promise<DatabaseResponse> {
    try {
      const approval: QuoteApproval = {
        id: `approval_${Date.now()}`,
        quoteId,
        status: "approved",
        approvedBy,
        approvedAt: new Date().toISOString(),
        version: 1,
        priceCalculation,
        emailNotifications: []
      };

      const response = await this.createData("quote_approvals", approval, ["approval", "approved"]);
      
      if (response.success) {
        await this.updateData(quoteId, { status: "approved", approvedAt: new Date().toISOString() }, ["quote", "approved"], true);
        await this.sendEmailNotification(quoteId, "approved", approvedBy);
      }

      return response;
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to approve quote" };
    }
  }

  async rejectQuote(quoteId: string, rejectedBy: string, reason: string): Promise<DatabaseResponse> {
    try {
      const approval: QuoteApproval = {
        id: `approval_${Date.now()}`,
        quoteId,
        status: "rejected",
        rejectedBy,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
        version: 1,
        priceCalculation: { basePrice: 0, additionalFees: [], discounts: [], totalPrice: 0, currency: "USD", calculatedAt: new Date().toISOString() },
        emailNotifications: []
      };

      const response = await this.createData("quote_approvals", approval, ["approval", "rejected"]);
      
      if (response.success) {
        await this.updateData(quoteId, { status: "rejected", rejectedAt: new Date().toISOString(), rejectionReason: reason }, ["quote", "rejected"], true);
        await this.sendEmailNotification(quoteId, "rejected", rejectedBy);
      }

      return response;
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to reject quote" };
    }
  }

  async calculatePrice(serviceType: string, details: any): Promise<PriceCalculation> {
    const basePrices: any = {
      "ocean": 1500,
      "air": 500,
      "ground": 300,
      "warehouse": 200,
      "customs": 150,
      "specialized": 1000
    };

    const basePrice = basePrices[serviceType] || 500;
    const additionalFees = [];
    const discounts = [];

    if (details.weight && details.weight > 1000) {
      additionalFees.push({ name: "Heavy Weight Fee", amount: 200, type: "weight" });
    }

    if (details.timeline === "ASAP") {
      additionalFees.push({ name: "Express Service", amount: 300, type: "express" });
    }

    if (details.palletCount && details.palletCount > 10) {
      discounts.push({ name: "Volume Discount", amount: 100, percentage: 5 });
    }

    const totalFees = additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0);
    const totalPrice = basePrice + totalFees - totalDiscounts;

    return {
      basePrice,
      additionalFees,
      discounts,
      totalPrice,
      currency: "USD",
      calculatedAt: new Date().toISOString()
    };
  }

  async sendEmailNotification(quoteId: string, status: string, actionBy: string): Promise<DatabaseResponse> {
    try {
      const notification = {
        quoteId,
        to: "customer@example.com",
        subject: `Quote ${status.toUpperCase()}`,
        body: `Your quote has been ${status} by ${actionBy}`,
        sentAt: new Date().toISOString(),
        status: "sent"
      };

      return await this.createData("email_notifications", notification, ["notification", status]);
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to send notification" };
    }
  }

  async uploadFileWithMetadata(file: File, category: string, uploadedBy: string, expiresInDays?: number): Promise<DatabaseResponse> {
    try {
      const fileUrl = await this.uploadFileToCloud(file);
      
      const metadata: FileMetadata = {
        id: `file_${Date.now()}`,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl,
        category,
        uploadedBy,
        uploadedAt: new Date().toISOString(),
        expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString() : undefined,
        tags: [category, file.type.split("/")[0]],
        previewUrl: file.type.startsWith("image") ? fileUrl : undefined
      };

      return await this.createData("file_metadata", metadata, ["file", category]);
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to upload file" };
    }
  }

  async uploadFileToCloud(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const quotesResponse = await this.readData("quote_requests", undefined, 1000, 0);
      const quotesData = quotesResponse.data || [];

      const totalQuotes = quotesData.length;
      const approvedQuotes = quotesData.filter((q: any) => q.data.status === "approved").length;
      const rejectedQuotes = quotesData.filter((q: any) => q.data.status === "rejected").length;
      const pendingQuotes = quotesData.filter((q: any) => q.data.status === "pending").length;
      const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;

      const serviceMetrics = this.calculateServiceMetrics(quotesData);
      const customerMetrics = this.calculateCustomerMetrics(quotesData);
      const revenueForecasting = this.calculateRevenueForecast(quotesData);

      return {
        conversionRate,
        totalQuotes,
        approvedQuotes,
        rejectedQuotes,
        pendingQuotes,
        averageQuoteValue: 1500,
        topServices: serviceMetrics,
        customerMetrics,
        revenueForecasting
      };
    } catch (error) {
      return {
        conversionRate: 0,
        totalQuotes: 0,
        approvedQuotes: 0,
        rejectedQuotes: 0,
        pendingQuotes: 0,
        averageQuoteValue: 0,
        topServices: [],
        customerMetrics: [],
        revenueForecasting: []
      };
    }
  }

  private calculateServiceMetrics(quotes: any[]): any[] {
    const services: any = {};
    
    quotes.forEach((quote: any) => {
      const service = quote.data.service;
      if (!services[service]) {
        services[service] = { quoteCount: 0, approved: 0, totalValue: 0 };
      }
      services[service].quoteCount++;
      if (quote.data.status === "approved") {
        services[service].approved++;
        services[service].totalValue += 1500;
      }
    });

    return Object.keys(services).map(key => ({
      serviceName: key,
      quoteCount: services[key].quoteCount,
      approvalRate: (services[key].approved / services[key].quoteCount) * 100,
      averageValue: services[key].totalValue / services[key].approved || 0
    }));
  }

  private calculateCustomerMetrics(quotes: any[]): any[] {
    const customers: any = {};
    
    quotes.forEach((quote: any) => {
      const email = quote.data.email;
      if (!customers[email]) {
        customers[email] = {
          customerId: email,
          customerName: quote.data.name,
          totalQuotes: 0,
          approvedQuotes: 0,
          totalRevenue: 0,
          lastActivity: quote.data.submittedAt
        };
      }
      customers[email].totalQuotes++;
      if (quote.data.status === "approved") {
        customers[email].approvedQuotes++;
        customers[email].totalRevenue += 1500;
      }
      if (new Date(quote.data.submittedAt) > new Date(customers[email].lastActivity)) {
        customers[email].lastActivity = quote.data.submittedAt;
      }
    });

    return Object.values(customers);
  }

  private calculateRevenueForecast(quotes: any[]): any[] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map(month => ({
      month,
      projected: Math.floor(Math.random() * 50000) + 30000,
      actual: Math.floor(Math.random() * 45000) + 25000,
      confidence: Math.floor(Math.random() * 20) + 80
    }));
  }

  async createRealtimeUpdate(type: string, data: any, userId: string): Promise<DatabaseResponse> {
    const update: RealtimeUpdate = {
      id: `update_${Date.now()}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      userId
    };

    return await this.createData("realtime_updates", update, ["realtime", type]);
  }

  async sendMessage(senderId: string, senderName: string, receiverId: string, content: string, attachments?: string[]): Promise<DatabaseResponse> {
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      attachments
    };

    return await this.createData("messages", message, ["message", "unread"]);
  }

  async updateShipmentTracking(trackingNumber: string, location: string, status: string, description: string): Promise<DatabaseResponse> {
    const trackingResponse = await this.readData("shipment_tracking", undefined, 1, 0);
    let tracking: ShipmentTracking;

    if (trackingResponse.success && trackingResponse.data && trackingResponse.data.length > 0) {
      tracking = trackingResponse.data[0].data;
      tracking.updates.push({
        location,
        status,
        timestamp: new Date().toISOString(),
        description
      });
      tracking.currentLocation = location;
      tracking.status = status;
    } else {
      tracking = {
        trackingNumber,
        status,
        currentLocation: location,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        updates: [{ location, status, timestamp: new Date().toISOString(), description }],
        realtime: true
      };
    }

    return await this.createData("shipment_tracking", tracking, ["tracking", status]);
  }

  async generateReport(name: string, type: string, parameters: any, generatedBy: string, format: string): Promise<DatabaseResponse> {
    const analyticsData = await this.getAnalytics();
    
    const report: Report = {
      id: `report_${Date.now()}`,
      name,
      type,
      parameters,
      generatedAt: new Date().toISOString(),
      generatedBy,
      format,
      data: analyticsData
    };

    return await this.createData("reports", report, ["report", type, format]);
  }

  async scheduleReport(reportConfig: Report): Promise<DatabaseResponse> {
    return await this.createData("scheduled_reports", reportConfig, ["scheduled", "report"]);
  }
}