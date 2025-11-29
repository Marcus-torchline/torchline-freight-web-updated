export interface ServiceDetails {
  pickupLocation: string;
  deliveryLocation: string;
  cubicFeet?: number;
  palletCount?: number;
  palletDimensions?: string;
  weight?: number;
  spaceInTruck?: string;
  timeline?: string;
}

export interface QuoteRequestData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  serviceDetails?: ServiceDetails;
  attachments?: FileAttachment[];
  status: string;
  submittedAt: string;
}

export interface FileAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}