import axios from "axios";
import { transformFlowerData } from "../utils/helper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GalleryService = {
  getImagesByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_BASE_URL}flowers/all/`, {
        params: {
          category,
          page: 1,
          page_size: 100,
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
        `${API_BASE_URL}flowers/update/${flowerId}/`,
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
  uploadView2: async (flowerId, data) => {
    try {
      let imageData = data.image;
      if (data.image.startsWith("data:image")) {
        const response = await fetch(data.image);
        imageData = await response.blob();
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("color", data.color);
      formData.append("view", "view_2");
      formData.append("image", imageData);
      formData.append("flower_id", flowerId);

      const response = await axios.post(
        `${API_BASE_URL}flowers/views/create/`,
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

      const response = await axios.post(
        `${API_BASE_URL}flowers/create/`,
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
  deleteImage: async () => {},
};

export default GalleryService;
