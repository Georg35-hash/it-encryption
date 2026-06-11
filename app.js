// ─── Encryption Methods ────────────────────────────────────────────────────

function caesarEncrypt(text, shift = 3) {
    return text.split('').map(char => {
        if (char.match(/[A-Z]/)) return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        if (char.match(/[a-z]/)) return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        return char;
    }).join('');
}
function caesarDecrypt(text, shift = 3) {
    return text.split('').map(char => {
        if (char.match(/[A-Z]/)) return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        if (char.match(/[a-z]/)) return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        return char;
    }).join('');
}
function atbashEncrypt(text) {
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rev   = alpha.split('').reverse().join('');
    return text.split('').map(char => {
        const up = char.toUpperCase();
        if (alpha.includes(up)) {
            const r = rev[alpha.indexOf(up)];
            return char === char.toLowerCase() ? r.toLowerCase() : r;
        }
        return char;
    }).join('');
}
function atbashDecrypt(text) { return atbashEncrypt(text); }
function binaryEncode(text) {
    return text.split('').map(c => c.match(/[A-Za-z]/) ? c.charCodeAt(0).toString(2).padStart(8,'0') : c === ' ' ? ' ' : c).join(' ');
}
function binaryDecode(text) {
    return text.split(' ').map(b => b.match(/^[01]+$/) ? String.fromCharCode(parseInt(b,2)) : b).join('');
}
function base64Encrypt(text) { return btoa(unescape(encodeURIComponent(text))); }
function base64Decrypt(text) { try { return decodeURIComponent(escape(atob(text))); } catch(e) { return 'Ungültiger Base64!'; } }

function encrypt(text, method) {
    switch(method) {
        case 'caesar': return caesarEncrypt(text);
        case 'base64': return base64Encrypt(text);
        case 'atbash': return atbashEncrypt(text);
        case 'binary': return binaryEncode(text);
        default: return text;
    }
}
function decrypt(text, method) {
    switch(method) {
        case 'caesar': return caesarDecrypt(text);
        case 'base64': return base64Decrypt(text);
        case 'atbash': return atbashDecrypt(text);
        case 'binary': return binaryDecode(text);
        default: return text;
    }
}

// ─── QR Modal (открывается ТОЛЬКО по клику на QR) ─────────────────────────

(function createQRModal() {
    const overlay = document.createElement('div');
    overlay.id = 'qr-modal-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;align-items:center;justify-content:center;';

    const box = document.createElement('div');
    box.style.cssText = 'background:#1a1a2e;border:2px solid #00d4ff;border-radius:16px;padding:2rem 2.5rem;text-align:center;max-width:360px;width:90%;box-shadow:0 0 40px rgba(0,212,255,.3);position:relative;cursor:default;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:absolute;top:.6rem;right:.8rem;background:none;border:none;color:#aaa;font-size:1.2rem;cursor:pointer;';

    const label = document.createElement('p');
    label.textContent = '🔍 Entschlüsselte Nachricht:';
    label.style.cssText = 'color:#00d4ff;font-size:.85rem;margin:0 0 .5rem;text-transform:uppercase;letter-spacing:.05em;';

    const answer = document.createElement('p');
    answer.id = 'qr-modal-answer';
    answer.style.cssText = 'color:#fff;font-size:1.4rem;font-weight:700;margin:0;word-break:break-all;';

    const hint = document.createElement('p');
    hint.textContent = 'Klicken zum Schließen';
    hint.style.cssText = 'color:#555;font-size:.75rem;margin:.8rem 0 0;';

    box.append(closeBtn, label, answer, hint);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const open  = text => { answer.textContent = text; overlay.style.display = 'flex'; };
    const close = ()   => { overlay.style.display = 'none'; };

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    window._openQRModal = open;
})();

// ─── QR Code ──────────────────────────────────────────────────────────────

let _lastOriginalText = '';

