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
  { value: "Revised", label: "Revised" },
  { value: "Implemented", label: "Implemented" },
];

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Bouquet", label: "Bouquet" },
  { value: "Ceremony", label: "Ceremony" },
  { value: "Centerpiece", label: "Centerpiece" },
  { value: "Installation", label: "Installation" },
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

export const FLOWER_DIMENSIONS = {
  bouquetCollar: 7, // 24
  bulk: 5,
  container: 12,
  dancing: 3,
  drapping: 3,
  filler: 3.5,
  frame: 96,
  largeContainer: 36,
  largeDrapping: 6,
  largeLateral: 12,
  largeRound: 5,
  lateral: 3,
  mediumRound: 3,
  pedestal: 15,
  ribbon: 6,
  smallDancing: 1,
  smallRound: 2,
  stem: 6,
  xlRound: 12, // 16
  vase: 24,
  smallContainer: 5,
  mandap: 144, // 180
  chuppah: 120, // 180
  fabricDrape: 36,
  chair: 42,
  chandelier: 20, // 36
  largeDancing: 8,
  longLowContainer: 4, // 12
  xsContainer: 2, // 1.5
  branch: 38,

  xsRound: 1,
  xsFiller: 1.5,
  smallFiller: 2.5,
  lowContainer: 8,
  wideLowContainer: 12,
  smallChandelier: 14,
  largeChandelier: 36,
};

export const VIEW_2_CATEGORIES = [
  "bouquetCollar",
  "largeRound",
  "mediumRound",
  "smallRound",
];
