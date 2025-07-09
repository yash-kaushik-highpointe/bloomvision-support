export const ROUTES = {
  LOGIN: "/",
  ORGANISATIONS: "/organisations",
};

export const AUTH = {
  TOKEN_KEY: "auth_token",
};

export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
};

export const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "In Progress", label: "In Progress" },
  { value: "Ready for Dev", label: "Ready for Dev" },
  { value: "Implemented", label: "Implemented" },
];

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Bouquet", label: "Bouquet" },
  { value: "Centerpiece", label: "Centerpiece" },
  { value: "Ceremony", label: "Ceremony" },
];
