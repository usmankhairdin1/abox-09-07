/**
 * SCR_JET_PRODUCTS
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { toast } from "sonner";

import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { type SampleProductCatalog } from "@/lib/sample-data-ext";
import { makeProductKey, productStore, useProductState } from "@/lib/product-store";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/products")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_PRODUCTS.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_PRODUCTS.purpose }] }),
  component: Page,
});

const CATEGORIES = ["Health", "Ancillary", "Life", "Supplemental", "Group", "Senior"] as const;

function Page() {
  const { products } = useProductState();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Health");
  const [states, setStates] = useState("0");
  const [carriers, setCarriers] = useState("0");
  const [error, setError] = useState<string | null>(null);

  const create = () => {
    if (!name.trim()) {
      setError("Enter a product name.");
      return;
    }
    if (products.some((p) => p.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      setError("A product with that name already exists.");
      return;
    }
    productStore.addProduct({
      key: makeProductKey(name, products),
      name: name.trim(),
      category,
      version: "v0.1",
      states: Number(states) || 0,
      carriers: Number(carriers) || 0,
      live: false,
      owner: "JET Product",
    });
    toast.success(`${name.trim()} created as a draft product.`);
    setName(""); setCategory("Health"); setStates("0"); setCarriers("0");
    setError(null); setOpen(false);
  };

  const cols: Column<SampleProductCatalog>[] = [
    { key: "name", header: "Product", cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.category} · {r.owner}</p>
      </div>
    )},
    { key: "version", header: "Version", cell: (r) => <span className="tabular-nums text-xs">{r.version}</span> },
    { key: "states", header: "States", align: "right", cell: (r) => r.states },
    { key: "carriers", header: "Carriers", align: "right", cell: (r) => r.carriers },
    { key: "live", header: "Availability", cell: (r) => (
      <StatusBadge tone={r.live ? "sage" : "muted"}>{r.live ? "Live" : "Draft"}</StatusBadge>
    )},
    { key: "actions", header: "", align: "right", cell: (r) => (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => {
          productStore.updateProduct(r.key, { live: !r.live });
          toast.success(`${r.name} ${r.live ? "moved to draft" : "published"}.`);
        }}
      >
        {r.live ? "Unpublish" : "Publish"}
      </Button>
    )},
  ];

  return (
    <InternalShell workspace="jet" pageTitle="Product catalog" eyebrow="Catalog"
      actions={
        <Button className="rounded-full" onClick={() => setOpen(true)}>
          <Package className="h-4 w-4" /> New product
        </Button>
      }
    >
      <DataTable columns={cols} rows={products} getRowId={(r) => r.key} ariaLabel="Product catalog" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New product</DialogTitle>
            <DialogDescription>
              Creates a draft product in the JET catalog. Draft products are not offered in any marketplace until published.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="product-name">Product name</Label>
              <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dental — Premier" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="product-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="product-states">States</Label>
                <Input id="product-states" type="number" min={0} max={50} value={states} onChange={(e) => setStates(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-carriers">Carriers</Label>
                <Input id="product-carriers" type="number" min={0} value={carriers} onChange={(e) => setCarriers(e.target.value)} />
              </div>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="rounded-full" onClick={create}>Create product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </InternalShell>
  );
}
