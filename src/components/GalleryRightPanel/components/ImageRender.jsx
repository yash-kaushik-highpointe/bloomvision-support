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
  frame: SquareImage,
  bulk: SquareImage,
  filler: SquareImage,
  largeRound: SquareImage,
  smallRound: SquareImage,
  mediumRound: SquareImage,
  bouquetCollar: SquareImage,
  container: SquareImage,
  largeContainer: SquareImage,
  smallContainer: SquareImage,
  mandap: SquareImage,
  chuppah: SquareImage,
  chair: SquareImage,

  urn: RectangleImage,
  vase: RectangleImage,
  stem: RectangleImage,
  ribbon: RectangleImage,
  pedestal: RectangleImage,
  lateral: RectangleImage,
  dancing: RectangleImage,
  drapping: RectangleImage,
  fabricDrape: RectangleImage,
  chandelier: RectangleImage,
  smallDancing: RectangleImage,
  largeLateral: RectangleImage,
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
