import * as svg from "polotno/utils/svg";
import GridSection from "./LeftPanel/GridSection";

import { FLOWER_DIMENSIONS } from "../../config/constants";

const POSITION_PREFIX = {
  frame: "fm",
  bulk: "b",
  filler: "f",
  container: "c",
  smallContainer: "sc",
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
  fabricDrape: "fd",
  chandelier: "ch",
  chair: "cr",
  mandap: "mp",
  chuppah: "cp",
  longLowContainer: "llc",
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

  return [...filteredSections, GridSection];
};

const SquareComponents = {
  frame: true,
  bulk: true,
  filler: true,
  chair: true,
  mandap: true,
  chuppah: true,
  container: true,
  largeRound: true,
  smallRound: true,
  mediumRound: true,
  bouquetCollar: true,
  smallContainer: true,
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
  fabricDrape: false,
  chandelier: false,
  longLowContainer: false,
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
    width: +((width / containerWidth) * 100).toFixed(4),
    height: +((height / containerHeight) * 100).toFixed(4),
  };
};

function unRotatedCords(image, angleDeg) {
  let { width, height, x, y } = image;
  let pivotX = width / 2;
  let pivotY = height / 2;

  const angleRad = (angleDeg * Math.PI) / 180;

  // Translate origin to pivot-relative
  const translatedX = -pivotX;
  const translatedY = -pivotY;

  // Apply rotation
  const rotatedX =
    translatedX * Math.cos(angleRad) - translatedY * Math.sin(angleRad);
  const rotatedY =
    translatedX * Math.sin(angleRad) + translatedY * Math.cos(angleRad);

  // Translate back
  const finalX = rotatedX + pivotX;
  const finalY = rotatedY + pivotY;

  return { unrotatedX: x - finalX, unrotatedY: y - finalY };
}

const getElementPosition = (child, containerWidth, containerHeight) => {
  const { unrotatedX, unrotatedY } = unRotatedCords(child, child.rotation);

  return {
    flipX: child.flipX,
    flipY: child.flipY,
    rotate: child.rotation,
    top: +((unrotatedY / containerHeight) * 100).toFixed(4),
    left: +((unrotatedX / containerWidth) * 100).toFixed(4),
  };
};

const flattenAndFilterChildren = (children) => {
  let result = [];
  for (const child of children) {
    if (child.type === "group" && Array.isArray(child.children)) {
      result = result.concat(flattenAndFilterChildren(child.children));
    } else if (child.type !== "svg" && child.name) {
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

  const allChildren = flattenAndFilterChildren(activePage.children);

  let indexCounter = 0;
  let metadata = {};

  for (const child of allChildren) {
    const { width, height, id } = child;
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
      containerWidth,
      containerHeight
    );

    metadata[id] = tempMetadata;
    indexCounter++;
  }

  positionCounter = {};

  return {
    metadata,
    data: {
      ...canvasData,
      pages: [
        {
          ...canvasData.pages[0],
          children: allChildren,
        },
      ],
    },
  };
};

export const getImagesByCategory = (store, category) => {
  const allImages = getAllImagesWithMetadata(store);
  return allImages.filter((image) => image.metadata.category === category);
};

export const getImagesByFlowerId = (store, flowerId) => {
  const allImages = getAllImagesWithMetadata(store);
  return allImages.filter((image) => image.metadata.flowerId === flowerId);
};

export const getElementDetails = (imageData, store, templateData, category) => {
  const { dimension } = templateData;

  let { color, flowerId, id, view, name, image } = imageData;
  // Calculate page dimensions
  const pageWidth = +store.width;
  const pageHeight = +store.height;

  let isSquareImage = SquareComponents[category];

  // Default image dimensions

  let tempDimension = FLOWER_DIMENSIONS[category];

  let imageWidth = (store.width * tempDimension) / dimension;
  let imageHeight =
    (store.height * tempDimension * (isSquareImage ? 1 : 3)) / dimension;

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

export function clearGrid(store) {
  const gridElements = store.activePage.children.filter(
    (child) => child.name === "grid"
  );
  const ids = gridElements.map((el) => el.id);
  store.deleteElements(ids);
}

export function generateGrid(store, rows, cols) {
  clearGrid(store);
  const { width, height } = store;
  const dx = width / cols;
  const dy = height / rows;

  // generate svg data for grid image
  const template = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    ${[...Array(cols - 1)]
      .map(
        (_, index) =>
          `<line x1="${dx * (index + 1)}" y1="0" x2="${
            dx * (index + 1)
          }" y2="${height}" stroke="blue" stroke-width="2"/>`
      )
      .join("")}
      ${[...Array(rows - 1)]
        .map(
          (_, index) =>
            `<line x1="0" y1="${dy * (index + 1)}" x2="${width}" y2="${
              dy * (index + 1)
            }" stroke="blue" stroke-width="2"/>`
        )
        .join("")}
  </svg>`;

  // add grid image into the page
  const url = svg.svgToURL(template);
  store.activePage.addElement({
    type: "svg",
    width,
    height,
    src: url,
    name: "grid",
    selectable: false,
    opacity: 0.2,
    alwaysOnTop: true,
  });
}
