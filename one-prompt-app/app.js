const CATS = {
  Food:      {color:'#4B3FD1', share:.25, words:'lunch dinner breakfast coffee groceries grocery snack meal food ramen milk tea restaurant market'},
  Transport: {color:'#7C8CFF', share:.10, words:'grab taxi jeep jeepney bus mrt lrt fare gas gasoline fuel parking toll commute tricycle'},
  Bills:     {color:'#2E2A8F', share:.40, words:'rent electric electricity water internet wifi phone load bill bills subscription insurance'},
  Fun:       {color:'#B39DFF', share:.10, words:'movie movies cinema concert game games arcade netflix party drinks bar karaoke fun shopping'},
  Savings:   {color:'#2FB38A', share:.15, words:'savings save saved deposit emergency invest investment'},
};
const ACCTS = [
  {id:'kw', name:'Kwik Wallet',   group:'E-wallets',    open:2400,  color:'linear-gradient(135deg,#4B3FD1,#7C8CFF)'},
  {id:'pp', name:'Pay Pocket',    group:'E-wallets',    open:3100,  color:'linear-gradient(135deg,#2FB38A,#7BD8B5)'},
  {id:'ls', name:'Lakas Savings', group:'Bank accounts',open:46000, color:'linear-gradient(135deg,#E0566B,#F59A8B)'},
  {id:'uc', name:'Union Checking',group:'Bank accounts',open:12500, color:'linear-gradient(135deg,#8A5CF5,#B39DFF)'},
  {id:'bc', name:'Bayan Card',    group:'Credit cards', open:4200,  color:'linear-gradient(135deg,#2E2A8F,#5B52D6)', debt:true},
];
const KEY = 'sambit.v2', $ = id => document.getElementById(id), peso = (n, d = 0) => '₱' + n.toLocaleString('en-PH', {minimumFractionDigits: d, maximumFractionDigits: d});
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const daysAgo = n => { const d = new Date(); d.setHours(12); d.setDate(d.getDate() - n); return d; };
const fmt = (s, o) => new Date(s + 'T12:00').toLocaleDateString('en-PH', o || {month:'short', day:'numeric'});
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PATHS = {home:'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z', wallet:'M4 7a2 2 0 0 1 2-2h11v3M4 7v10a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6a2 2 0 0 1-2-1zM16 14h2',
  plan:'M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 10h16M8 3v4M16 3v4', history:'M12 7v5l3 2M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4', plus:'M12 5v14M5 12h14',
  bell:'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4', tune:'M4 7h10M18 7h2M4 17h2M10 17h10M16 4v6M8 14v6', flame:'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z',
  mic:'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3', pie:'M12 3a9 9 0 1 0 9 9h-9zM15 3.5A9 9 0 0 1 20.5 9H15z', flag:'M6 21V4M6 5h11l-2 4 2 4H6',
  receipt:'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6', target:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', debt:'M12 3v18M16 7h-6a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7'};
const ic = n => `<svg class="i" viewBox="0 0 24 24"><path d="${PATHS[n]}"/></svg>`;
// Pip, the original mascot: a round little bird in a scarf
const PIP = `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="112" rx="26" ry="5" fill="#1E1B4B" opacity=".08"/><ellipse cx="46" cy="108" rx="9" ry="4" fill="#FFB84D"/><ellipse cx="74" cy="108" rx="9" ry="4" fill="#FFB84D"/>
<ellipse cx="60" cy="82" rx="32" ry="28" fill="#7C8CFF"/><ellipse cx="60" cy="90" rx="20" ry="17" fill="#EEF0FF"/><path d="M52 24q8-16 16 0" stroke="#4B3FD1" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="60" cy="52" r="32" fill="#7C8CFF"/>
<rect x="30" y="70" width="60" height="12" rx="6" fill="#4B3FD1"/><circle cx="46" cy="50" r="11" fill="#fff"/><circle cx="74" cy="50" r="11" fill="#fff"/><circle cx="47" cy="52" r="6.5" fill="#1E1B4B"/><circle cx="73" cy="52" r="6.5" fill="#1E1B4B"/>
<circle cx="49" cy="49" r="2.4" fill="#fff"/><circle cx="75" cy="49" r="2.4" fill="#fff"/><ellipse cx="33" cy="62" rx="5" ry="3" fill="#FFB4C8"/><ellipse cx="87" cy="62" rx="5" ry="3" fill="#FFB4C8"/><path d="M53 62h14l-7 9z" fill="#FFB84D"/></svg>`;
const store = {get: (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }};

// ---- parsing -------------------------------------------------------------
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
  const t = raw.toLowerCase().trim(), am = t.match(/(?:₱|php|p|pesos?)?\s*(\d[\d,]*(?:\.\d+)?)\s*(?:pesos?|php)?/);
  const amount = am && parseFloat(am[1].replace(/,/g, ''));
  if (!amount) return null;
  const [date, dateWords] = parseDate(t), type = /\b(received|earned|got paid|salary|income|refund|sold)\b/.test(t) ? 'in' : 'out';
  let desc = t.replace(am[0], ' ');
  if (dateWords) desc = desc.replace(dateWords, ' ');
  desc = desc.replace(/\b(i |we )?(spent|paid|bought|pay|add|log|expense|received|earned|got)\b/g, ' ').replace(/^\s*(on|for|at|to|a|an|the)\b/g, ' ').replace(/\b(on|for)\b/, ' ').replace(/\s+/g, ' ').trim() || 'Expense';
  const words = t.match(/[a-z]+/g) || [];
  const cat = type === 'in' ? 'Income' : Object.keys(CATS).find(c => words.some(w => CATS[c].words.split(' ').includes(w))) || 'Fun';
  return {type, amount, cat, desc: desc[0].toUpperCase() + desc.slice(1), date: iso(date)};
}

