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