function generateQRCode(text, originalText) {
    const container = document.getElementById('qr-code-container');
    container.innerHTML = '';
    _lastOriginalText = originalText || text;

    if (!text || !text.trim()) return;
    if (typeof QRCode === 'undefined') { container.textContent = 'QR-Bibliothek nicht geladen.'; return; }

    try {
        new QRCode(container, { text, width:200, height:200, colorDark:'#000', colorLight:'#fff', correctLevel: QRCode.CorrectLevel.M });
    } catch(e) { container.textContent = 'QR-Fehler: ' + e.message; return; }

    container.style.cursor = 'pointer';
    container.onclick = () => window._openQRModal(_lastOriginalText);
}

// ─── Main buttons ─────────────────────────────────────────────────────────

document.getElementById('generate-btn').addEventListener('click', () => {
    const text = document.getElementById('message-input').value.trim();
    if (!text) return;
    const method    = document.getElementById('method-select').value;
    const encrypted = encrypt(text, method);
    const out = document.getElementById('encrypted-output');
    if (out) out.textContent = encrypted;
    generateQRCode(encrypted, text);
});

document.getElementById('decrypt-btn').addEventListener('click', () => {
    const text = document.getElementById('decrypt-input').value.trim();
    if (!text) return;
    document.getElementById('decrypted-output').textContent = decrypt(text, document.getElementById('decrypt-method').value);
});

document.getElementById('show-solution-btn').addEventListener('click', () => {
    const src = document.getElementById('message-input').value;
    if (src) document.getElementById('decrypted-output').textContent = src;
});

// ─── Puzzle ───────────────────────────────────────────────────────────────

const WORD_POOL = [
    'SCHULE','LAMPE','BAUM','BURG','WOLF','RING','STERN','FEUER',
    'WASSER','STEIN','TISCH','BRIEF','GARTEN','MARKT','TURM','ADLER',
    'BLUME','FENSTER','VOGEL','HAFEN','KELLER','MAUER','PFEIL','ZEIGER'
];

const METHOD_LABELS = { caesar:'Caesar (Shift 3)', base64:'Base64', atbash:'Atbash', binary:'Binary' };

let puzzleWord   = '';
let puzzleMethod = 'caesar';

function getPuzzleMethod() {
    const sel = document.getElementById('puzzle-method-select');
    return sel ? sel.value : 'caesar';
}

function renderPuzzleDisplay() {
    puzzleMethod = getPuzzleMethod();
    document.getElementById('quiz-encrypted').textContent = encrypt(puzzleWord, puzzleMethod);
    const hint = document.querySelector('.puzzle-card .hint');
    if (hint) hint.textContent = `Tipp: Entschlüssele mit ${METHOD_LABELS[puzzleMethod]}!`;
}

async function loadPuzzleWord() {
    const quizEncrypted = document.getElementById('quiz-encrypted');
    const puzzleResult  = document.getElementById('puzzle-result');
    document.getElementById('puzzle-decrypt-input').value = '';
    puzzleResult.textContent = '';
    quizEncrypted.textContent = '…';

    const fallback = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    try {
        const seed = Math.floor(Math.random() * 10000);
        const res  = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 20,
                temperature: 1,
                messages: [{ role:'user', content:`Zufallszahl: ${seed}. Antworte NUR mit EINEM Wort aus: SCHULE, LAMPE, BAUM, BURG, WOLF, RING, STERN, FEUER, WASSER, STEIN, TISCH, BRIEF, GARTEN, MARKT, TURM, ADLER, BLUME, FENSTER, VOGEL, HAFEN. Nur das Wort.` }]
            })
        });
        const data = await res.json();
        const raw  = data.content?.[0]?.text?.trim().toUpperCase().replace(/[^A-Z]/g,'') || '';
        puzzleWord = WORD_POOL.includes(raw) ? raw : fallback;
    } catch { puzzleWord = fallback; }

    renderPuzzleDisplay();
}

loadPuzzleWord();

