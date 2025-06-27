import axios from "axios";
import { transformFlowerData } from "../utils/helper";

const GalleryService = (baseURL) => ({
  getImagesByCategory: async (category) => {
    try {
      const response = await axios.get(`${baseURL}flowers/all/`, {
        params: {
          category,
          page: 1,
          page_size: 200,
        },
      });
      return transformFlowerData(response?.data?.results) ?? [];
    } catch (error) {
      console.error("Error fetching flower images:", error);
      throw error;
    }
  },
  updateImage: async (flowerId, data) => {
    try {
      let imageData = data.image;
      if (data.image.startsWith("data:image")) {
        const response = await fetch(data.image);
        imageData = await response.blob();
      }

      // Create FormData to handle multipart/form-data
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("color", data.color);
      formData.append("view", data.view);
      formData.append("image", imageData);

      const response = await axios.put(
        `${baseURL}flowers/update/${flowerId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  uploadDirtyView: async (flowerId, data) => {
    try {
      let imageData = data.image;
      if (data.image.startsWith("data:image")) {
        const response = await fetch(data.image);
        imageData = await response.blob();
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("color", data.color);
      formData.append("view", data.view);
      formData.append("image", imageData);
      formData.append("flower_id", flowerId);

      const response = await axios.post(
        `${baseURL}flowers/views/create/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  uploadImage: async (flowerData) => {
    try {
      let imageData = flowerData.image;
      if (flowerData.image.startsWith("data:image")) {
        const response = await fetch(flowerData.image);
        imageData = await response.blob();
      }

      const formData = new FormData();
      formData.append("name", flowerData.name);
      formData.append("color", flowerData.color);
      formData.append("category", flowerData.category);
      formData.append("description", flowerData.name);
      formData.append("image", imageData);

      const response = await axios.post(`${baseURL}flowers/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteImage: async (flowerId, substituteFlowerId) => {
    try {
      const response = await axios.delete(
        `${baseURL}flowers/delete/${flowerId}/?substitute_flower=${substituteFlowerId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
});

export default GalleryService;
