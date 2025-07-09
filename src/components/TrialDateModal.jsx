import PropTypes from "prop-types";

const TrialDateModal = ({
  isOpen,
  onClose,
  onUpdate,
  isUpdating,
  newTrialDate,
  setNewTrialDate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Change Trial End Date</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Trial End Date
          </label>
          <input
            type="date"
            value={newTrialDate}
            onChange={(e) => setNewTrialDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min={new Date().toISOString().split("T")[0]}
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
            onClick={onUpdate}
            disabled={isUpdating}
            className="px-4 py-2 bg-[#7a7a3a] text-white rounded hover:bg-[#7a7a3a] disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

TrialDateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newTrialDate: PropTypes.string.isRequired,
  setNewTrialDate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
};

export default TrialDateModal;
