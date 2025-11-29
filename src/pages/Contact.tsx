import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Upload, X, Plus, Minus } from "lucide-react";
import { DatabaseAPI } from "../services/databaseApi";
import { QuoteRequestData, ServiceDetails, FileAttachment } from "../types/QuoteRequest";
import { FileUploadService } from "../services/fileUploadService";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: ""
  });

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({
    pickupLocation: "",
    deliveryLocation: "",
    cubicFeet: undefined,
    palletCount: undefined,
    palletDimensions: "",
    weight: undefined,
    spaceInTruck: "",
    timeline: ""
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const dbApi = new DatabaseAPI("admin@torchlinegroup.com");
      
      const quoteData: QuoteRequestData = {
        ...formData,
        serviceDetails: showServiceDetails ? serviceDetails : undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
        status: "pending",
        submittedAt: new Date().toISOString()
      };

      const response = await dbApi.createData("quote_requests", quoteData, ["quote", "pending", formData.service]);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: ""
        });
        setServiceDetails({
          pickupLocation: "",
          deliveryLocation: "",
          cubicFeet: undefined,
          palletCount: undefined,
          palletDimensions: "",
          weight: undefined,
          spaceInTruck: "",
          timeline: ""
        });
        setAttachments([]);
        setShowServiceDetails(false);
      } else {
        setError(response.error || "Failed to submit quote request");
      }
    } catch (err) {
      setError("An error occurred while submitting the quote request");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setServiceDetails({
      ...serviceDetails,
      [e.target.name]: value
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = FileUploadService.validateFile(file);
        
        if (!validation.valid) {
          setError(validation.error || "Invalid file");
          continue;
        }

        const fileUrl = await FileUploadService.uploadFile(file);
        
        const attachment: FileAttachment = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: fileUrl,
          uploadedAt: new Date().toISOString()
        };

        setAttachments(prev => [...prev, attachment]);
      }
    } catch (err) {
      setError("Failed to upload file");
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-green-400 to-orange-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get in touch with our team for a customized logistics solution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <div className="inline-block p-4 bg-orange-500 bg-opacity-20 rounded-full mb-4">
              <Phone size={32} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-gray-400">+1 720-575-3331</p>
            <p className="text-gray-400">24/7 for customers</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <div className="inline-block p-4 bg-orange-500 bg-opacity-20 rounded-full mb-4">
              <Mail size={32} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-400">logistics@torchline.io</p>
            <p className="text-gray-400">24/7 Response</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <div className="inline-block p-4 bg-orange-500 bg-opacity-20 rounded-full mb-4">
              <MapPin size={32} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Service Areas</h3>
            <p className="text-gray-400">Supporting U.S.A., Canada, and areas of Mexico directly</p>
            <p className="text-gray-400 mt-2">Worldwide support through our partnerships</p>
          </div>
        </div>

        <div className="bg-slate-800 p-8 md:p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">Request a Quote</h2>
          
          {success && (
            <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
              Thank you for your quote request! We will contact you shortly with a detailed proposal.
            </div>
          )}
          
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                  placeholder="Your Company"
                />
              </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium mb-2">
                Service Interested In *
              </label>
              <select
                id="service"
                name="service"
                required
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              >
                <option value="">Select a service</option>
                <option value="air">Air Freight</option>
                <option value="ocean">Ocean Freight</option>
                <option value="ground">Ground Transportation</option>
                <option value="warehouse">Warehousing</option>
                <option value="customs">Customs Clearance</option>
                <option value="specialized">Specialized Cargo</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white resize-none"
                placeholder="Tell us about your shipping needs..."
              />
            </div>

            <div className="border-t border-slate-700 pt-6">
              <button
                type="button"
                onClick={() => setShowServiceDetails(!showServiceDetails)}
                className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors mb-4"
              >
                {showServiceDetails ? <Minus size={20} /> : <Plus size={20} />}
                <span className="font-semibold">Add Detailed Service Information</span>
              </button>

              {showServiceDetails && (
                <div className="bg-slate-700 p-6 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pickupLocation" className="block text-sm font-medium mb-2">
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        value={serviceDetails.pickupLocation}
                        onChange={handleServiceDetailsChange}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                        placeholder="City, State, ZIP"
                      />
                    </div>

                    <div>
                      <label htmlFor="deliveryLocation" className="block text-sm font-medium mb-2">
                        Delivery Location
                      </label>
                      <input
                        type="text"
                        id="deliveryLocation"
                        name="deliveryLocation"
                        value={serviceDetails.deliveryLocation}
                        onChange={handleServiceDetailsChange}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                        placeholder="City, State, ZIP"
                      />
                    </div>

                    <div>
                      <label htmlFor="cubicFeet" className="block text-sm font-medium mb-2">
                        Cubic Feet
                      </label>
                      <input
                        type="number"
                        id="cubicFeet"
                        name="cubicFeet"
                        value={serviceDetails.cubicFeet || ""}
                        onChange={handleServiceDetailsChange}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="palletCount" className="block text-sm font-medium mb-2">
                        Pallet Count
                      </label>
                      <input
                        type="number"
                        id="palletCount"
                        name="palletCount"
                        value={serviceDetails.palletCount || ""}
                        onChange={handleServiceDetailsChange}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="palletDimensions" className="block text-sm font-medium mb-2">
                        Pallet Dimensions
                      </label>
                      <input
                        type="text"
                        id="palletDimensions"
                        name="palletDimensions"
                        value={serviceDetails.palletDimensions}
                        onChange={handleServiceDetailsChange}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                        placeholder="48x40x48 inches"
                      />
                    </div>

                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium mb-2">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={serviceDetails.weight || ""}
                        onChange={handleServiceDetailsChange}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="spaceInTruck" className="block text-sm font-medium mb-2">
                        Space in Truck
                      </label>
                      <select
                        id="spaceInTruck"
                        name="spaceInTruck"
                        value={serviceDetails.spaceInTruck}
                        onChange={handleServiceDetailsChange}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                      >
                        <option value="">Select space needed</option>
                        <option value="full">Full Truckload (FTL)</option>
                        <option value="partial">Partial Truckload (PTL)</option>
                        <option value="ltl">Less Than Truckload (LTL)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium mb-2">
                        Shipping Timeline
                      </label>
                      <input
                        type="text"
                        id="timeline"
                        name="timeline"
                        value={serviceDetails.timeline}
                        onChange={handleServiceDetailsChange}
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                        placeholder="e.g., ASAP, 2-3 days, Next week"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-700 pt-6">
              <label className="block text-sm font-medium mb-4">
                Attach Documents (PDF or Images)
              </label>
              
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg cursor-pointer transition-colors">
                  <Upload size={20} />
                  <span>Upload Files</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingFile}
                  />
                </label>
                {uploadingFile && <span className="text-gray-400">Uploading...</span>}
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-orange-400">
                          {attachment.fileType.includes("pdf") ? "📄" : "🖼️"}
                        </div>
                        <div>
                          <p className="text-white text-sm">{attachment.fileName}</p>
                          <p className="text-gray-400 text-xs">
                            {FileUploadService.formatFileSize(attachment.fileSize)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-gray-400 text-xs mt-2">
                Maximum file size: 10MB. Accepted formats: PDF, JPG, PNG
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Submitting Quote Request...</span>
              ) : (
                <>
                  <span>Submit Quote Request</span>
                  <Send size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;