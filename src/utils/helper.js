export function transformFlowerData(apiResponse) {
  if (!apiResponse) return;

  const roundCategories = ["largeRound", "mediumRound", "smallRound"];

  return apiResponse.flatMap((flower) => {
    const { category, name, color, image_detail } = flower;
    const imageDetails = Object.values(image_detail || {});
    const expectedViews = roundCategories.includes(category) ? 2 : 1;

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
      id: detail.id,
      image: detail.image,
      name,
      view: detail.view_angle,
      color,
      dirtyMessage,
    }));
  });
}
