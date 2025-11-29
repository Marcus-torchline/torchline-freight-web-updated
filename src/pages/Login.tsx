import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

type PortalType = "customer" | "employee" | "vendor";

interface DemoCredentials {
  email: string;
  password: string;
  name: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPortal, setSelectedPortal] = useState<PortalType>("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoCredentials: Record<PortalType, DemoCredentials> = {
    customer: {
      email: "customer@example.com",
      password: "customer123",
      name: "Customer Portal"
    },
    employee: {
      email: "employee@torchlinegroup.com",
      password: "employee123",
      name: "Employee Portal"
    },
    vendor: {
      email: "vendor@example.com",
      password: "vendor123",
      name: "Vendor Portal"
    }
  };

  const handlePortalSelect = (portal: PortalType) => {
    setSelectedPortal(portal);
    const credentials = demoCredentials[portal];
    setEmail(credentials.email);
    setPassword(credentials.password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img
              src="https://d13944qc8ujj2v.cloudfront.net/projects/690ace3d51c12d69d3a46ad2/uploads/upload_1762609015551_3237"
              alt="Torchline Freight Group Logo"
              className="h-80 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Customized Portal Login</h1>
          <p className="text-gray-400">Select your portal and sign in</p>
        </div>

        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Portal Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handlePortalSelect("customer")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  selectedPortal === "customer"
                    ? "border-orange-400 bg-orange-500 bg-opacity-10"
                    : "border-slate-600 bg-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="font-semibold text-white mb-1">Customer Portal</div>
                <div className="text-xs text-gray-400">Shipment tracking</div>
                {selectedPortal === "customer" && (
                  <div className="text-xs text-orange-400 mt-2">
                    Demo: {demoCredentials.customer.email}
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => handlePortalSelect("employee")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  selectedPortal === "employee"
                    ? "border-orange-400 bg-orange-500 bg-opacity-10"
                    : "border-slate-600 bg-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="font-semibold text-white mb-1">Employee Portal</div>
                <div className="text-xs text-gray-400">Staff access</div>
                {selectedPortal === "employee" && (
                  <div className="text-xs text-orange-400 mt-2">
                    Demo: {demoCredentials.employee.email}
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => handlePortalSelect("vendor")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  selectedPortal === "vendor"
                    ? "border-orange-400 bg-orange-500 bg-opacity-10"
                    : "border-slate-600 bg-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="font-semibold text-white mb-1">Vendor Portal</div>
                <div className="text-xs text-gray-400">Order management</div>
                {selectedPortal === "vendor" && (
                  <div className="text-xs text-orange-400 mt-2">
                    Demo: {demoCredentials.vendor.email}
                  </div>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In to {demoCredentials[selectedPortal].name}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <p className="text-gray-300 text-sm font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Customer: customer@example.com / customer123</p>
              <p>Employee: employee@torchlinegroup.com / employee123</p>
              <p>Vendor: vendor@example.com / vendor123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;