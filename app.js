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

// ─── QR Modal ─────────────────────────────────────────────────────────────

(function createQRModal() {
    const overlay = document.createElement('div');
    overlay.id = 'qr-modal-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;align-items:center;justify-content:center;';

    const box = document.createElement('div');
    box.style.cssText = 'background:#1a1a2e;border:2px solid #00d4ff;border-radius:16px;padding:2rem 2.5rem;text-align:center;max-width:360px;width:90%;position:relative;';

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
    hint.textContent = 'Tippen zum Schließen';
    hint.style.cssText = 'color:#555;font-size:.75rem;margin:.8rem 0 0;';

    box.append(closeBtn, label, answer, hint);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const open  = text => { answer.textContent = text; overlay.style.display = 'flex'; };
    const close = ()   => { overlay.style.display = 'none'; };

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.addEventListener('touchend', e => { if (e.target === overlay) { e.preventDefault(); close(); } }, { passive: false });
    closeBtn.addEventListener('click', close);
    closeBtn.addEventListener('touchend', e => { e.preventDefault(); close(); }, { passive: false });
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

    const isTouchDevice = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!isTouchDevice()) return; // на десктопе — ничего не вешаем

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;display:inline-block;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;';

    const tapOverlay = document.createElement('div');
    tapOverlay.style.cssText = 'position:absolute;inset:0;z-index:10;cursor:pointer;-webkit-tap-highlight-color:transparent;';

    while (container.firstChild) wrapper.appendChild(container.firstChild);
    wrapper.appendChild(tapOverlay);
    container.appendChild(wrapper);

    let touchMoved = false;

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
                model: 'claude-sonnet-4-6',
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