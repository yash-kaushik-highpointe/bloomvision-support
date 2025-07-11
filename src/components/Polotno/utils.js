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

// Helper to recursively flatten all children (including nested groups)
const flattenChildren = (children) => {
  let result = [];
  for (const child of children) {
    if (child.type === "group" && Array.isArray(child.children)) {
      result = result.concat(flattenChildren(child.children));
    } else {
      result.push(child);
    }
  }
  return result;
};

export const getTemplatePayload = (store) => {
  const canvasData = store.toJSON();

  const {
    pages: [activePage],
    width: containerWidth,
    height: containerHeight,
  } = canvasData;

  const allChildren = flattenChildren(activePage.children);

  let indexCounter = 0;
  let metadata = {};

  for (const child of allChildren) {
    const { x, y, width, height, id } = child;
    let tempMetadata = { ...child.custom };

    if (positionCounter[tempMetadata.category])
      positionCounter[tempMetadata.category]++;
    else positionCounter[tempMetadata.category] = 1;

    tempMetadata.dimensions = getElementDimensionsInPercentage(
      width,
      height,
      containerWidth,
      containerHeight
    );

    tempMetadata.stack = getElementStack(tempMetadata.category, indexCounter);

    tempMetadata.position = getElementPosition(
      child,
      x,
      y,
      containerWidth,
      containerHeight
    );

    metadata[id] = tempMetadata;
    indexCounter++;
  }

  positionCounter = {};

  return { data: canvasData, metadata };
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
