import React, { useState } from "react";
import { Download, Calendar } from "lucide-react";
import { AdvancedDatabaseAPI } from "../services/advancedDatabaseApi";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const ReportingSystem: React.FC = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState("analytics");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: "weekly",
    dayOfWeek: 1,
    time: "09:00",
    recipients: [user?.email || ""]
  });

  const generateReport = async () => {
    setLoading(true);
    const dbApi = new AdvancedDatabaseAPI(user?.email || "admin@torchlinegroup.com");
    
    const response = await dbApi.generateReport(
      `${reportType}_report`,
      reportType,
      { dateRange: "last_30_days" },
      user?.email || "admin@torchlinegroup.com",
      reportFormat
    );

    if (response.success && response.data) {
      if (reportFormat === "pdf") {
        generatePDFReport(response.data.data);
      } else if (reportFormat === "excel") {
        generateExcelReport(response.data.data);
      }
    }

    setLoading(false);
  };

  const generatePDFReport = (data: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Torchline Freight Group", 20, 20);
    doc.setFontSize(16);
    doc.text("Analytics Report", 20, 30);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
    
    doc.text(`Total Quotes: ${data.totalQuotes}`, 20, 60);
    doc.text(`Approved Quotes: ${data.approvedQuotes}`, 20, 70);
    doc.text(`Conversion Rate: ${data.conversionRate.toFixed(1)}%`, 20, 80);
    doc.text(`Average Quote Value: $${data.averageQuoteValue.toFixed(2)}`, 20, 90);
    
    doc.save("torchline_analytics_report.pdf");
  };

  const generateExcelReport = (data: any) => {
    const workbook = XLSX.utils.book_new();
    
    const summaryData = [
      ["Metric", "Value"],
      ["Total Quotes", data.totalQuotes],
      ["Approved Quotes", data.approvedQuotes],
      ["Rejected Quotes", data.rejectedQuotes],
      ["Pending Quotes", data.pendingQuotes],
      ["Conversion Rate", `${data.conversionRate.toFixed(1)}%`],
      ["Average Quote Value", `$${data.averageQuoteValue.toFixed(2)}`]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    
    if (data.topServices && data.topServices.length > 0) {
      const servicesSheet = XLSX.utils.json_to_sheet(data.topServices);
      XLSX.utils.book_append_sheet(workbook, servicesSheet, "Services");
    }
    
    if (data.customerMetrics && data.customerMetrics.length > 0) {
      const customersSheet = XLSX.utils.json_to_sheet(data.customerMetrics);
      XLSX.utils.book_append_sheet(workbook, customersSheet, "Customers");
    }
    
    XLSX.writeFile(workbook, "torchline_analytics_report.xlsx");
  };

  const scheduleReport = async () => {
    const dbApi = new AdvancedDatabaseAPI(user?.email || "admin@torchlinegroup.com");
    
    const reportConfig = {
      id: `scheduled_${Date.now()}`,
      name: `${reportType}_scheduled_report`,
      type: reportType,
      parameters: { dateRange: "last_30_days" },
      generatedAt: new Date().toISOString(),
      generatedBy: user?.email || "admin@torchlinegroup.com",
      format: reportFormat,
      data: {},
      scheduled: true,
      scheduleConfig
    };

    await dbApi.scheduleReport(reportConfig);
    alert("Report scheduled successfully!");
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Reporting System</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
          >
            <option value="analytics">Analytics Report</option>
            <option value="quotes">Quotes Report</option>
            <option value="customers">Customer Report</option>
            <option value="revenue">Revenue Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Export Format
          </label>
          <select
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>
      </div>

      <button
        onClick={generateReport}
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 mb-6 disabled:opacity-50"
      >
        <Download size={20} />
        <span>{loading ? "Generating Report..." : "Generate & Download Report"}</span>
      </button>

      <div className="border-t border-slate-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Schedule Automated Reports</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
              className="w-5 h-5 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
            />
            <span className="text-gray-300">Enable</span>
          </label>
        </div>

        {scheduleEnabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frequency
              </label>
              <select
                value={scheduleConfig.frequency}
                onChange={(e) => setScheduleConfig({ ...scheduleConfig, frequency: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {scheduleConfig.frequency === "weekly" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Day of Week
                </label>
                <select
                  value={scheduleConfig.dayOfWeek}
                  onChange={(e) => setScheduleConfig({ ...scheduleConfig, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                >
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={scheduleConfig.time}
                onChange={(e) => setScheduleConfig({ ...scheduleConfig, time: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              />
            </div>

            <button
              onClick={scheduleReport}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Calendar size={20} />
              <span>Schedule Report</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportingSystem;