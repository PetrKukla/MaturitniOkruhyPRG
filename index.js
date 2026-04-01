const OKRUHY = [
    "Hardware",
    "Zobrazení informací v počítači",
    "Algebra logiky",
    "Logické obvody",
    "Senzory v robotice",
    "Pneumatické mechanismy",
    "PLC - Programmable Logic Controller",
    "Počítačové sítě a služby počítačových sítí",
    "Algoritmizace a programování",
    "Arduino – základy Wiring a akční členy",
    "Arduino – zpracování digitálních informací",
    "Arduino – zpracování analogových signálů",
    "Arduino – měření neelektrických veličin",
    "Datové typy a operátory",
    "Prvky if, switch, while, do while a řazení",
    "Cykly for a foreach",
    "Pole a kolekce",
    "Práce se soubory",
    "Objektově orientované programování",
    "Forms Application",
    "Unity",
    "HTML - Hypertext Markup Language",
    "CSS – Cascading Style Sheets",
    "PHP - Hypertext Preprocessor",
    "JS - JavaScript"
];

const ICONS = ["🖥️","💾","⚡","🔌","📡","💨","🤖","🌐","🧠","🔧","📟","📈","🌡️","📦","🔀","🔁","📋","📁","🏗️","🪟","🎮","🌍","🎨","🐘","🟨"];

const GROUPS = [
    { label: "Hardware & Elektronika", range: [0,6] },
    { label: "Sítě & Automatizace", range: [7,9] },
    { label: "Arduino", range: [10,13] },
    { label: "Programování (C#)", range: [14,20] },
    { label: "Webové technologie", range: [21,24] },
];

let cache = {};         // Loaded from data.json at startup
let currentOkruh = null;
let activeTab = 'explain';
let dataReady = false;

// ── LOAD data.json AT STARTUP ──
async function loadData() {
    try {
        const res = await fetch('data.json');
        if (!res.ok) throw new Error(`data.json not found (HTTP ${res.status})`);
        const raw = await res.json();
        // raw is { "0": {...}, "1": {...}, ... }
        Object.entries(raw).forEach(([k, v]) => { cache[parseInt(k)] = v; });
        dataReady = true;
        document.querySelector('.header-badge').textContent = '✓ Obsah načten';
        document.querySelector('.header-badge').style.background = 'rgba(74,222,128,0.1)';
        document.querySelector('.header-badge').style.borderColor = 'rgba(74,222,128,0.3)';
        document.querySelector('.header-badge').style.color = 'var(--correct)';
    } catch(e) {
        document.querySelector('.header-badge').textContent = '⚠ data.json chybí';
        document.querySelector('.header-badge').style.background = 'rgba(248,113,113,0.1)';
        document.querySelector('.header-badge').style.borderColor = 'rgba(248,113,113,0.3)';
        document.querySelector('.header-badge').style.color = 'var(--wrong)';
        console.error('Nepodařilo se načíst data.json:', e.message);
    }
}

loadData();

// ── SIDEBAR BUILD ──
const sidebar = document.getElementById('sidebar');

GROUPS.forEach(g => {
    const sec = document.createElement('div');
    sec.className = 'sidebar-section';
    sec.textContent = g.label;
    sidebar.appendChild(sec);

    for (let i = g.range[0]; i <= g.range[1]; i++) {
        const btn = document.createElement('button');
        btn.className = 'okruh-btn';
        btn.id = `okruh-btn-${i}`;
        btn.innerHTML = `<span class="okruh-num">${i+1}</span>${ICONS[i]} ${OKRUHY[i]}`;
        btn.onclick = () => loadTopic(i);
        sidebar.appendChild(btn);
    }
});

// ── LOAD TOPIC ──
async function loadTopic(idx) {
    currentOkruh = idx;
    activeTab = 'explain';

    // Update sidebar highlight
    document.querySelectorAll('.okruh-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`okruh-btn-${idx}`).classList.add('active');

    document.getElementById('welcome').style.display = 'none';
    const tv = document.getElementById('topic-view');
    tv.style.display = 'flex';

    tv.innerHTML = `
    <div class="topic-header">
      <div class="topic-header-top">
        <span class="topic-num">OKRUH ${idx+1}</span>
        <h2 class="topic-title">${ICONS[idx]} ${OKRUHY[idx]}</h2>
      </div>
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="explain" onclick="switchTab('explain')">
          <span class="tab-dot" style="background:var(--accent)"></span>Vysvětlení
        </button>
        <button class="tab-btn" data-tab="quiz" onclick="switchTab('quiz')">
          <span class="tab-dot" style="background:var(--accent2)"></span>Kvíz
        </button>
        <button class="tab-btn" data-tab="tasks" onclick="switchTab('tasks')">
          <span class="tab-dot" style="background:var(--accent3)"></span>Praktické úlohy
        </button>
        <button class="tab-btn" data-tab="codefill" onclick="switchTab('codefill')">
          <span class="tab-dot" style="background:var(--accent4)"></span>Doplňování kódu
        </button>
        <button class="tab-btn" data-tab="flash" onclick="switchTab('flash')">
          <span class="tab-dot" style="background:var(--accent)"></span>Flashcardy
        </button>
      </div>
    </div>
    <div class="content-panel" id="content-panel">
      <div id="panel-explain" class="tab-panel active"></div>
      <div id="panel-quiz" class="tab-panel"></div>
      <div id="panel-tasks" class="tab-panel"></div>
      <div id="panel-codefill" class="tab-panel"></div>
      <div id="panel-flash" class="tab-panel"></div>
    </div>
  `;

    if (cache[idx]) {
        renderAll(cache[idx]);
    } else {
        // data.json wasn't loaded or this okruh is missing
        ['explain','quiz','tasks','codefill','flash'].forEach(t => {
            const panel = document.getElementById(`panel-${t}`);
            if (panel) panel.innerHTML = `<div class="error-state">
        ⚠️ Obsah pro tento okruh nebyl nalezen.<br><br>
        Ujisti se, že soubor <code>data.json</code> je ve stejné složce jako tato stránka.<br><br>
        Pro vygenerování obsahu použij <strong>generator.html</strong>.
      </div>`;
        });
    }
}

// ── SWITCH TAB ──
function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.id === `panel-${tab}`);
    });
}