// ---- data ----------------------------------------------------------------
function seed() {
  const today = new Date().getDate();
  const o = (n, desc, cat, amount, acct, type = 'out') => ({desc, cat, amount, acct, type, date: iso(daysAgo(Math.min(n, today - 1)))});
  const tx = [o(25,'Salary','Income',38000,'ls','in'), o(22,'Rent — studio unit','Bills',8500,'ls'), o(21,'Electric bill','Bills',1850,'ls'), o(20,'Internet plan','Bills',1299,'ls'),
    o(19,'Grocery run','Food',1480,'kw'), o(18,'Ride to office','Transport',215,'pp'), o(16,'Coffee with Ana','Food',165,'kw'), o(15,'Mobile load','Bills',599,'pp'),
    o(14,'Movie night','Fun',720,'bc'), o(12,'Jeepney & MRT fare','Transport',340,'pp'), o(5,'Freelance project','Income',6500,'kw','in'), o(10,'Emergency fund deposit','Savings',3000,'ls'),
    o(8,'Dinner at ramen place','Food',685,'bc'), o(6,'Weekend arcade','Fun',980,'bc'), o(4,'Gas refill','Transport',620,'uc'), o(3,'Lunch at the market','Food',250,'kw'),
    o(2,'Bakery run','Food',210,'kw'), o(1,'Coffee beans','Food',320,'pp'), o(0,'Milk tea','Food',130,'kw')];
  const due = (n, name, amount, acct) => ({name, amount, acct, due: iso(daysAgo(-n)), paid: false});
  return {tx: tx.map((t, i) => ({id: i + 1, ...t})), bills: [due(-3,'Bayan Card',1230,'bc'), due(2,'Fibernet Home',999,'ls'), due(4,'Streamly Premium',249,'bc'), due(7,'Voltra Power',1850,'ls'), due(11,'Condo dues',2500,'ls')].map((b, i) => ({id: i + 1, ...b})), budget: 30000, tab: 'home'};
}
let S = store.get(KEY, null) || seed(), period = 'Week', filter = 'All';
const save = () => store.set(KEY, S);
const monthTx = () => S.tx.filter(t => t.date.startsWith(iso(new Date()).slice(0, 7)));
const sum = a => a.reduce((s, t) => s + t.amount, 0);
const spentBy = c => sum(monthTx().filter(t => t.type === 'out' && t.cat === c));
const balance = a => a.open + S.tx.filter(t => t.acct === a.id).reduce((s, t) => s + (t.type === 'in' ? 1 : -1) * t.amount * (a.debt ? -1 : 1), 0);
const streak = () => { let n = 0, d = 0; if (!S.tx.some(t => t.date === iso(daysAgo(0)))) d = 1; while (S.tx.some(t => t.date === iso(daysAgo(d)))) { n++; d++; } return n; };
const txRow = t => `<div class="tx"><span class="ic" style="background:${CATS[t.cat]?.color || '#2FB38A'}">${t.cat[0]}</span><div class="grow"><div>${esc(t.desc)}</div><div class="muted">${t.cat} · ${fmt(t.date)}</div></div><span class="amt ${t.type}">${t.type === 'in' ? '+' : ''}${peso(t.amount)}</span></div>`;
const dueRow = b => { const d = Math.round((new Date(b.due + 'T12:00') - daysAgo(0)) / 864e5), late = d < 0; return `<div class="due"><div class="date ${late ? 'late' : ''}">${fmt(b.due, {month:'short'}).toUpperCase()}<b>${+b.due.slice(8)}</b></div><div class="grow"><div>${esc(b.name)}</div><div><span class="tag ${late ? 'late' : ''}">${late ? -d + ' days overdue' : d + ' days left'}</span></div></div><div><div class="amt">${peso(b.amount, 2)}</div></div><button class="pay" data-pay="${b.id}">Pay</button></div>`; };

