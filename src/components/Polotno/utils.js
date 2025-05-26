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
  largeRound: true,
  smallRound: true,
  mediumRound: true,
  urn: false,
  vase: false,
  stem: false,
  ribbon: false,
  lateral: false,
  dancing: false,
  drapping: false,
  largeLateral: false,
  LargeDrapping: false,
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
