import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { impersonateUser } from "../store/slices/customerSlice";

const IMPERSONATE_REDIRECT_URL = (token) => {
  return {
    dev: `https://dev.mybloomvision.com/impersonate?token=${token}`,
    prod: `https://app.mybloomvision.com/impersonate?token=${token}`,
  };
};

export default function ImpersonateUserModal({ env, onClose, email }) {
  const dispatch = useDispatch();

  const [isImpersonating, setIsImpersonating] = useState(false);

  const handleImpersonateUser = async () => {
    setIsImpersonating(true);
    try {
      const { token } = await dispatch(
        impersonateUser({
          env,
          email,
        })
      ).unwrap();
      window.open(IMPERSONATE_REDIRECT_URL(token)[env], "_blank");
    } catch (err) {
      toast.error("Failed to impersonate user");
    } finally {
      setIsImpersonating(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Impersonate User</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Session as a Customer?
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
            onClick={handleImpersonateUser}
          >
            {isImpersonating ? "Starting Session..." : "Start Session"}
          </button>
        </div>
      </div>
    </div>
  );
}