// ── RENDER ALL PANELS ──
function renderAll(data) {
    renderExplain(data.explain);
    renderQuiz(data.quiz);
    renderTasks(data.tasks);
    renderCodeFill(data.codefill);
    renderFlash(data.flashcards);
}

// ── RENDER EXPLAIN ──
function renderExplain(data) {
    const panel = document.getElementById('panel-explain');
    if (!panel) return;
    let html = '<div class="explanation-block">';
    (data.sections || []).forEach(s => {
        html += `<h3>📌 ${s.title}</h3>${s.content}`;
    });
    html += '</div>';
    panel.innerHTML = html;
}

// ── RENDER QUIZ ──
function renderQuiz(questions) {
    const panel = document.getElementById('panel-quiz');
    if (!panel) return;
    const letters = ['A','B','C','D'];
    let html = '<div class="quiz-container">';
    questions.forEach((q, qi) => {
        html += `<div class="quiz-question">
      <div class="quiz-q-num">Otázka ${qi+1} z ${questions.length}</div>
      <div class="quiz-q-text">${q.q}</div>
      <div class="quiz-options" id="quiz-opts-${qi}">`;
        q.options.forEach((opt, oi) => {
            html += `<button class="quiz-option" onclick="checkQuiz(${qi}, ${oi}, ${q.correct})" id="quiz-opt-${qi}-${oi}">
        <span class="option-letter">${letters[oi]}</span>${opt}
      </button>`;
        });
        html += `</div>
      <div class="quiz-feedback" id="quiz-fb-${qi}"></div>
    </div>`;
    });
    html += '</div>';
    panel.innerHTML = html;
    panel._questions = questions;
}

function checkQuiz(qi, selected, correct) {
    // Disable all options for this question
    document.querySelectorAll(`#quiz-opts-${qi} .quiz-option`).forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct) btn.classList.add('correct');
        else if (i === selected && selected !== correct) btn.classList.add('wrong');
    });
    const fb = document.getElementById(`quiz-fb-${qi}`);
    const panel = document.getElementById('panel-quiz');
    const q = panel._questions?.[qi];
    if (fb) {
        fb.className = `quiz-feedback show ${selected === correct ? 'correct' : 'wrong'}`;
        fb.innerHTML = selected === correct
            ? `✓ Správně! ${q?.feedback || ''}`
            : `✗ Špatně. ${q?.feedback || ''}`;
    }
}

// ── RENDER TASKS ──
function renderTasks(tasks) {
    const panel = document.getElementById('panel-tasks');
    if (!panel) return;
    let html = '<div class="task-list">';
    tasks.forEach((t, i) => {
        html += `<div class="task-card">
      <div class="task-card-header">
        <span class="task-badge">ÚLOHA ${i+1}</span>
        <span class="task-title">${t.title}</span>
      </div>
      <div class="task-body">${t.desc}</div>
      <div style="padding:0 1.25rem 1.25rem;">
        <button class="task-hint-btn" onclick="toggleHint(${i})">💡 Zobrazit nápovědu</button>
        <div class="task-hint" id="task-hint-${i}">${t.hint}</div>
      </div>
    </div>`;
    });
    html += '</div>';
    panel.innerHTML = html;
}

function toggleHint(i) {
    const h = document.getElementById(`task-hint-${i}`);
    if (h) h.classList.toggle('show');
}

