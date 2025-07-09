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

export const None = () => null;

export const TOOLBAR_COMPONENTS = {
  // Hide all text controls
  TextFontFamily: None,
  TextFontSize: None,
  TextFontVariant: None,
  TextFilters: None,
  TextFill: None,
  TextSpacing: None,
  TextAnimations: None,
  TextAiWrite: None,

  // Hide most image controls, keep only flip
  ImageFilters: None,
  ImageCrop: None,
  ImageClip: None,
  ImageRemoveBackground: None,
  ImageAnimations: None,

  // Hide SVG controls except flip
  SvgFilters: None,
  SvgColors: None,
  SvgAnimations: None,

  // Hide line controls
  LineSettings: None,
  LineColor: None,
  LineHeads: None,
  LineAnimations: None,

  // Hide figure controls
  FigureFill: None,
  FigureStroke: None,
  FigureSettings: None,
  FigureFilters: None,
  FigureAnimations: None,

  // Hide video controls
  VideoTrim: None,
  VideoAnimations: None,

  // Hide other controls
  ManyAnimations: None,
  PageDuration: None,
  PageBackground: None,
  Opacity: None,
  CopyStyle: None,
};
