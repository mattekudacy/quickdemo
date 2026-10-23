const CATS = {
  Food:      {color:'#4B3FD1', words:'lunch dinner breakfast coffee groceries grocery snack meal food jollibee milk tea restaurant market'},
  Transport: {color:'#7C8CFF', words:'grab taxi jeep jeepney bus mrt lrt fare gas gasoline fuel parking toll commute tricycle'},
  Bills:     {color:'#2E2A8F', words:'rent electric electricity water internet wifi phone load bill bills subscription insurance'},
  Fun:       {color:'#B39DFF', words:'movie movies cinema concert game games netflix party drinks bar karaoke fun shopping'},
  Savings:   {color:'#2FB38A', words:'savings save saved deposit emergency invest investment'},
};
const KEY = 'sambit.v1', BKEY = 'sambit.budget';
const $ = id => document.getElementById(id);
const peso = n => '₱' + Math.round(n).toLocaleString('en-PH');
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const store = {
  get: (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ---- parsing -------------------------------------------------------------
function detectCategory(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  for (const [name, c] of Object.entries(CATS)) if (words.some(w => c.words.split(' ').includes(w))) return name;
  return 'Fun';
}
function parseDate(t) {
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  let m;
  if (/\byesterday\b/.test(t)) return [daysAgo(1), 'yesterday'];
  if (/\btoday\b/.test(t)) return [daysAgo(0), 'today'];
  if ((m = t.match(/(\d+) days? ago/))) return [daysAgo(+m[1]), m[0]];
  if ((m = t.match(/(?:last |on )?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/)))
    return [daysAgo((new Date().getDay() - days.indexOf(m[1]) + 6) % 7 + 1), m[0]];
  return [daysAgo(0), null];
}
function parseExpense(raw) {
  let t = raw.toLowerCase().trim();
  const am = t.match(/(?:₱|php|p|pesos?)?\s*(\d[\d,]*(?:\.\d+)?)\s*(?:pesos?|php)?/);
  if (!am) return null;
  const amount = parseFloat(am[1].replace(/,/g, ''));
  if (!amount) return null;
  const [date, dateWords] = parseDate(t);
  let desc = t.replace(am[0], ' ');
  if (dateWords) desc = desc.replace(dateWords, ' ');
  desc = desc.replace(/\b(i |we )?(spent|paid|bought|pay|add|log|expense)\b/g, ' ')
             .replace(/^\s*(on|for|at|to|a|an|the)\b/g, ' ').replace(/\b(on|for)\b/, ' ')
             .replace(/\s+/g, ' ').trim();
  desc = desc || 'Expense';
  return {amount, desc: desc[0].toUpperCase() + desc.slice(1), cat: detectCategory(t), date: iso(date)};
}

// ---- data ----------------------------------------------------------------
function seed() {
  const today = new Date().getDate();
  // [days ago, description, category, amount]; clamped so everything lands in the current month
  const rows = [
    [22,'Rent — studio unit','Bills',8500],[21,'Electric bill','Bills',1850],[20,'Internet plan','Bills',1299],
    [19,'Grocery run','Food',1480],[18,'Grab to office','Transport',215],[17,'Coffee with Ana','Food',165],
    [15,'Mobile load','Bills',599],[14,'Movie night','Fun',720],[12,'Jeepney & MRT fare','Transport',340],
    [10,'Emergency fund deposit','Savings',3000],[8,'Dinner at ramen place','Food',685],[6,'Weekend arcade','Fun',980],
    [4,'Gas refill','Transport',620],[2,'Lunch at the market','Food',250],[0,'Milk tea','Food',130],
  ];
  return rows.map(([n,desc,cat,amount], i) => ({id:i+1, desc, cat, amount, date: iso(daysAgo(Math.min(n, today - 1)))}));
}
let txs = store.get(KEY, null) || seed();
let budget = store.get(BKEY, 30000);
const monthPrefix = () => iso(new Date()).slice(0, 5);

// ---- render --------------------------------------------------------------
function render() {
  const mine = txs.filter(t => t.date.startsWith(monthPrefix()));
  const total = mine.reduce((s, t) => s + t.amount, 0);
  const pct = Math.min(100, total / budget * 100);
  $('month').textContent = new Date().toLocaleDateString('en-PH', {month:'long', year:'numeric'});
  $('total').textContent = peso(total);
  $('fill').style.width = pct + '%';
  $('pct').textContent = `${Math.round(total / budget * 100)}% of budget · ${peso(Math.max(0, budget - total))} left`;
  $('budgetBtn').textContent = `Budget ${peso(budget)} ✎`;
  const max = Math.max(1, ...Object.keys(CATS).map(c => mine.filter(t => t.cat === c).reduce((s, t) => s + t.amount, 0)));
  $('chart').innerHTML = Object.entries(CATS).map(([c, {color}]) => {
    const sum = mine.filter(t => t.cat === c).reduce((s, t) => s + t.amount, 0);
    return `<div class="crow"><span>${c}</span><div class="track"><i style="width:${sum / max * 100}%;background:${color}"></i></div><b>${peso(sum)}</b></div>`;
  }).join('');
  const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 5);
  $('list').innerHTML = recent.map(t => `<li><span class="ic" style="background:${CATS[t.cat].color}">${t.cat[0]}</span>
    <div class="d"><div>${esc(t.desc)}</div><div class="muted">${t.cat} · ${new Date(t.date + 'T00:00').toLocaleDateString('en-PH', {month:'short', day:'numeric'})}</div></div>
    <span class="a">${peso(t.amount)}</span></li>`).join('');
}
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function showPreview(text) {
  const p = parseExpense(text);
  $('preview').innerHTML = !text.trim() ? 'Tap the mic and speak, or type a sentence.'
    : p ? `<span class="chip">${peso(p.amount)}</span><span class="chip">${p.cat}</span><span class="chip">${new Date(p.date + 'T00:00').toLocaleDateString('en-PH', {month:'short', day:'numeric'})}</span> ${esc(p.desc)}`
        : 'Include an amount, e.g. “spent 250 on lunch”.';
}
function add(text) {
  const p = parseExpense(text);
  if (!p) return showPreview(text);
  txs.push({id: Date.now(), ...p});
  store.set(KEY, txs);
  $('text').value = '';
  render();
  $('preview').innerHTML = `Added <span class="chip">${peso(p.amount)}</span><span class="chip">${p.cat}</span> ${esc(p.desc)}`;
}

// ---- events --------------------------------------------------------------
$('text').addEventListener('input', e => showPreview(e.target.value));
$('form').addEventListener('submit', e => { e.preventDefault(); add($('text').value); });
$('budgetBtn').onclick = () => {
  const v = parseFloat((prompt('Monthly budget (₱)', budget) || '').replace(/,/g, ''));
  if (v > 0) { budget = v; store.set(BKEY, v); render(); }
};
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
$('mic').onclick = () => {
  if (!SR) return ($('preview').textContent = 'Voice input isn’t supported in this browser — type below instead.');
  const r = new SR();
  r.lang = 'en-PH';
  r.onstart = () => { $('mic').classList.add('live'); $('preview').textContent = 'Listening…'; };
  r.onend = () => $('mic').classList.remove('live');
  r.onerror = e => ($('preview').textContent = `Couldn’t hear that (${e.error}). Try typing instead.`);
  r.onresult = e => { const s = e.results[0][0].transcript; $('text').value = s; showPreview(s); add(s); };
  r.start();
};
render();