const puzzleMethodSelect = document.getElementById('puzzle-method-select');
if (puzzleMethodSelect) {
    puzzleMethodSelect.addEventListener('change', () => {
        if (!puzzleWord) return;
        document.getElementById('puzzle-decrypt-input').value = '';
        document.getElementById('puzzle-result').textContent  = '';
        renderPuzzleDisplay();
    });
}

const newBtn = document.getElementById('new-puzzle-btn');
if (newBtn) newBtn.addEventListener('click', loadPuzzleWord);

document.getElementById('check-puzzle').addEventListener('click', () => {
    if (!puzzleWord) return;
    const answer = document.getElementById('puzzle-decrypt-input').value.toUpperCase().trim().replace(/[^A-Z]/g,'');
    const el = document.getElementById('puzzle-result');
    if (answer === puzzleWord) {
        el.textContent = '✅ Richtig! Du bist ein echter Spion!';
        el.style.color = '#4CAF50';
    } else {
        el.textContent = `❌ Falsch! Tipp: ${METHOD_LABELS[puzzleMethod]}`;
        el.style.color = '#ff6b6b';
    }
});

document.getElementById('show-solution').addEventListener('click', () => {
    const el = document.getElementById('puzzle-result');
    el.textContent = `Lösung: ${puzzleWord}`;
    el.style.color = '#ffa500';
});

// ─── Multi-choice Quiz ────────────────────────────────────────────────────

document.getElementById('check-quiz').addEventListener('click', () => {
    const answers = { q1:'C', q2:'B', q3:'C', q4:'B', q5:'A', q6:'D', q7:'C' };
    let score = 0;
    for (let i = 1; i <= 7; i++) {
        const sel = document.querySelector(`input[name="q${i}"]:checked`);
        if (sel && sel.value === answers[`q${i}`]) score++;
    }
    const el = document.getElementById('quiz-score');
    el.textContent = `Deine Punkte: ${score} von 7`;
    el.style.color  = score >= 5 ? '#4CAF50' : '#ff6b6b';
});
// ─── Geheimauftrag Quiz-Spiel ─────────────────────────────────────────────

const CATEGORIES = [
  { name:'Caesar', questions:[
    { pts:100, q:'Bei Caesar Shift 3 wird A zu …', opts:['B','C','D','E'], correct:2 },
    { pts:200, q:'Bei Caesar Shift 3 wird Z zu …', opts:['A','B','C','D'], correct:2 },
    { pts:300, q:'Caesar ist eine … Verschlüsselung', opts:['asymmetrische','Hash-','symmetrische','quantische'], correct:2 },
    { pts:400, q:'Wer erfand die Caesar-Verschlüsselung?', opts:['Napoleon','Julius Caesar','Alan Turing','Archimedes'], correct:1 },
  ]},
  { name:'Atbash', questions:[
    { pts:100, q:'Atbash ersetzt A durch …', opts:['B','Y','Z','X'], correct:2 },
    { pts:200, q:'Woher stammt Atbash ursprünglich?', opts:['Griechenland','Rom','Hebräisch','Ägypten'], correct:2 },
    { pts:300, q:'Atbash von "HALLO" = ?', opts:['SVOOL','HELLO','ITSLO','URYYB'], correct:0 },
    { pts:400, q:'Atbash: Entschlüsselung = Verschlüsselung?', opts:['Nein','Ja','Nur mit Schlüssel','Nur für Zahlen'], correct:1 },
  ]},
  { name:'Binary', questions:[
    { pts:100, q:'Wie viele Bits hat ein ASCII-Zeichen?', opts:['4','6','8','16'], correct:2 },
    { pts:200, q:'01000001 in ASCII = ?', opts:['B','A','C','Z'], correct:1 },
    { pts:300, q:'Binary nutzt nur …', opts:['0–9','1–9','0 und 1','A und B'], correct:2 },
    { pts:400, q:'01001000 01101001 = ?', opts:['OK','Hi','No','Go'], correct:1 },
  ]},
  { name:'Enigma', questions:[
    { pts:100, q:'Die Enigma war eine …', opts:['Chiffrier-Maschine','Bombe','Druckmaschine','Telegraphie'], correct:0 },
    { pts:200, q:'Wer knackte die Enigma?', opts:['Einstein','Alan Turing','Churchill','Morse'], correct:1 },
    { pts:300, q:'Die Enigma nutzten hauptsächlich …', opts:['England','Frankreich','Deutschland','USA'], correct:2 },
    { pts:400, q:'Enigma konnte NIE verschlüsseln …', opts:['Keinen Buchstaben','Sich selbst','Vokale','Konsonanten'], correct:1 },
  ]},
  { name:'Moderne', questions:[
    { pts:100, q:'HTTPS schützt mit …', opts:['Base64','TLS/SSL','Caesar','Morse'], correct:1 },
    { pts:200, q:'Was ist ein "Public Key"?', opts:['Geheimer Schlüssel','Öffentlicher Schlüssel','Passwort','Hash'], correct:1 },
    { pts:300, q:'RSA ist eine … Verschlüsselung', opts:['symmetrische','Atbash-','asymmetrische','binäre'], correct:2 },
    { pts:400, q:'Was ist ein Hash-Wert?', opts:['Verschlüsselter Text','Einweg-Fingerabdruck','Public Key','Passwort'], correct:1 },
  ]},
];

