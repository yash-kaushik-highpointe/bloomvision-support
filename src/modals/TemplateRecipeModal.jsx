import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "../components/Dialog";

function TemplateRecipeModal({ isOpen, onClose, data }) {
  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    console.log("confirm");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2xl bg-white"
        aria-describedby="recipe-modal"
      >
        <DialogHeader>
          <DialogTitle>{`${data?.name} Recipe`}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          <div className="flex justify-end gap-4 pt-4">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#7a7a3a] text-white rounded hover:bg-[#7a7a3a] disabled:opacity-50 flex items-center gap-2"
              onClick={handleConfirm}
            >
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateRecipeModal;
