// Estimates tax from sales and a combined rate the owner types in.
// sales: dollars as text, like "1234.56". ratePercent: percent as text, like "8.0625".
// Returns the tax in dollars rounded to cents, or null if either input is empty or not usable.
// This does not subtract deductions, so it is an estimate only.
export function estimateTax(sales, ratePercent) {
  if (String(sales).trim() === '' || String(ratePercent).trim() === '') return null

  const salesNumber = Number(sales)
  const rateNumber = Number(ratePercent)
  if (Number.isNaN(salesNumber) || Number.isNaN(rateNumber)) return null
  if (salesNumber < 0 || rateNumber < 0 || rateNumber > 100) return null

  // sales * rate is the tax in cents (dollars x percent = cents), so we round it, then go back to dollars.
  return Math.round(salesNumber * rateNumber) / 100
}