// ── RENDER CODE FILL ──
function renderCodeFill(exercises) {
    const panel = document.getElementById('panel-codefill');
    if (!panel) return;
    let html = '<div class="code-fill-list">';

    exercises.forEach((ex, ei) => {
        let tpl = ex.template || '';

        // Nahrazení ___N___ za input nebo select
        tpl = tpl.replace(/___(\d+)___/g, (_, n) => {
            const ans = (ex.answers || {})[n] || '';
            const opts = (ex.options || {})[n];

            if (Array.isArray(opts)) {
                // Vygenerování dropdownu
                let selectHtml = `<select class="fill-blank" id="fill-${ei}-${n}" data-answer="${ans.replace(/"/g, '&quot;')}">`;
                selectHtml += `<option value="" disabled selected>?</option>`;
                opts.forEach(opt => {
                    selectHtml += `<option value="${opt.replace(/"/g, '&quot;')}">${opt}</option>`;
                });
                selectHtml += `</select>`;
                return selectHtml;
            } else {
                // Fallback na klasický text input
                return `<input class="fill-blank" id="fill-${ei}-${n}" data-answer="${ans.replace(/"/g, '&quot;')}" placeholder="??" spellcheck="false">`;
            }
        });

        html += `<div class="code-fill-card">
      <div class="code-fill-header">
        <span class="code-fill-badge">DOPLŇOVÁNÍ ${ei+1}</span>
        <span style="font-size:0.85rem;font-weight:600">${ex.title}</span>
      </div>
      <div class="code-fill-desc">${ex.desc}</div>
      <div class="code-fill-area">${tpl}</div>
      <div class="code-fill-actions">
        <button class="btn-check" onclick="checkFill(${ei})">✓ Zkontrolovat</button>
        <button class="btn-reset" onclick="resetFill(${ei})">× Reset</button>
      </div>
      <div class="code-fill-result" id="fill-result-${ei}"></div>
    </div>`;
    });

    html += '</div>';
    panel.innerHTML = html;
}

// ── CHECK FILL ──
function checkFill(ei) {
    const inputs = document.querySelectorAll(`[id^="fill-${ei}-"]`);
    if (inputs.length === 0) return;

    let correct = 0, total = 0;

    inputs.forEach(inp => {
        total++;
        const val = inp.value.trim();
        const ans = inp.getAttribute('data-answer');
        const ok = val.toLowerCase() === ans.toLowerCase();

        inp.classList.remove('correct','wrong');
        inp.classList.add(ok ? 'correct' : 'wrong');
        if (ok) correct++;
    });

    const res = document.getElementById(`fill-result-${ei}`);
    if (res) {
        res.className = `code-fill-result show ${correct === total ? 'all-correct' : 'some-wrong'}`;
        res.textContent = correct === total
            ? `✓ Výborně! Všechny odpovědi jsou správně.`
            : `✗ ${correct}/${total} správně. Zkus to znovu!`;
    }
}

// ── RESET FILL ──
function resetFill(ei) {
    const inputs = document.querySelectorAll(`[id^="fill-${ei}-"]`);

    inputs.forEach(inp => {
        if (inp.tagName === 'SELECT') {
            inp.selectedIndex = 0;
        } else {
            inp.value = '';
        }
        inp.classList.remove('correct','wrong');
    });

    const res = document.getElementById(`fill-result-${ei}`);
    if (res) { res.className = 'code-fill-result'; res.textContent = ''; }
}

// ── RENDER FLASHCARDS ──
function renderFlash(cards) {
    const panel = document.getElementById('panel-flash');
    if (!panel) return;

    let current = 0;

    function render() {
        const card = cards[current];
        const pct = ((current) / cards.length * 100).toFixed(0);
        panel.innerHTML = `
      <div class="flashcard-container">
        <div class="flashcard-progress">
          <span>${current + 1} / ${cards.length}</span>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span>${pct}%</span>
        </div>
        
        <div class="flashcard" id="fc-main" onclick="flipCard()">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <div class="flashcard-label">POJEM</div>
              <div class="flashcard-term">${card.term}</div>
              <div class="flashcard-hint">klikni pro definici →</div>
            </div>
            <div class="flashcard-back">
              <div class="flashcard-label">DEFINICE</div>
              <div class="flashcard-def">${card.def}</div>
            </div>
          </div>
        </div>

        <div class="flashcard-nav">
          <button class="nav-btn" onclick="prevCard()" ${current === 0 ? 'disabled' : ''}>← Předchozí</button>
          <span class="card-counter">${current+1} / ${cards.length}</span>
          <button class="nav-btn" onclick="nextCard()" ${current === cards.length-1 ? 'disabled' : ''}>Další →</button>
        </div>

        <div style="margin-top:1rem">
          <div style="font-family:var(--mono);font-size:0.72rem;color:var(--text-muted);margin-bottom:0.5rem">Všechny pojmy:</div>
          <div class="fc-grid" id="fc-grid"></div>
        </div>
      </div>`;

        const grid = document.getElementById('fc-grid');
        cards.forEach((c, i) => {
            const el = document.createElement('div');
            el.className = `fc-mini ${i === current ? 'known' : ''}`;
            el.innerHTML = `<div class="fc-mini-term">${c.term}</div><div class="fc-mini-def">${c.def}</div>`;
            el.onclick = () => { current = i; render(); };
            grid.appendChild(el);
        });
    }

    window.flipCard = () => {
        const fc = document.getElementById('fc-main');
        if (fc) fc.classList.toggle('flipped');
    };

    window.nextCard = () => {
        if (current < cards.length - 1) { current++; render(); }
    };

    window.prevCard = () => {
        if (current > 0) { current--; render(); }
    };

    render();
}