import { useState } from "react";
import { useDispatch } from "react-redux";

import { reactivateAccount } from "../store/slices/customerSlice";

export default function ReactivateModal({ env, customerId, onClose }) {
  const dispatch = useDispatch();
  const [isReactivating, setIsReactivating] = useState(false);

  const handleReactivateAccount = () => {
    setIsReactivating(true);
    dispatch(
      reactivateAccount({
        env,
        organizationId: customerId,
      })
    )
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Reactivate Account</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restore full account access for this customer?
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
            disabled={isReactivating}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-500 disabled:opacity-50 flex items-center gap-2"
            onClick={handleReactivateAccount}
          >
            {isReactivating ? "Reactivating Account..." : "Reactivate Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
