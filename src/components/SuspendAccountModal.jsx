import { useState } from "react";
import Dropdown from "./Dropdown";
import { useDispatch } from "react-redux";

import { suspendAccount } from "../store/slices/customerSlice";

export default function SuspendAccountModal({ env, customerId, onClose }) {
  const dispatch = useDispatch();

  const [isSuspending, setIsSuspending] = useState(false);
  const [reason, setReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleChangeAdditionalNotes = (e) => {
    setAdditionalNotes(e.target.value);
  };

  const handleSelectReason = (reason) => {
    setReason(reason);
  };

  const handleSuspendAccount = () => {
    setIsSuspending(true);
    dispatch(
      suspendAccount({
        env,
        organizationId: customerId,
        reason,
        additionalNotes,
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
        <h2 className="text-xl font-semibold mb-4">Suspend Account</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason
          </label>
          <Dropdown
            placeholder="Select Reason for Suspension"
            options={[
              { label: "Payment Failed", id: "Payment Failed" },
              { label: "Terms Violation", id: "Terms Violation" },
              { label: "User Request", id: "User Request" },
              { label: "Other", id: "Other" },
            ]}
            value={reason}
            onChange={handleSelectReason}
            bgColor="#ffffff"
            border="1px solid #e5e7eb"
            borderRadius={6}
          />
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
            Additional Notes
          </label>
          <textarea
            rows={7}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter additional notes"
            value={additionalNotes}
            onChange={handleChangeAdditionalNotes}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={reason === "" || isSuspending}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-500 disabled:opacity-50 flex items-center gap-2"
            onClick={handleSuspendAccount}
          >
            {isSuspending ? "Suspending Account..." : "Suspend Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