// ---- views ---------------------------------------------------------------
function home() {
  const mt = monthTx(), out = mt.filter(t => t.type === 'out'), spent = sum(out), name = 'Alex', h = new Date().getHours();
  const cats = Object.keys(CATS).map(c => [c, spentBy(c)]).sort((a, b) => b[1] - a[1]), over = cats.find(([c, v]) => v > S.budget * CATS[c].share);
  const tip = over ? `You've gone over your ${over[0]} budget this month. Let's take a look before spending more.` : `You still have ${peso(Math.max(0, S.budget - spent))} left, and most of your spending is going to ${cats[0][0]}.`;
  let g = '', p = 0; cats.forEach(([c, v]) => { const e = p + v / (spent || 1) * 100; g += `${CATS[c].color} ${p}% ${e}%,`; p = e; });
  const from = iso(daysAgo({Day: 0, Week: 6, Month: 29}[period])), pt = S.tx.filter(t => t.date >= from);
  const pct = Math.round(spent / S.budget * 100), due = S.bills.filter(b => !b.paid).sort((a, b) => a.due.localeCompare(b.due));
  const qa = [['pie','Budgets'], ['flag','Goals'], ['debt','Debt'], ['plan','Planned'], ['receipt','Installments']].map(([i, l]) => `<button data-qa="${l}"><span>${ic(i)}</span>${l}</button>`).join('');
  return `<div class="top"><div class="flame">${ic('flame')}<em>${streak()}</em></div><div class="pill"><span>${ic('bell')}</span><span>${ic('tune')}</span></div></div>
  <div class="cap">${new Date().toLocaleDateString('en-PH', {weekday:'long', month:'long', day:'numeric'})}</div>
  <h1>Good ${h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'}, <b>${name}</b>!</h1>
  <div class="tip">${PIP}<div class="bubble"><b>Pip</b>${tip}</div></div>
  <h3 style="margin-top:8px">Quick actions</h3><div class="qa">${qa}</div>
  <div class="two" style="margin-top:6px"><div class="card"><div class="donut" style="background:conic-gradient(${g || '#E4E7FA 0 100%,'}#E4E7FA 0)"><div>${Math.round((cats[0][1] / (spent || 1)) * 100)}%</div></div>
    <div class="leg">${cats.slice(0, 4).map(([c, v]) => `<span><i style="background:${CATS[c].color}"></i>${c} ${Math.round(v / (spent || 1) * 100)}%</span>`).join('')}</div></div>
  <div class="card"><b>This ${period}</b><div class="num in">↗ ${peso(sum(pt.filter(t => t.type === 'in')))}</div><div class="num out">↘ ${peso(sum(pt.filter(t => t.type === 'out')))}</div>
    <div class="seg">${['Day','Week','Month'].map(p => `<button data-per="${p}" class="${p === period ? 'on' : ''}">${p}</button>`).join('')}</div></div></div>
  <div class="card" style="margin-top:14px"><div class="row"><span class="muted">Spent this month</span><button class="pay" data-qa="Budgets">Budget ${peso(S.budget)} ✎</button></div><div class="big">${peso(spent)}</div>
    <div class="bar"><i style="width:${Math.min(100, pct)}%"></i></div><div class="muted">${pct}% of budget · ${peso(Math.max(0, S.budget - spent))} left</div></div>
  <h3>Payments due <small>${peso(sum(due))}</small></h3><div class="card">${due.slice(0, 3).map(dueRow).join('') || '<div class="muted">All paid up 🎉</div>'}</div>
  <h3>Recent transactions</h3><div class="card">${[...S.tx].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 4).map(txRow).join('')}</div>`;
}
function wallet() {
  const bal = ACCTS.map(a => [a, balance(a)]), net = bal.reduce((s, [a, v]) => s + (a.debt ? -v : v), 0), shown = bal.filter(([a]) => filter === 'All' || (filter === 'Liabilities') === !!a.debt);
  const days = [6,5,4,3,2,1,0].map(n => sum(S.tx.filter(t => t.type === 'out' && t.date === iso(daysAgo(n))))), mx = Math.max(1, ...days);
  const groups = [...new Set(shown.map(([a]) => a.group))].map(g => { const rows = shown.filter(([a]) => a.group === g); return `<div class="grp"><span>${g}</span><span class="muted">${peso(rows.reduce((s, [, v]) => s + v, 0), 2)}</span></div><div class="accts">${rows.map(([a, v]) => `<div class="acct" style="background:${a.color}"><div><b style="font-size:15px">${a.name}</b><small>${a.debt ? 'Credit' : 'Debit'} · PHP</small></div><div><small>${a.debt ? 'OWED' : 'BALANCE'}</small><b>${peso(v, 2)}</b></div></div>`).join('')}</div>`; }).join('');
  return `<div class="hero"><h1 style="font-weight:700;margin-top:6px">Accounts</h1><div class="muted">Manage your wallets and balances</div>
  <div class="tip" style="margin-top:16px"><div style="width:92px;flex:none">${PIP}</div><div class="card net"><div class="cap">Net worth</div><div class="big">${peso(net, 2)}</div><div class="muted">Assets minus liabilities</div></div></div></div>
  <div class="chips">${['All','Assets','Liabilities'].map(f => `<button data-f="${f}" class="${f === filter ? 'on' : ''}">${f}</button>`).join('')}</div>
  <div class="two"><div class="card"><div class="cap" style="color:var(--a);font-weight:700">Insight</div><p class="muted" style="margin:8px 0 0">${net > 50000 ? 'Your wallet is in great shape — keep logging to see it stay that way.' : 'Keep logging every peso to grow your net worth.'}</p></div>
  <div class="card"><div class="cap">Daily spend</div><div class="bars">${days.map(v => `<div style="height:${v / mx * 100}%"></div>`).join('')}</div></div></div>${groups}`;
}
function plan() {
  const due = S.bills.filter(b => !b.paid).sort((a, b) => a.due.localeCompare(b.due));
  return `<h1 style="font-weight:700">Plan</h1><div class="muted">Bills and category budgets</div><h3>Payments due <small>${peso(sum(due))}</small></h3><div class="card">${due.map(dueRow).join('') || '<div class="muted">All paid up 🎉</div>'}</div>
  <h3>Budgets</h3><div class="card">${Object.entries(CATS).map(([c, {color, share}]) => { const lim = S.budget * share, v = spentBy(c); return `<div style="margin-bottom:14px"><div class="row"><b><span class="dot" style="background:${color}"></span>${c}</b><span class="${v > lim ? 'out' : 'muted'}">${peso(v)} / ${peso(lim)}</span></div><div class="bar" style="margin:8px 0 0"><i style="width:${Math.min(100, v / lim * 100)}%;background:${v > lim ? 'var(--red)' : color}"></i></div></div>`; }).join('')}</div>`;
}
function history() {
  const days = [...new Set(S.tx.map(t => t.date))].sort().reverse();
  return `<h1 style="font-weight:700">History</h1>${days.map(d => `<h3 style="font-size:15px;margin-bottom:8px" class="muted">${fmt(d, {weekday:'long', month:'long', day:'numeric'})}</h3><div class="card">${S.tx.filter(t => t.date === d).reverse().map(txRow).join('')}</div>`).join('')}`;
}
function render() {
  $('v-home').innerHTML = home(); $('v-wallet').innerHTML = wallet(); $('v-plan').innerHTML = plan(); $('v-history').innerHTML = history();
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + S.tab));
  $('tabs').innerHTML = `<div class="bar2">${[['home','Home'],['wallet','Wallet'],['plan','Plan'],['history','History']].map(([t, l]) => `<button data-tab="${t}" class="${t === S.tab ? 'on' : ''}">${ic(t)}${l}</button>`).join('')}</div><button class="fab" id="fab" aria-label="Add">${ic('plus')}</button>`;
  $('acct').innerHTML = ACCTS.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  $('mic').innerHTML = ic('mic');
}

