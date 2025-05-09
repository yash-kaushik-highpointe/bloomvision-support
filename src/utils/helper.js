import colorMatch from "../data/colorMatch.json";

export function transformFlowerData(apiResponse) {
  if (!apiResponse) return;

  const roundCategories = ["largeRound", "mediumRound", "smallRound"];

  return apiResponse.flatMap((flower) => {
    const { category, name, color, image_detail, id } = flower;
    const imageDetails = Object.values(image_detail || {});

    // Check for missing views
    let dirtyMessage = "";
    if (roundCategories.includes(category)) {
      const hasView1 = imageDetails.some(
        (detail) => detail.view_angle === "view_1"
      );
      const hasView2 = imageDetails.some(
        (detail) => detail.view_angle === "view_2"
      );
      const messages = [];
      if (!hasView1) messages.push("View 1 missing");
      if (!hasView2) messages.push("View 2 missing");
      dirtyMessage = messages.join(", ");
    }

    return imageDetails.map((detail) => ({
      name,
      color,
      dirtyMessage,
      flowerId: id,
      id: detail.id,
      image: detail.image,
      view: detail.view_angle,
    }));
  });
}

export function parseFileName(fileName) {
  // Split the filename by underscore
  const parts = fileName.split("_");

  // Check if the filename follows the expected structure
  if (parts.length !== 4) {
    return { name: "", color: "", category: "" };
  }

  const [name, color, category, view] = parts;

  // Check if it's view2, if so return null
  if (view.includes("view2")) {
    return null;
  }

  // Transform name: replace '+' with space
  const transformedName = name
    .replace(/\+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  // Transform category: handle round categories
  let transformedCategory = category;
  if (category === "large+round") transformedCategory = "largeRound";
  else if (category === "medium+round") transformedCategory = "mediumRound";
  else if (category === "small+round") transformedCategory = "smallRound";

  return {
    name: transformedName,
    color: colorMatch[color] ?? "",
    category: transformedCategory,
  };
}
