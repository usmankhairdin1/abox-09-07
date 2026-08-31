/** Adapter module that exposes Lucie surface classification to reference-style consumers. */
export interface SurfaceClassification {
  route: string;
  name: string;
  klass: "m00-governance" | "lucie-business";
  note: string;
}

export const SURFACE_CLASSIFICATION: SurfaceClassification[] = [
  { route: "/app/jet/platform", name: "Platform Foundation (M00)", klass: "m00-governance", note: "Governed control surface. Publishes M00 registers; never re-authors them." },
  { route: "/lucie", name: "Lucie Traceability Spine", klass: "lucie-business", note: "Delivery spine and traceability dashboard for the Lucie slice." },
  { route: "/gov", name: "Governed Build Packet Viewer", klass: "lucie-business", note: "Reads machine-readable requirements and wireframes by module." },
];
