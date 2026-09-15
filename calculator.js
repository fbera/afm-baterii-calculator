/* Ordinul 1.904/2026, anexa: art. 5, 6 and 19. */
function calculateProject({ capacity, total, ineligible, funding }) {
  const errors = [];
  if (![capacity, total, ineligible, funding].every(Number.isFinite)) {
    return { errors: ['Completează toate câmpurile cu numere valide.'] };
  }
  if (capacity < 10) errors.push('Capacitatea trebuie să fie de minimum 10 kWh.');
  if (total <= 0) errors.push('Valoarea proiectului trebuie să fie mai mare decât zero.');
  if (ineligible < 0 || ineligible > total) errors.push('Cheltuielile neeligibile trebuie să fie între zero și valoarea totală.');
  if (funding <= 0) errors.push('Finanțarea AFM trebuie să fie mai mare decât zero.');
  const limit = Math.max(0, Math.min(15000, total * 0.75, total - ineligible, capacity * 1500));
  if (funding > limit + 1e-8) errors.push('Finanțarea solicitată depășește limita calculată. Redu suma AFM.');
  if (errors.length) return { errors, limit };
  const own = total - funding;
  const ownScore = Math.min(50, 30 * own / funding);
  const capacityScore = Math.min(50, capacity * 2.5);
  return { errors, limit, own, ownPercent: 100 * own / total, ownScore, capacityScore, score: ownScore + capacityScore };
}

if (typeof module !== 'undefined') module.exports = { calculateProject };
