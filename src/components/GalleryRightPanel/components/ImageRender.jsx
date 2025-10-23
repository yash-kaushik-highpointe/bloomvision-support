import { useDispatch } from "react-redux";
import React, { useState, useEffect, useRef } from "react";

import deleteIcon from "../../../assets/delete.svg";
import downloadIcon from "../../../assets/download.svg";
import GalleryService from "../../../services/flowerService";
import LoadingSpinner from "../../../components/LoadingSpinner";

import { CONFIG } from "../../../App";
import { getFlowerNameFromSrc } from "../../../utils/helper";
import { addVariant, deleteVariant } from "../../../store/slices/flowersSlice";

const SquareImage = ({ image, name }) => {
  return (
    <div className="w-[500px] h-[500px] flex items-center justify-center bg-[#e3e6d3] rounded-2xl shadow-md">
      <img
        src={image}
        alt={name}
        className="max-w-full max-h-full object-contain rounded-xl"
      />
    </div>
  );
};

const RectangleImage = ({ image, name }) => (
  <div className="w-[200px] h-[500px] flex items-center justify-center bg-[#e3e6d3] rounded-2xl shadow-md">
    <img
      src={image}
      alt={name}
      className="max-w-full max-h-full object-contain rounded-xl"
    />
  </div>
);

const NoCategoryImage = ({ image, name }) => (
  <div className="w-[500px] h-[500px] flex items-center justify-center">
    <img
      src={image}
      alt={name}
      className="max-w-full max-h-full object-contain rounded-xl"
    />
  </div>
);

const ImageComponents = {
  bulk: SquareImage,
  stem: SquareImage,
  chair: SquareImage,
  frame: SquareImage,
  filler: SquareImage,
  branch: SquareImage,
  mandap: SquareImage,
  chuppah: SquareImage,
  xlRound: SquareImage,
  container: SquareImage,
  largeRound: SquareImage,
  smallRound: SquareImage,
  mediumRound: SquareImage,
  bouquetCollar: SquareImage,
  largeContainer: SquareImage,
  smallContainer: SquareImage,

  xsRound: SquareImage,
  xsFiller: SquareImage,
  smallFiller: SquareImage,
  lowContainer: RectangleImage,
  wideLowContainer: RectangleImage,
  smallChandelier: RectangleImage,
  largeChandelier: RectangleImage,

  vase: RectangleImage,
  ribbon: RectangleImage,
  pedestal: RectangleImage,
  lateral: RectangleImage,
  dancing: RectangleImage,
  drapping: RectangleImage,
  chandelier: RectangleImage,
  fabricNGarland: RectangleImage,
  smallDancing: RectangleImage,
  xsContainer: RectangleImage,
  largeLateral: RectangleImage,
  largeDancing: RectangleImage,
  LargeDrapping: RectangleImage,
  longLowContainer: RectangleImage,
};

function ImageRenderer({ selectedCategory, variants, flowerId, env, ...rest }) {
  const addVariantRef = useRef(null);

  const dispatch = useDispatch();

  const [addVariantLoading, setAddVariantLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [isDeleteVisible, setIsDeleteVisible] = useState(variants.length > 1);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddVariant = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        setAddVariantLoading(true);

        let image = ev.target.result;
        let payload = { image, ...rest };
        let data = await GalleryService(CONFIG[env]).uploadDirtyView(
          flowerId,
          payload
        );
        dispatch(addVariant(data));
        setAddVariantLoading(false);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleDelete = async (variant) => {
    setIsDeleting(true);
    await GalleryService(CONFIG[env]).deleteVariant(variant.id, flowerId);
    dispatch(
      deleteVariant({
        category: selectedCategory,
        flowerId,
        id: variant.id,
        view: rest.view,
      })
    );
    setIsDeleting(false);
  };

  const handleDownload = (image, variantName) => {
    fetch(image)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${getFlowerNameFromSrc(image)}_${variantName}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  };

  useEffect(() => {
    setSelectedVariant(variants[variants.length - 1]);
    setIsDeleteVisible(variants.length > 1);
  }, [variants]);

  const ImageComponent = ImageComponents[selectedCategory] ?? NoCategoryImage;

  return (
    <div className="flex items-center justify-between flex-col pl-10 h-full">
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex h-full items-center justify-center">
        <ImageComponent image={selectedVariant.image} {...rest} />
      </div>

      {/* Variants List */}
      <div className="flex w-full items-center my-7 gap-10">
        {/* Scrollable variants list */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-0">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="flex flex-col items-center cursor-pointer w-[120px] h-[150px] relative flex-shrink-0"
                onClick={() => handleVariantClick(variant)}
              >
                <img
                  key={variant.id}
                  src={variant.image}
                  alt={variant.name}
                  className={`w-[120px] h-[120px] bg-[#e3e6d3] rounded-2xl shadow-md object-contain ${
                    selectedVariant.id === variant.id
                      ? "border-2 border-[#827a3a] shadow-lg"
                      : ""
                  }`}
                />
                <div className="text-sm font-300 mt-2 text-center text-[#827a3a] absolute top-[115px]">
                  Variant {index + 1}
                </div>
                <button
                  onClick={() =>
                    handleDownload(variant.image, `variant${index + 1}`)
                  }
                  className="absolute top-1 left-2 z-[9] w-[24px] h-[24px] p-1 rounded-full outline-none"
                >
                  <img
                    src={downloadIcon}
                    alt="download"
                    className="w-[13px] h-[13px]"
                  />
                </button>
                {isDeleteVisible && (
                  <button
                    onClick={() => handleDelete(variant)}
                    className="absolute top-1 right-1 z-[9] w-[24px] h-[24px] p-1 rounded-full outline-none"
                  >
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="w-[13px] h-[13px]"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Variant button - fixed at the end */}
        <div className="flex items-center cursor-pointer flex-shrink-0">
          <button
            disabled={addVariantLoading}
            onClick={() => addVariantRef.current.click()}
            className="flex items-center bg-[#827a3a] text-white px-4 py-2 rounded-lg"
          >
            Add Variant {addVariantLoading ? <LoadingSpinner /> : null}
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={addVariantRef}
            onChange={(e) => handleAddVariant(e)}
          />
        </div>
      </div>
    </div>
  );
}

export default ImageRenderer;
