/**
 * Shared currency presentation. Standard US formatting: `$#,##0.00`.
 */
const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `1250` → `$1,250.00` */
export function formatUSD(value: number): string {
  return USD.format(Number.isFinite(value) ? value : 0);
}

/** `1250` → `1,250.00` (for layouts that render the `$` separately). */
export function formatUSDAmount(value: number): string {
  return formatUSD(value).replace("$", "");
}
