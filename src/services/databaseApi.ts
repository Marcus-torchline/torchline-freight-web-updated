import axios from "axios";
import { DatabaseResponse, CreateDataRequest, ReadDataRequest, UpdateDataRequest, DeleteDataRequest } from "../types/Database";

const BASE_URL = "https://cloud.blick.run/api/project-db";
const PROJECT_ID = "pzzaqvsp-g2k6el9v-9z6jmdxq-uqdintf8";

export class DatabaseAPI {
  private projectId: string;
  private userEmail: string;

  constructor(userEmail: string) {
    this.projectId = PROJECT_ID;
    this.userEmail = userEmail;
  }

  async createData(collection: string, data: any, tags?: string[]): Promise<DatabaseResponse> {
    try {
      const request: CreateDataRequest = {
        projectId: this.projectId,
        collection,
        data,
        userEmail: this.userEmail,
        tags
      };
      const response = await axios.post(`${BASE_URL}/create`, request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create data"
      };
    }
  }

  async readData(collection?: string, id?: string, limit?: number, skip?: number): Promise<DatabaseResponse> {
    try {
      const params: ReadDataRequest = {
        projectId: this.projectId,
        userEmail: this.userEmail,
        collection,
        id,
        limit,
        skip
      };
      const response = await axios.get(`${BASE_URL}/read`, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to read data"
      };
    }
  }

  async updateData(id: string, data: any, tags?: string[], incrementVersion?: boolean): Promise<DatabaseResponse> {
    try {
      const request: UpdateDataRequest = {
        projectId: this.projectId,
        id,
        data,
        userEmail: this.userEmail,
        tags,
        incrementVersion
      };
      const response = await axios.put(`${BASE_URL}/update`, request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update data"
      };
    }
  }

  async deleteData(id: string, hardDelete?: boolean): Promise<DatabaseResponse> {
    try {
      const request: DeleteDataRequest = {
        projectId: this.projectId,
        id,
        userEmail: this.userEmail,
        hardDelete
      };
      const response = await axios.delete(`${BASE_URL}/delete`, { data: request });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete data"
      };
    }
  }

  async getCollections(): Promise<DatabaseResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/collections`, {
        params: {
          projectId: this.projectId,
          userEmail: this.userEmail
        }
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get collections"
      };
    }
  }

  async getStats(): Promise<DatabaseResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/stats`, {
        params: {
          projectId: this.projectId,
          userEmail: this.userEmail
        }
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get stats"
      };
    }
  }
}