import { DatabaseAPI } from "../services/databaseApi";
import { User } from "../types/Database";

const seedDatabase = async () => {
  const adminEmail = "admin@torchlinegroup.com";
  const dbApi = new DatabaseAPI(adminEmail);

  console.log("Starting database seeding...");

  const users: User[] = [
    {
      email: "admin@torchlinegroup.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      portalType: "employee",
      company: "Torchline Freight Group",
      phone: "+1 720-575-3331",
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      email: "customer@example.com",
      password: "customer123",
      name: "John Customer",
      role: "customer",
      portalType: "customer",
      company: "ABC Corp",
      phone: "+1 555-123-4567",
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      email: "employee@torchlinegroup.com",
      password: "employee123",
      name: "Sarah Employee",
      role: "employee",
      portalType: "employee",
      company: "Torchline Freight Group",
      phone: "+1 720-575-3332",
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      email: "vendor@example.com",
      password: "vendor123",
      name: "Jane Vendor",
      role: "vendor",
      portalType: "vendor",
      company: "XYZ Logistics",
      phone: "+1 555-987-6543",
      status: "active",
      createdAt: new Date().toISOString()
    }
  ];

  for (const user of users) {
    await dbApi.createData("users", user, ["user", user.role, user.portalType]);
  }

  const services = [
    {
      title: "Ocean Freight",
      description: "Cost-effective sea freight solutions for large volume shipments",
      features: ["FCL & LCL options", "Port-to-Port & Door-to-Door", "Consolidation", "Container tracking"],
      icon: "ship",
      active: true,
      pricing: { base: 1500, perContainer: 2000 }
    },
    {
      title: "Air Freight",
      description: "Fast and reliable air cargo services for time-sensitive shipments",
      features: ["Express delivery", "Charter services", "Door-to-door", "Real-time tracking"],
      icon: "plane",
      active: true,
      pricing: { base: 500, perKg: 5 }
    },
    {
      title: "Ground Transportation",
      description: "Comprehensive road freight services across North America",
      features: ["FTL & LTL", "Cross-border", "Last-mile delivery", "Temperature controlled"],
      icon: "truck",
      active: true,
      pricing: { base: 300, perMile: 2 }
    },
    {
      title: "Warehousing",
      description: "Secure storage and distribution solutions",
      features: ["Climate controlled", "Pick & pack", "Inventory management", "Distribution"],
      icon: "warehouse",
      active: true,
      pricing: { base: 200, perPallet: 10 }
    },
    {
      title: "Customs Clearance",
      description: "Expert customs brokerage services",
      features: ["Documentation", "Duty calculation", "Compliance", "Fast processing"],
      icon: "filecheck",
      active: true,
      pricing: { base: 150, perShipment: 100 }
    },
    {
      title: "Specialized Cargo",
      description: "Handling of oversized, hazardous, and high-value cargo",
      features: ["Oversized freight", "Hazmat certified", "High-value goods", "Project cargo"],
      icon: "package",
      active: true,
      pricing: { base: 1000, custom: true }
    }
  ];

  for (const service of services) {
    await dbApi.createData("services", service, ["service", "active"]);
  }

  const sampleShipments = [
    {
      trackingNumber: "TFG123456789",
      customerEmail: "customer@example.com",
      customerName: "John Customer",
      origin: "New York, NY",
      destination: "Los Angeles, CA",
      status: "in-transit",
      service: "Ground Transportation",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      weight: 500,
      dimensions: "48x40x48",
      createdAt: new Date().toISOString()
    },
    {
      trackingNumber: "TFG987654321",
      customerEmail: "customer@example.com",
      customerName: "John Customer",
      origin: "Chicago, IL",
      destination: "Miami, FL",
      status: "delivered",
      service: "Air Freight",
      estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      weight: 200,
      dimensions: "24x20x20",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const shipment of sampleShipments) {
    await dbApi.createData("shipments", shipment, ["shipment", shipment.status]);
  }

  const sampleQuotes = [
    {
      name: "John Customer",
      email: "customer@example.com",
      phone: "+1 555-123-4567",
      company: "ABC Corp",
      service: "ocean",
      message: "Need to ship 5 containers from Shanghai to Los Angeles",
      status: "pending",
      submittedAt: new Date().toISOString(),
      serviceDetails: {
        pickupLocation: "Shanghai, China",
        deliveryLocation: "Los Angeles, CA",
        cubicFeet: 2000,
        palletCount: 20,
        weight: 10000,
        timeline: "2-3 weeks"
      }
    }
  ];

  for (const quote of sampleQuotes) {
    await dbApi.createData("quote_requests", quote, ["quote", "pending", quote.service]);
  }

  const sampleOrders = [
    {
      orderId: "ORD-001",
      vendorEmail: "vendor@example.com",
      vendorName: "Jane Vendor",
      customerName: "John Customer",
      customerEmail: "customer@example.com",
      service: "Air Freight",
      status: "active",
      amount: 1500,
      createdAt: new Date().toISOString()
    }
  ];

  for (const order of sampleOrders) {
    await dbApi.createData("vendor_orders", order, ["order", "active"]);
  }

  console.log("Database seeding completed successfully!");
  console.log("\nDemo credentials:");
  console.log("Customer Portal: customer@example.com / customer123");
  console.log("Employee Portal: employee@torchlinegroup.com / employee123");
  console.log("Vendor Portal: vendor@example.com / vendor123");
  console.log("Admin: admin@torchlinegroup.com / admin123");
};

seedDatabase();