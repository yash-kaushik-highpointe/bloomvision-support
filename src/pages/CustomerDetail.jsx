import {
  ExternalLink,
  DollarSign,
  Pause,
  RotateCcw,
  Info,
  User,
  Key,
  ShoppingBag,
  Calendar,
  Lock,
} from "lucide-react";

export default function CustomerDetail() {
  return (
    <div className="h-full pt-5 bg-transparent">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BloomVision</h1>
            <p className="text-sm text-gray-600 mt-1">
              Abigail Weaver • abigail@mybloomvision.com
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
              Active
            </button>
            <button className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex p-6 gap-6">
        {/* Left Panel - Customer Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-1/2">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Customer Name
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <p className="text-gray-900 mt-1">BloomVision</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <p className="text-gray-900 mt-1">Abigail Weaver</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 mt-1">abigail@mybloomvision.com</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="text-gray-900 mt-1">
                <p>123 Main Street</p>
                <p>Suite 100</p>
                <p>Anytown, ST 12345</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center text-gray-500">
                <ShoppingBag className="h-5 w-5 mr-2" />
                <span className="font-medium">Extend Trial</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Only available for trial accounts
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Payment Date
              </label>
              <div className="flex items-center mt-1">
                <span className="text-gray-900">2025-10-20</span>
                <Calendar className="h-4 w-4 ml-2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <Lock className="h-3 w-3 mr-1" />
              <span>
                All customer information is synced with Stripe. Use "View in
                Stripe" to make changes.
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-1/2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Account Actions
          </h3>

          <div className="space-y-3">
            {/* View in Stripe */}
            <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">View in Stripe</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </button>

            {/* Add Credit */}
            <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">Add Credit</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            {/* Suspend Account */}
            <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
              <div className="flex items-center">
                <Pause className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-900">Suspend Account</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            {/* Reactivate Account */}
            <div className="w-full p-3 text-left rounded-md bg-gray-50">
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-gray-300 mr-3" />
                <span className="text-gray-400">Reactivate Account</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-8">
                Only available for suspended accounts
              </p>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Support
            </h3>

            <div className="space-y-3">
              {/* Template Access */}
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">Template Access</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              {/* Impersonate User */}
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">Impersonate User</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              {/* Password Reset */}
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">Password Reset</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
