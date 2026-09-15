/**
 * Single shopping product catalogue — shared by the landing hero chips,
 * the marketplace product switcher and the path-choice screen so the
 * available products never diverge between surfaces.
 */
import {
  Activity,
  Ambulance,
  BedDouble,
  Briefcase,
  Eye,
  HeartPulse,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Tooth } from "@/components/icons/tooth-icon";
import type { ProductType } from "./cart-store";

export interface ShopProduct {
  key: ProductType;
  label: string;
  /** Short label used in tight chip rows. */
  short: string;
  tagline: string;
  icon: LucideIcon;
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  { key: "ifp", label: "Health Insurance", short: "Health", tagline: "Individual & family plans", icon: HeartPulse },
  { key: "dental", label: "Dental", short: "Dental", tagline: "Preventive to comprehensive", icon: Smile },
  { key: "vision", label: "Vision", short: "Vision", tagline: "Exams, frames, contacts", icon: Eye },
  { key: "life", label: "Life", short: "Life", tagline: "Term life, simple to price", icon: Shield },
  { key: "critical", label: "Critical Illness", short: "Critical", tagline: "Cash benefit if diagnosed", icon: Activity },
  { key: "accident", label: "Accident", short: "Accident", tagline: "Injury protection", icon: Ambulance },
  { key: "hospital", label: "Hospital Indemnity", short: "Hospital", tagline: "Fixed daily benefit", icon: BedDouble },
  { key: "ichra", label: "ICHRA for Employers", short: "Employers", tagline: "Set an allowance — team picks", icon: Briefcase },
];

export function productIcon(key: string): LucideIcon {
  return SHOP_PRODUCTS.find((p) => p.key === key)?.icon ?? HeartPulse;
}
