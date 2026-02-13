import {
  LayoutDashboard,
  GitBranch,
  CheckSquare,
  Palette,
  UserCircle,
  FileText,
  TrendingUp,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export type NavItem = {
  label: string;
  labelKo: string;
  path: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Dashboard",
    labelKo: "\uB300\uC2DC\uBCF4\uB4DC",
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Pipelines",
    labelKo: "\uD30C\uC774\uD504\uB77C\uC778",
    path: ROUTES.PIPELINES,
    icon: GitBranch,
  },
  {
    label: "Review",
    labelKo: "\uB9AC\uBDF0",
    path: ROUTES.REVIEW,
    icon: CheckSquare,
  },
  {
    label: "Styles",
    labelKo: "\uC2A4\uD0C0\uC77C",
    path: ROUTES.STYLES,
    icon: Palette,
  },
  {
    label: "Brands",
    labelKo: "\uBE0C\uB79C\uB4DC",
    path: ROUTES.BRANDS,
    icon: UserCircle,
  },
  {
    label: "Content",
    labelKo: "\uCF58\uD150\uCE20",
    path: ROUTES.CONTENT,
    icon: FileText,
  },
];

export const SECONDARY_NAV: NavItem[] = [
  {
    label: "Trends",
    labelKo: "\uD2B8\uB80C\uB4DC",
    path: ROUTES.TRENDS,
    icon: TrendingUp,
  },
  {
    label: "Settings",
    labelKo: "\uC124\uC815",
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
];
