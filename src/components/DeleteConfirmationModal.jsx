import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Select from "react-select";
import colors from "../data/colors.json";

const customStyles = {
  control: (provided) => ({
    ...provided,
    background: "#f8faf3",
    minHeight: 40,
    boxShadow: "none",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#e3e6d3"
      : state.isFocused
      ? "#f0f2ea"
      : "#fff",
    color: "#222",
    fontSize: 16,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10,
  }),
};

const DeleteConfirmationModal = ({
  images,
  onClose,
  onConfirm,
  selectedFlower,
}) => {
  // Filter view_1 images and create options for the dropdown
  const view1Images = images.filter(
    (img) =>
      img.view === "view_1" &&
      !img.dirtyMessage &&
      img.flowerId !== selectedFlower.flowerId
  );

  const options = view1Images.map((img) => {
    const colorLabel =
      colors.find((c) => c.id === img.color)?.label || img.color;

    return {
      value: img.flowerId,
      label: `${img.name} (${colorLabel})`,
    };
  });

  const [replacementFlower, setReplacementFlower] = useState(null);

  const handleReplacementFlowerChange = (data) => {
    setReplacementFlower(data);
  };

  const handleConfirm = () => {
    onConfirm(replacementFlower?.value);
    onClose();
  };

  const handleClose = () => {
    setReplacementFlower(null);
    onClose();
  };

  return (
    <Dialog open={true} onClose={handleClose} className="relative z-[9999]">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gray-500/75" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="flex flex-col items-center bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl w-full font-semibold mb-4 text-center">
            Confirm Delete
          </h2>

          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose replacement flower
            </label>
            <Select
              options={options}
              styles={customStyles}
              isSearchable={true}
              placeholder="Select a replacement flower..."
              value={replacementFlower}
              onChange={handleReplacementFlowerChange}
            />
          </div>

          <div className="flex justify-end space-x-3 w-full">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              disabled={!replacementFlower}
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