const POINTS = [100,200,300,400];

let gPlayers = [], gCurrent = 0, gAnswered = {}, gCurrentQ = null;

const gameModal   = document.getElementById('game-modal');
const gameRoot    = document.getElementById('game-root');
const openGameBtn = document.getElementById('open-game-btn');
const closeGameBtn= document.getElementById('close-game-btn');

openGameBtn.onclick  = () => { gameModal.style.display = 'flex'; renderSetup(); };
closeGameBtn.onclick = () => { gameModal.style.display = 'none'; };
gameModal.addEventListener('click', e => { if (e.target === gameModal) gameModal.style.display = 'none'; });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && gameModal.style.display === 'flex') gameModal.style.display = 'none'; });

// ── CSS injected once ──────────────────────────────────────────────────────
(function injectGameCSS() {
    const s = document.createElement('style');
    s.textContent = `
    #game-root { font-family:'Segoe UI',system-ui,sans-serif; color:#f1f5f9; padding:1.2rem; }
    .g-setup-title { color:#f59e0b; font-size:1.1rem; font-weight:800; text-transform:uppercase; letter-spacing:.08em; text-align:center; margin-bottom:1rem; }
    .g-inputs { display:flex; flex-direction:column; gap:.5rem; max-width:320px; margin:0 auto 1rem; }
    .g-inputs input { background:#1e293b; border:2px solid #1e3a5f; color:#f1f5f9; border-radius:8px; padding:.55rem .85rem; font-size:.95rem; }
    .g-inputs input:focus { outline:none; border-color:#2563eb; }
    .g-btn { background:linear-gradient(135deg,#1d4ed8,#7c3aed); border:none; color:#fff; font-size:1rem; font-weight:700; padding:.7rem 2rem; border-radius:10px; cursor:pointer; display:block; margin:0 auto; }
    .g-btn:hover { opacity:.9; }
    .g-scores { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:.8rem; }
    .g-chip { background:#1d4ed8; border-radius:8px; padding:.3rem .75rem; font-size:.82rem; font-weight:600; display:flex; gap:.4rem; align-items:center; }
    .g-chip.active { background:#f59e0b; color:#000; }
    .g-chip span.pts { opacity:.75; font-size:.75rem; }
    .g-board-title { text-align:center; color:#f59e0b; font-size:1rem; font-weight:800; text-transform:uppercase; letter-spacing:.08em; margin-bottom:.7rem; }
    .g-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:.35rem; }
    .g-hdr { background:#1d4ed8; border-radius:7px; text-align:center; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; padding:.55rem .25rem; line-height:1.3; }
    .g-cell { background:#2563eb; border-radius:7px; text-align:center; font-size:1rem; font-weight:800; color:#fbbf24; padding:.65rem .2rem; cursor:pointer; transition:transform .1s,background .12s; border:2px solid transparent; }
    .g-cell:hover { transform:scale(1.06); background:#1e40af; border-color:#f59e0b; }
    .g-cell.done { background:#1e293b; color:transparent; cursor:default; border-color:transparent; }
    .g-cell.done:hover { transform:none; }
    .g-qpanel { display:flex; flex-direction:column; align-items:center; gap:1rem; padding:.5rem 0; }
    .g-qcat { font-size:.78rem; text-transform:uppercase; letter-spacing:.1em; color:#f59e0b; }
    .g-qbadge { background:#1d4ed8; border-radius:8px; padding:.3rem .9rem; font-size:1.3rem; font-weight:800; color:#fbbf24; }
    .g-qtext { font-size:1.15rem; font-weight:600; text-align:center; line-height:1.5; max-width:560px; }
    .g-opts { display:grid; grid-template-columns:1fr 1fr; gap:.5rem; width:100%; max-width:520px; }
    .g-opt { background:#1e293b; border:2px solid #1e3a5f; color:#f1f5f9; border-radius:9px; padding:.7rem .9rem; font-size:.92rem; cursor:pointer; text-align:left; transition:background .12s,border-color .12s; }
    .g-opt:hover:not(:disabled) { background:#1e3a5f; border-color:#2563eb; }
    .g-opt.ok  { background:#14532d; border-color:#16a34a; color:#bbf7d0; }
    .g-opt.err { background:#450a0a; border-color:#dc2626; color:#fecaca; }
    .g-opt:disabled { cursor:default; }
    .g-fb { font-size:.95rem; font-weight:600; min-height:1.3rem; }
    .g-fb.ok  { color:#4ade80; }
    .g-fb.err { color:#f87171; }
    .g-qbtns { display:flex; gap:.7rem; flex-wrap:wrap; justify-content:center; }
    .g-qbtns button { padding:.55rem 1.3rem; border-radius:8px; border:none; font-size:.88rem; font-weight:700; cursor:pointer; text-transform:uppercase; }
    .g-back { background:#1e293b; color:#94a3b8; }
    .g-next { background:#1d4ed8; color:#fff; }
    .g-winner { display:flex; flex-direction:column; align-items:center; gap:.9rem; padding:1.5rem; text-align:center; }
    .g-trophy { font-size:3.5rem; }
    .g-wname { font-size:1.7rem; font-weight:800; color:#f59e0b; }
    .g-wscores { color:#94a3b8; font-size:.88rem; }
    `;
    document.head.appendChild(s);
})();

