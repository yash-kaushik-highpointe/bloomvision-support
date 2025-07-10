const POSITION_PREFIX = {
  frame: "fm",
  bulk: "b",
  filler: "f",
  container: "c",
  largeRound: "lr",
  smallRound: "sr",
  mediumRound: "mr",
  bouquetCollar: "bc",
  largeContainer: "lc",
  urn: "u",
  stem: "s",
  vase: "v",
  ribbon: "r",
  lateral: "l",
  dancing: "d",
  drapping: "dp",
  pedestal: "p",
  largeLateral: "ll",
  smallDancing: "sd",
  largeDrapping: "ld",
};

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

let positionCounter = {};

const getElementStack = (category, index) => {
  return {
    id: `${POSITION_PREFIX[category]}-${positionCounter[category]}`,
    zIndex: index + 1,
  };
};

const getElementDimensionsInPercentage = (
  width,
  height,
  containerWidth,
  containerHeight
) => {
  return {
    width: +((width / containerWidth) * 100).toFixed(2),
    height: +((height / containerHeight) * 100).toFixed(2),
  };
};

const getElementPosition = (
  child,
  elementX,
  elementY,
  containerWidth,
  containerHeight
) => {
  return {
    flipX: child.flipX,
    flipY: child.flipY,
    rotate: child.rotation,
    top: +((elementY / containerHeight) * 100).toFixed(2),
    left: +((elementX / containerWidth) * 100).toFixed(2),
  };
};

export const getTemplatePayload = (store, templateMetaData) => {
  const canvasData = store.toJSON();
  let tempTemplateMetaData = { ...templateMetaData };

  const {
    pages: [activePage],
    width: containerWidth,
    height: containerHeight,
  } = canvasData;

  const activeChildren = activePage.children;

  activeChildren.forEach((child, index) => {
    const { x, y, width, height, id } = child;

    let metadata = { ...tempTemplateMetaData[id] };

    if (positionCounter[metadata.category])
      positionCounter[metadata.category]++;
    else positionCounter[metadata.category] = 1;

    metadata.dimensions = getElementDimensionsInPercentage(
      width,
      height,
      containerWidth,
      containerHeight
    );

    metadata.stack = getElementStack(metadata.category, index);

    metadata.position = getElementPosition(
      child,
      x,
      y,
      containerWidth,
      containerHeight
    );

    tempTemplateMetaData[id] = metadata;
  });

  positionCounter = {};
  return { data: canvasData, metadata: tempTemplateMetaData };
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
    metadata: { color, flowerId, id, view, name, image, category },
  };
};
