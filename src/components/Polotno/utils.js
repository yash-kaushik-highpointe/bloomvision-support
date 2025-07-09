export const filterRightPanel = (sections) => {
  let filteredSections = sections.filter(
    ({ name }) =>
      name !== "size" &&
      name !== "text" &&
      name !== "elements" &&
      name !== "templates" &&
      name !== "background"
  );

  return filteredSections;
};

const SquareComponents = {
  frame: true,
  bulk: true,
  filler: true,
  container: true,
  largeRound: true,
  smallRound: true,
  mediumRound: true,
  bouquetCollar: true,
  largeContainer: true,
  urn: false,
  stem: false,
  vase: false,
  ribbon: false,
  lateral: false,
  dancing: false,
  drapping: false,
  pedestal: false,
  largeLateral: false,
  smallDancing: false,
  largeDrapping: false,
};

export const getPhotoStyles = (selectedCategory) => {
  if (SquareComponents[selectedCategory])
    return {
      width: "146px",
      height: "146px",
    };
  else
    return {
      width: "146px",
      height: "438px",
    };
};

export const getImageMetadata = (element) => {
  return element?.metadata || {};
};

export const getAllImagesWithMetadata = (store) => {
  const imageElements = store.pages.flatMap((page) =>
    page.children.filter((el) => el.type === "image")
  );

  return imageElements.map((image) => ({
    id: image.id,
    name: image.name,
    src: image.src,
    x: image.x,
    y: image.y,
    width: image.width,
    height: image.height,
    rotation: image.rotation,
    scaleX: image.scaleX,
    scaleY: image.scaleY,
    opacity: image.opacity,
    pageId: image.page?.id,
    metadata: getImageMetadata(image),
  }));
};

export const getImagesByCategory = (store, category) => {
  const allImages = getAllImagesWithMetadata(store);
  return allImages.filter((image) => image.metadata.category === category);
};

export const getImagesByFlowerId = (store, flowerId) => {
  const allImages = getAllImagesWithMetadata(store);
  return allImages.filter((image) => image.metadata.flowerId === flowerId);
};

export const getElementDetails = (imageData, store, category) => {
  let { color, flowerId, id, view, name, image } = imageData;
  // Calculate page dimensions
  const pageWidth = +store.width;
  const pageHeight = +store.height;

  // Default image dimensions
  let imageWidth = SquareComponents[category] ? 300 : 150;
  let imageHeight = SquareComponents[category] ? 300 : 400;

  // Calculate center position
  const x = (pageWidth - imageWidth) / 2;
  const y = (pageHeight - imageHeight) / 2;

  return {
    x,
    y,
    width: imageWidth,
    height: imageHeight,
    metadata: { color, flowerId, id, view, name, image },
  };
};
