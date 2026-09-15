const form = document.getElementById('calculator');
const number = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fields = ['capacity', 'total', 'ineligible', 'funding'];
const getValues = () => Object.fromEntries(fields.map(id => [id, document.getElementById(id).valueAsNumber]));
const setText = (id, text) => { document.getElementById(id).textContent = text; };

function update(event, selectOptimal = false) {
  const values = getValues();
  const slider = document.getElementById('funding');
  const ready = [values.capacity, values.total, values.ineligible].every(Number.isFinite) && values.capacity >= 10 && values.total > 0 && values.ineligible >= 0 && values.ineligible <= values.total;
  const limit = ready ? calculateProject({ ...values, funding: 1 }).limit : 0;
  const minimum = ready ? Math.ceil((values.total * 0.25 - 1e-8) * 100) / 100 : 0;
  const maximum = Math.floor((limit + 1e-8) * 100) / 100;
  const available = ready && maximum >= minimum;
  const optimal = Math.min(maximum, Math.floor((values.total * 0.375 + 1e-8) * 100) / 100);
  const marker = document.getElementById('optimal-marker');
  const optimalAvailable = available && optimal >= minimum;
  marker.hidden = !optimalAvailable;
  marker.style.left = `${maximum > minimum ? 100 * (optimal - minimum) / (maximum - minimum) : 0}%`;
  marker.title = `50 puncte pentru contribuție: AFM ${number.format(optimal)} lei`;
  document.getElementById('optimal').disabled = !optimalAvailable;
  setText('optimal', optimalAvailable ? `Selectează 50 puncte pentru contribuție · AFM ${number.format(optimal)} lei` : 'Pragul de punctaj maxim nu este disponibil.');
  if (selectOptimal && optimalAvailable) values.funding = optimal;
  const afmInput = document.getElementById('funding-amount');
  const ownInput = document.getElementById('split-own');
  const editing = event?.type === 'input' && [afmInput, ownInput].includes(event.target);
  if (event?.target === afmInput) values.funding = afmInput.valueAsNumber;
  if (event?.target === ownInput) values.funding = Math.round((values.total - ownInput.valueAsNumber) * 100) / 100;
  slider.disabled = !available;
  afmInput.disabled = !available;
  ownInput.disabled = !available;
  slider.min = available ? minimum : 0;
  slider.max = available ? maximum : 0;
  afmInput.min = minimum;
  afmInput.max = maximum;
  ownInput.min = ready ? Math.round((values.total - maximum) * 100) / 100 : 0;
  ownInput.max = ready ? Math.round((values.total - minimum) * 100) / 100 : 0;
  if (!editing && available) values.funding = Math.max(minimum, Math.min(Number.isFinite(values.funding) ? values.funding : minimum, maximum));
  if (Number.isFinite(values.funding)) slider.value = values.funding;
  const own = values.total - values.funding;
  if (!editing || event.target !== afmInput) afmInput.value = available && Number.isFinite(values.funding) ? values.funding : '';
  if (!editing || event.target !== ownInput) ownInput.value = available && Number.isFinite(own) ? Math.round(own * 100) / 100 : '';
  setText('funding-percent', ready ? `${number.format(100 * values.funding / values.total)}% din total` : '');
  setText('split-percent', ready ? `${number.format(100 * own / values.total)}% din total` : '');
  slider.setAttribute('aria-valuetext', ready ? `${number.format(values.funding)} lei AFM și ${number.format(own)} lei contribuție proprie` : 'Completează valorile proiectului');
  const result = calculateProject(values);
  if (ready && !available) result.errors.push('Plafonul AFM este sub 25% din total. Nu există o împărțire permisă de setarea calculatorului; ajustează proiectul.');
  else if (ready && values.funding < minimum) result.errors.push('Finanțarea AFM trebuie să fie de minimum 25% din total, conform setării calculatorului.');
  const valid = result.errors.length === 0;
  setText('limit', ready ? `Interval AFM: ${number.format(minimum)}–${number.format(maximum)} lei (minimum 25% din total).` : 'Completează valorile pentru a calcula limita AFM.');
  setText('score', valid ? number.format(result.score) : '—');
  setText('status', valid ? 'Punctaj calculat pentru valorile introduse.' : result.errors.join(' '));
  document.getElementById('status').classList.toggle('error', !valid);
  setText('own-score', valid ? `${number.format(result.ownScore)} / 50` : '—');
  setText('capacity-score', valid ? `${number.format(result.capacityScore)} / 50` : '—');
  document.getElementById('own-bar').value = valid ? result.ownScore : 0;
  document.getElementById('capacity-bar').value = valid ? result.capacityScore : 0;
  setText('own', valid ? `${number.format(result.own)} lei` : '—');
  setText('percentage', valid ? `${number.format(result.ownPercent)}% din valoarea proiectului` : 'Corectează valorile pentru a vedea rezultatul.');
}
form.addEventListener('input', update);
for (const id of ['funding-amount', 'split-own']) document.getElementById(id).addEventListener('change', update);
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('reset', () => setTimeout(() => {
  document.getElementById('funding').max = 15000;
  document.getElementById('funding').value = 15000;
  update(undefined, true);
}, 0));
document.getElementById('optimal').addEventListener('click', () => update(undefined, true));
document.getElementById('optimal-marker').addEventListener('click', () => update(undefined, true));
document.getElementById('maximum').addEventListener('click', () => {
  const values = getValues();
  if ([values.capacity, values.total, values.ineligible].every(Number.isFinite) && values.capacity >= 10 && values.total > 0 && values.ineligible >= 0 && values.ineligible <= values.total) {
    const result = calculateProject({ ...values, funding: 1 });
    document.getElementById('funding').value = Math.floor((result.limit + 1e-8) * 100) / 100;
  }
  update();
});
update(undefined, true);