// ── Render helpers ────────────────────────────────────────────────────────

function renderSetup() {
    gameRoot.innerHTML = `
        <div class="g-setup-title">🕵️ Spieler eingeben</div>
        <div class="g-inputs">
            <input id="gp1" placeholder="Spieler 1" value="Agent 1">
            <input id="gp2" placeholder="Spieler 2 (optional)" value="Agent 2">
            <input id="gp3" placeholder="Spieler 3 (optional)" value="">
            <input id="gp4" placeholder="Spieler 4 (optional)" value="">
        </div>
        <button class="g-btn" id="g-start">Los geht's!</button>
    `;
    document.getElementById('g-start').onclick = () => {
        const names = ['gp1','gp2','gp3','gp4'].map(id => document.getElementById(id).value.trim()).filter(Boolean);
        if (!names.length) return;
        gPlayers  = names.map(n => ({ name:n, score:0 }));
        gCurrent  = 0;
        gAnswered = {};
        renderBoard();
    };
}

function renderScores() {
    return `<div class="g-scores">${gPlayers.map((p,i) => `<div class="g-chip${i===gCurrent?' active':''}"><span>${p.name}</span><span class="pts">${p.score} Pkt</span></div>`).join('')}</div>`;
}

function renderBoard() {
    let html = renderScores();
    html += `<div class="g-board-title">Wähle Kategorie & Punkte</div><div class="g-grid">`;
    CATEGORIES.forEach(c => { html += `<div class="g-hdr">${c.name}</div>`; });
    POINTS.forEach(pts => {
        CATEGORIES.forEach((cat, ci) => {
            const key  = `${ci}-${pts}`;
            const done = !!gAnswered[key];
            html += `<div class="g-cell${done?' done':''}" data-ci="${ci}" data-pts="${pts}">${done?'':pts}</div>`;
        });
    });
    html += `</div>`;
    gameRoot.innerHTML = html;
    gameRoot.querySelectorAll('.g-cell:not(.done)').forEach(el => {
        el.onclick = () => renderQuestion(+el.dataset.ci, +el.dataset.pts);
    });
}