// ---- actions -------------------------------------------------------------
const toast = m => { $('toast').textContent = m; $('toast').classList.add('on'); setTimeout(() => $('toast').classList.remove('on'), 2200); };
const sheet = on => { $('form').classList.toggle('on', on); $('dim').classList.toggle('on', on); if (on) $('text').focus({preventScroll: true}); };
function preview(text) {
  const p = parseExpense(text);
  $('preview').innerHTML = !text.trim() ? 'Tap the mic and speak, or type a sentence.' : p ? `<span class="chip">${peso(p.amount)}</span><span class="chip">${p.cat}</span><span class="chip">${fmt(p.date)}</span><div class="muted">${esc(p.desc)}</div>` : 'Include an amount, e.g. “spent 250 on lunch”.';
}
function add(text) {
  const p = parseExpense(text);
  if (!p) return preview(text);
  S.tx.push({id: Date.now(), ...p, acct: $('acct').value}); save(); $('text').value = '';
  render(); sheet(false); toast(`Added ${peso(p.amount)} · ${p.cat}`);
}
document.addEventListener('click', e => {
  const b = e.target.closest('button, .dim'), d = b?.dataset;
  if (!b) return;
  if (b.id === 'fab') sheet(true); else if (b.id === 'dim') sheet(false);
  else if (d.tab) { S.tab = d.tab; save(); render(); $('scroll').scrollTop = 0; }
  else if (d.per) { period = d.per; render(); } else if (d.f) { filter = d.f; render(); }
  else if (d.pay) { const x = S.bills.find(v => v.id == d.pay); x.paid = true; S.tx.push({id: Date.now(), desc: x.name, cat: 'Bills', amount: x.amount, acct: x.acct, type: 'out', date: iso(daysAgo(0))}); save(); render(); toast(`Paid ${x.name}`); }
  else if (d.qa === 'Budgets') { const v = parseFloat((prompt('Monthly budget (₱)', S.budget) || '').replace(/,/g, '')); if (v > 0) { S.budget = v; save(); render(); } }
  else if (d.qa) toast(`${d.qa} isn't in this demo`);
});
$('dim').id = 'dim';
$('text').addEventListener('input', e => preview(e.target.value));
$('form').addEventListener('submit', e => { e.preventDefault(); add($('text').value); });
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
$('mic').onclick = () => {
  if (!SR) return ($('preview').textContent = 'Voice input isn’t supported in this browser — type below instead.');
  const r = new SR(); r.lang = 'en-PH';
  r.onstart = () => { $('mic').classList.add('live'); $('preview').textContent = 'Listening…'; };
  r.onend = () => $('mic').classList.remove('live');
  r.onerror = e => ($('preview').textContent = `Couldn’t hear that (${e.error}). Try typing instead.`);
  r.onresult = e => { const s = e.results[0][0].transcript; $('text').value = s; add(s); };
  r.start();
};
render();
