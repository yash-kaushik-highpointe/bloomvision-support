import { useState } from "react";

export default function PasswordResetModal({ onClose }) {
  const [sending] = useState(false);

  const handleSendPasswordReset = async () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Password Reset</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send password reset email to customer?
          </label>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#7a7a3a] text-white rounded hover:bg-[#7a7a3a] disabled:opacity-50 flex items-center gap-2"
            onClick={handleSendPasswordReset}
          >
            {sending ? "Sending Email..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