function renderQuestion(ci, pts) {
    const cat  = CATEGORIES[ci];
    const qObj = cat.questions.find(q => q.pts === pts);
    gCurrentQ  = { ci, pts, qObj };

    let html = renderScores();
    html += `<div class="g-qpanel">
        <div class="g-qcat">${cat.name}</div>
        <div class="g-qbadge">${pts} Punkte</div>
        <div class="g-qtext">${qObj.q}</div>
        <div class="g-opts">${qObj.opts.map((o,i) => `<button class="g-opt" data-i="${i}">${o}</button>`).join('')}</div>
        <div class="g-fb" id="g-fb"></div>
        <div class="g-qbtns">
            <button class="g-back" id="g-back">← Zurück</button>
            <button class="g-next" id="g-next" style="display:none">Nächster Spieler →</button>
        </div>
    </div>`;
    gameRoot.innerHTML = html;

    document.getElementById('g-back').onclick = () => renderBoard();

    gameRoot.querySelectorAll('.g-opt').forEach(btn => {
        btn.onclick = () => {
            const chosen = +btn.dataset.i;
            const fb     = document.getElementById('g-fb');
            gameRoot.querySelectorAll('.g-opt').forEach(b => b.disabled = true);
            gameRoot.querySelectorAll('.g-opt')[qObj.correct].classList.add('ok');
            if (chosen === qObj.correct) {
                btn.classList.add('ok');
                gPlayers[gCurrent].score += pts;
                fb.textContent = `✅ Richtig! +${pts} Punkte`;
                fb.className   = 'g-fb ok';
            } else {
                btn.classList.add('err');
                fb.textContent = `❌ Falsch! Richtig: ${qObj.opts[qObj.correct]}`;
                fb.className   = 'g-fb err';
            }
            gAnswered[`${ci}-${pts}`] = true;
            document.getElementById('g-next').style.display = 'inline-block';
            // обновляем счёт в шапке
            const chips = gameRoot.querySelectorAll('.g-chip');
            chips.forEach((c,i) => { c.querySelector('.pts').textContent = gPlayers[i].score + ' Pkt'; });
        };
    });

    document.getElementById('g-next').onclick = () => {
        gCurrent = (gCurrent + 1) % gPlayers.length;
        const total = CATEGORIES.length * POINTS.length;
        if (Object.keys(gAnswered).length >= total) { renderWinner(); return; }
        renderBoard();
    };
}

function renderWinner() {
    const sorted = [...gPlayers].sort((a,b) => b.score - a.score);
    gameRoot.innerHTML = `
        <div class="g-winner">
            <div class="g-trophy">🏆</div>
            <div class="g-wname">🥇 ${sorted[0].name}</div>
            <div class="g-wscores">${sorted.map(p => `${p.name}: ${p.score}`).join('  ·  ')}</div>
            <button class="g-btn" id="g-restart" style="margin-top:.5rem;">Nochmal spielen</button>
        </div>
    `;
    document.getElementById('g-restart').onclick = renderSetup;
}