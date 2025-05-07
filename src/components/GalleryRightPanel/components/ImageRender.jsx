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

const DrappingImage = ({ image, name }) => (
  <div className="w-[200px] h-[600px] flex items-center justify-center bg-[#e3e6d3] rounded-2xl shadow-md">
    <img
      src={image}
      alt={name}
      className="max-w-full max-h-full object-contain rounded-xl"
    />
  </div>
);

const LateralImage = ({ image, name }) => (
  <div className="w-[200px] h-[600px] flex items-center justify-center bg-[#e3e6d3] rounded-2xl shadow-md">
    <img
      src={image}
      alt={name}
      className="max-w-full max-h-full object-contain rounded-xl"
    />
  </div>
);

const DancingImage = ({ image, name }) => (
  <div className="w-[200px] h-[600px] flex items-center justify-center bg-[#e3e6d3] rounded-2xl shadow-md">
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
  vase: SquareImage,
  frame: SquareImage,
  filler: SquareImage,
  lateral: LateralImage,
  dancing: DancingImage,
  drapping: DrappingImage,
  largeRound: SquareImage,
  smallRound: SquareImage,
  mediumRound: SquareImage,
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
