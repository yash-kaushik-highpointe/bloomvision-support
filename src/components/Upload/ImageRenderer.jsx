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
  stem: SquareImage,
  bulk: SquareImage,
  frame: SquareImage,
  chair: SquareImage,
  filler: SquareImage,
  mandap: SquareImage,
  branch: SquareImage,
  chuppah: SquareImage,
  xlRound: SquareImage,
  container: SquareImage,
  largeRound: SquareImage,
  smallRound: SquareImage,
  mediumRound: SquareImage,
  bouquetCollar: SquareImage,
  largeContainer: SquareImage,
  smallContainer: SquareImage,

  vase: RectangleImage,
  ribbon: RectangleImage,
  pedestal: RectangleImage,
  lateral: RectangleImage,
  dancing: RectangleImage,
  drapping: RectangleImage,
  chandelier: RectangleImage,
  fabricDrape: RectangleImage,
  smallDancing: RectangleImage,
  xsContainer: RectangleImage,
  largeLateral: RectangleImage,
  largeDancing: RectangleImage,
  LargeDrapping: RectangleImage,
  longLowContainer: RectangleImage,
};

function ImageRenderer({ selectedCategory, ...rest }) {
  const ImageComponent = ImageComponents[selectedCategory] ?? NoCategoryImage;
  return (
    <div className="flex-1 flex items-center justify-center">
      <ImageComponent {...rest} />
    </div>
  );
}

export default ImageRenderer;
