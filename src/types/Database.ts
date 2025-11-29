export interface DatabaseResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export interface DatabaseItem {
  id: string;
  projectId: string;
  collection: string;
  data: any;
  metadata: {
    createdBy: string;
    updatedBy: string;
    tags: string[];
    version: number;
    isDeleted: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDataRequest {
  projectId: string;
  collection: string;
  data: any;
  userEmail: string;
  tags?: string[];
}

export interface ReadDataRequest {
  projectId: string;
  userEmail: string;
  collection?: string;
  id?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: number;
  tags?: string;
  search?: string;
}

export interface UpdateDataRequest {
  projectId: string;
  id: string;
  data: any;
  userEmail: string;
  tags?: string[];
  incrementVersion?: boolean;
}

export interface DeleteDataRequest {
  projectId: string;
  id: string;
  userEmail: string;
  hardDelete?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  submittedAt: string;
}

export interface ServiceData {
  title: string;
  description: string;
  features: string[];
  icon: string;
  active: boolean;
}

export interface CompanyInfo {
  name: string;
  description: string;
  stats: any;
  values: any[];
  history: string;
}

export interface User {
  id?: string;
  email: string;
  password: string;
  role: string;
  portalType: string;
  name: string;
  company?: string;
  phone?: string;
  address?: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}