/**
 * SCR-M04-018 — Marketplace Preview.
 * Private language, device, channel, product, participant, referral and
 * scenario preview (REQ-M04-BRD-020 / REQ-M04-ADM-008/009).
 * Nonproduction: renders draft (or active) brand/content, creates no
 * business record.
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Monitor, Tablet, Smartphone } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { useOrgState, getOrganization } from "@/lib/org-store";
import {
  useMarketplaceState, getActiveBrand, getDraftBrand, getActiveContent, getDraftContent,
  getParticipants, getAvailability, CHANNEL_LABEL, type MarketplaceChannel,
} from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/preview")({
  head: () => ({ meta: [{ title: "Marketplace Preview — ABox" }, { name: "description", content: "Private language, device, channel, product, participant, referral and scenario preview." }] }),
  component: Page,
});

const DEVICES = [
  { key: "desktop", label: "Desktop", width: "100%", icon: Monitor },
  { key: "tablet", label: "Tablet", width: "480px", icon: Tablet },
  { key: "mobile", label: "Mobile", width: "320px", icon: Smartphone },
] as const;

function Page() {
  const org = useOrgState();
  const mkt = useMarketplaceState();
  const brand = getDraftBrand(mkt) ?? getActiveBrand(mkt);
  const content = getDraftContent(mkt) ?? getActiveContent(mkt);
  const availability = getAvailability(mkt).filter((a) => a.status === "ENABLED");
  const participants = getParticipants(mkt).filter((p) => p.participation_state === "ENABLED");

  const [lang, setLang] = useState<"EN" | "ES">("EN");
  const [device, setDevice] = useState<(typeof DEVICES)[number]["key"]>("desktop");
  const [channel, setChannel] = useState<MarketplaceChannel>("CONSUMER_DIRECT");
  const [entry, setEntry] = useState<"normal" | "referral">("normal");
  const [participantId, setParticipantId] = useState(participants[0]?.participant_id ?? "");

  if (!brand || !content) return null;
  const entryOrg = entry === "referral" ? getOrganization(org, participants.find((p) => p.participant_id === participantId)?.organization_id ?? "") : undefined;
  const deviceMeta = DEVICES.find((d) => d.key === device)!;

  return (
    <InternalShell workspace="agency" pageTitle="Marketplace preview" eyebrow="Marketplace Preview · SCR-M04-018">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-border p-1">
          {(["EN", "ES"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`rounded-full px-3 py-1 text-xs font-medium ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{l === "EN" ? "English" : "Español"}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border p-1">
          {DEVICES.map((d) => (
            <button key={d.key} onClick={() => setDevice(d.key)} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${device === d.key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><d.icon className="h-3.5 w-3.5" /> {d.label}</button>
          ))}
        </div>
        <select value={channel} onChange={(e) => setChannel(e.target.value as MarketplaceChannel)} className="h-8 rounded-full border border-border bg-card px-3 text-xs">
          {(["CONSUMER_DIRECT", "AGENT", "EMPLOYER"] as MarketplaceChannel[]).map((c) => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
        </select>
        <select value={entry} onChange={(e) => setEntry(e.target.value as typeof entry)} className="h-8 rounded-full border border-border bg-card px-3 text-xs">
          <option value="normal">Normal entry (root)</option>
          <option value="referral">Downline referral entry</option>
        </select>
        {entry === "referral" && (
          <select value={participantId} onChange={(e) => setParticipantId(e.target.value)} className="h-8 rounded-full border border-border bg-card px-3 text-xs">
            {participants.map((p) => <option key={p.participant_id} value={p.participant_id}>{getOrganization(org, p.organization_id)?.display_name}</option>)}
          </select>
        )}
      </div>

      <StatusBadge tone="warning"><Eye className="h-3 w-3" /> Preview — nonproduction, creates no records</StatusBadge>

      <div className="mt-4 flex justify-center">
        <div style={{ width: deviceMeta.width, maxWidth: "100%" }} className="overflow-hidden rounded-2xl border border-hairline bg-card">
          <div className="p-6" style={{ background: brand.primary_color, color: "#fff" }}>
            <p className="text-xs opacity-80">{entryOrg ? `Entering via ${entryOrg.display_name}` : "Normal marketplace entry"}</p>
            <h2 className="mt-2 text-2xl font-semibold">{brand.display_name}</h2>
            <p className="mt-1 text-sm opacity-90">{lang === "EN" ? brand.headline_en : brand.headline_es}</p>
          </div>
          <div className="p-6 text-sm">
            <p className="text-muted-foreground">{lang === "EN" ? brand.intro_en : brand.intro_es}</p>
            <p className="mt-4 rounded-lg p-3" style={{ background: `${brand.accent_color}22` }}>{lang === "EN" ? content.channel_intro_en[channel] : content.channel_intro_es[channel]}</p>
            <p className="mt-4 text-eyebrow">Enabled pathways</p>
            <ul className="mt-2 space-y-1">
              {availability.filter((a) => a.channels.includes(channel)).map((a) => <li key={a.availability_entry_id}>• {a.product_line.replaceAll("_", " ")} ({a.state_code})</li>)}
              {availability.filter((a) => a.channels.includes(channel)).length === 0 && <li className="text-muted-foreground">No ready products for this channel.</li>}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">Support: {content.support_display_name} · {content.support_phone}</p>
          </div>
        </div>
      </div>
    </InternalShell>
  );
}
