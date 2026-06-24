// ─── Encryption Methods ────────────────────────────────────────────────────

// Caesar (Shift 3)
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

// Binary
function binaryEncode(text) {
    return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}
function binaryDecode(text) {
    return text.trim().split(/\s+/).map(b => {
        if (/^[01]{8}$/.test(b)) return String.fromCharCode(parseInt(b, 2));
        return b;
    }).join('');
}

// Decimal (ASCII decimal codes)
function decimalEncode(text) {
    return text.split('').map(c => c.charCodeAt(0)).join(' ');
}
function decimalDecode(text) {
    return text.trim().split(/\s+/).map(n => {
        const code = parseInt(n, 10);
        return (!isNaN(code) && code >= 32 && code <= 126) ? String.fromCharCode(code) : n;
    }).join('');
}

// Hexadecimal (ASCII hex codes)
function hexEncode(text) {
    return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()).join(' ');
}
function hexDecode(text) {
    return text.trim().split(/\s+/).map(h => {
        const code = parseInt(h, 16);
        return (!isNaN(code) && code >= 32 && code <= 126) ? String.fromCharCode(code) : h;
    }).join('');
}

// Polyalphabetic / Vigenère (key = "GEHEIM")
const VIGENERE_KEY = 'GEHEIM';
function vigenereEncrypt(text) {
    const key = VIGENERE_KEY.toUpperCase();
    let ki = 0;
    return text.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            const shift = key.charCodeAt(ki % key.length) - 65;
            ki++;
            return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        }
        if (char.match(/[a-z]/)) {
            const shift = key.charCodeAt(ki % key.length) - 65;
            ki++;
            return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}
function vigenereDecrypt(text) {
    const key = VIGENERE_KEY.toUpperCase();
    let ki = 0;
    return text.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            const shift = key.charCodeAt(ki % key.length) - 65;
            ki++;
            return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        }
        if (char.match(/[a-z]/)) {
            const shift = key.charCodeAt(ki % key.length) - 65;
            ki++;
            return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        }
        return char;
    }).join('');
}

function encrypt(text, method) {
    switch (method) {
        case 'caesar':      return caesarEncrypt(text);
        case 'binary':      return binaryEncode(text);
        case 'decimal':     return decimalEncode(text);
        case 'hex':         return hexEncode(text);
        case 'vigenere':    return vigenereEncrypt(text);
        default:            return text;
    }
}
function decrypt(text, method) {
    switch (method) {
        case 'caesar':      return caesarDecrypt(text);
        case 'binary':      return binaryDecode(text);
        case 'decimal':     return decimalDecode(text);
        case 'hex':         return hexDecode(text);
        case 'vigenere':    return vigenereDecrypt(text);
        default:            return text;
    }
}

// ─── Info Panels ──────────────────────────────────────────────────────────────

function injectInfoStyles() {
    if (document.getElementById('info-styles')) return;
    const s = document.createElement('style');
    s.id = 'info-styles';
    s.textContent = `
        .info-toggle-btn {
            display: inline-flex; align-items: center; gap: .4rem;
            background: rgba(0,212,255,.08); border: 1px solid rgba(0,212,255,.3);
            color: #00d4ff; border-radius: 20px; padding: .35rem 1rem;
            font-size: .82rem; font-weight: 600; cursor: pointer;
            transition: background .15s, border-color .15s; letter-spacing: .02em;
        }
        .info-toggle-btn:hover { background: rgba(0,212,255,.15); border-color: #00d4ff; }
        .info-panel {
            display: none; background: rgba(0,20,40,.7); border: 1px solid rgba(0,212,255,.2);
            border-radius: 14px; padding: 1.2rem 1.4rem; margin: .8rem 0 1rem;
            font-size: .88rem; line-height: 1.65; color: #b0c8dd; animation: infoPanelIn .2s ease;
        }
        .info-panel.open { display: block; }
        @keyframes infoPanelIn { from { opacity:0; transform:translateY(-6px);} to { opacity:1; transform:translateY(0);} }
        .info-panel h4 { color: #00d4ff; font-size: .9rem; margin: 0 0 .6rem; text-transform: uppercase; letter-spacing: .06em; }
        .info-panel ul { margin: .4rem 0 .8rem 1.1rem; padding: 0; }
        .info-panel ul li { margin-bottom: .3rem; }
        .info-panel .method-row { display: flex; align-items: flex-start; gap: .7rem; background: rgba(255,255,255,.04); border-radius: 8px; padding: .5rem .8rem; margin-bottom: .4rem; }
        .info-panel .method-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: .1rem; }
        .info-panel .method-name { color: #fff; font-weight: 700; font-size: .9rem; }
        .info-panel .method-desc { color: #94a3b8; font-size: .82rem; margin-top: .15rem; }
        .info-panel .method-example { font-family: 'Courier New', monospace; color: #f59e0b; font-size: .8rem; margin-top: .2rem; background: rgba(0,0,0,.3); padding: .15rem .4rem; border-radius: 4px; display: inline-block; }
        .info-rule { display: flex; align-items: flex-start; gap: .5rem; margin-bottom: .5rem; }
        .info-rule-num { background: rgba(0,212,255,.15); color: #00d4ff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 700; flex-shrink: 0; margin-top: .1rem; }
        .section-header-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem; margin-bottom: .5rem; }
        .qr-placeholder {
            width: 200px; height: 200px; display: flex; flex-direction: column;
            align-items: center; justify-content: center; border: 2px dashed rgba(0,212,255,.3);
            border-radius: 12px; margin: 0 auto; color: rgba(0,212,255,.5);
            font-size: .8rem; gap: .5rem; background: rgba(0,20,40,.4);
            animation: pulsePlaceholder 2.5s ease-in-out infinite;
        }
        .qr-placeholder svg { opacity: .4; }
        @keyframes pulsePlaceholder { 0%,100%{opacity:.6;} 50%{opacity:1;} }
    `;
    document.head.appendChild(s);
}

function createInfoPanel(id, html) {
    const wrap = document.createElement('div');
    wrap.id = `info-wrap-${id}`;
    const btn = document.createElement('button');
    btn.className = 'info-toggle-btn';
    btn.innerHTML = `<span>ℹ</span> Regeln &amp; Erklärung`;
    const panel = document.createElement('div');
    panel.className = 'info-panel';
    panel.id = `info-panel-${id}`;
    panel.innerHTML = html;
    btn.addEventListener('click', () => {
        const open = panel.classList.toggle('open');
        btn.innerHTML = open ? `<span>✕</span> Schließen` : `<span>ℹ</span> Regeln &amp; Erklärung`;
    });
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    return wrap;
}

function injectEncoderInfo() {
    const section = document.querySelector('.encoder-section .container');
    if (!section || document.getElementById('info-wrap-encoder')) return;
    const h2 = section.querySelector('h2');
    const wrap = createInfoPanel('encoder', `
        <h4>🔐 So funktioniert das Verschlüsseln</h4>
        <p>Du gibst eine geheime Nachricht ein, wählst eine Verschlüsselungsmethode und bekommst einen QR-Code!</p>
        <div class="method-row"><span class="method-icon">🔄</span><div><div class="method-name">Caesar (Shift 3)</div><div class="method-desc">Jeder Buchstabe wird um 3 Stellen im Alphabet verschoben.</div><div class="method-example">HALLO → KDOOR</div></div></div>
        <div class="method-row"><span class="method-icon">💾</span><div><div class="method-name">Binary</div><div class="method-desc">Jedes Zeichen wird als 8-Bit Binärcode dargestellt.</div><div class="method-example">A → 01000001</div></div></div>
        <div class="method-row"><span class="method-icon">🔢</span><div><div class="method-name">Decimal</div><div class="method-desc">Jedes Zeichen wird als ASCII-Dezimalzahl kodiert.</div><div class="method-example">A → 65 · B → 66</div></div></div>
        <div class="method-row"><span class="method-icon">🔡</span><div><div class="method-name">Hexadecimal</div><div class="method-desc">Jedes Zeichen wird als hexadezimaler ASCII-Code dargestellt.</div><div class="method-example">A → 41 · Z → 5A</div></div></div>
        <div class="method-row"><span class="method-icon">🔀</span><div><div class="method-name">Polyalphabetisch (Vigenère)</div><div class="method-desc">Mehrere Caesar-Shifts mit dem Schlüsselwort "GEHEIM".</div><div class="method-example">HALLO → NKRPZ</div></div></div>
        <h4 style="margin-top:.8rem;">⏱ Challenge nach dem QR-Code</h4>
        <p>Nach der Erstellung startet automatisch eine 3-Minuten-Challenge — kannst du deine eigene Nachricht entschlüsseln?</p>
    `);
    h2.parentNode.insertBefore(wrap, h2.nextSibling);
}

function injectDecryptorInfo() {
    const section = document.querySelector('.decrypt-section .container');
    if (!section || document.getElementById('info-wrap-decrypt')) return;
    const h2 = section.querySelector('h2');
    const wrap = createInfoPanel('decrypt', `
        <h4>🔓 So entschlüsselst du eine Nachricht</h4>
        <div class="info-rule"><span class="info-rule-num">1</span><span>Scanne den QR-Code — der verschlüsselte Text erscheint automatisch im Eingabefeld.</span></div>
        <div class="info-rule"><span class="info-rule-num">2</span><span>Du siehst nur den verschlüsselten Text — du weißt <strong style="color:#fff;">nicht</strong>, welche Methode verwendet wurde!</span></div>
        <div class="info-rule"><span class="info-rule-num">3</span><span>Probiere alle 5 Methoden: <strong style="color:#00d4ff;">Caesar → Binary → Decimal → Hex → Vigenère</strong></span></div>
        <div class="info-rule"><span class="info-rule-num">4</span><span>Wenn das Ergebnis lesbar ist, wird die Mission automatisch als erfüllt gewertet!</span></div>
        <h4 style="margin-top:.8rem;">💡 Erkennungsmerkmale</h4>
        <ul>
            <li>🔢 <strong style="color:#fff;">Binary</strong> — nur Nullen und Einsen in 8er-Gruppen</li>
            <li>🔢 <strong style="color:#fff;">Decimal</strong> — Zahlen 32–126 durch Leerzeichen getrennt</li>
            <li>🔡 <strong style="color:#fff;">Hex</strong> — Zahlen/Buchstaben A-F in 2er-Gruppen</li>
            <li>🔄 <strong style="color:#fff;">Caesar</strong> — klingt fast wie das Original, versetzt</li>
            <li>🔀 <strong style="color:#fff;">Vigenère</strong> — wie Caesar, aber unregelmäßig verschoben</li>
        </ul>
        <h4 style="margin-top:.8rem;">🏅 Agenten-Ränge</h4>
        <ul>
            <li>🥇 <strong style="color:#fbbf24;">Elite-Agent</strong> — beim 1. Versuch</li>
            <li>🥈 <strong style="color:#94a3b8;">Senior-Agent</strong> — 2 Versuche</li>
            <li>🥉 <strong style="color:#cd7c2f;">Junior-Agent</strong> — 3 Versuche</li>
            <li>🎓 <strong style="color:#64748b;">Auszubildender</strong> — 4+ Versuche</li>
        </ul>
    `);
    h2.parentNode.insertBefore(wrap, h2.nextSibling);
}

function injectQuizInfo() {
    const section = document.querySelector('.quiz-section .container');
    if (!section || document.getElementById('info-wrap-quiz')) return;
    const h2 = section.querySelector('h2');
    const wrap = createInfoPanel('quiz', `
        <h4>📋 Regeln des Wissenstests</h4>
        <div class="info-rule"><span class="info-rule-num">1</span><span>Du bekommst <strong style="color:#fff;">7 zufällige Fragen</strong> aus einem Pool von 20.</span></div>
        <div class="info-rule"><span class="info-rule-num">2</span><span>Wähle eine der <strong style="color:#fff;">4 Antwortmöglichkeiten</strong> — nur eine ist richtig.</span></div>
        <div class="info-rule"><span class="info-rule-num">3</span><span>Nach der Antwort siehst du sofort ob du richtig lagst.</span></div>
        <div class="info-rule"><span class="info-rule-num">4</span><span><strong style="color:#fbbf24;">5/7 oder mehr</strong> = 🏆 Ausgezeichnet!</span></div>
    `);
    h2.parentNode.insertBefore(wrap, h2.nextSibling);
}

function injectGameInfo() {
    const section = document.querySelector('.game-section .container');
    if (!section || document.getElementById('info-wrap-game')) return;
    const h2 = section.querySelector('h2');
    const wrap = createInfoPanel('game', `
        <h4>🕵️ Spielregeln — Geheimauftrag</h4>
        <div class="info-rule"><span class="info-rule-num">1</span><span>Wähle <strong style="color:#fff;">1 oder 2 Spieler</strong>.</span></div>
        <div class="info-rule"><span class="info-rule-num">2</span><span><strong style="color:#fff;">5 Kategorien × 5 Fragen</strong> mit 100–500 Punkten.</span></div>
        <div class="info-rule"><span class="info-rule-num">3</span><span>Richtige Antwort = Punkte. Falsch = 0 Punkte.</span></div>
        <div class="info-rule"><span class="info-rule-num">4</span><span>Wer am Ende die <strong style="color:#fbbf24;">meisten Punkte</strong> hat, gewinnt!</span></div>
    `);
    h2.parentNode.insertBefore(wrap, h2.nextSibling);
}

// ─── QR Placeholder ──────────────────────────────────────────────────────────

function showQRPlaceholder() {
    const container = document.getElementById('qr-code-container');
    if (!container) return;
    container.innerHTML = `
        <div class="qr-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="3" height="3" rx=".5"/><rect x="18" y="14" width="3" height="3" rx=".5"/>
                <rect x="14" y="18" width="3" height="3" rx=".5"/><rect x="18" y="18" width="3" height="3" rx=".5"/>
                <rect x="5" y="5" width="3" height="3" rx=".5" fill="#00d4ff" stroke="none"/>
                <rect x="16" y="5" width="3" height="3" rx=".5" fill="#00d4ff" stroke="none"/>
                <rect x="5" y="16" width="3" height="3" rx=".5" fill="#00d4ff" stroke="none"/>
            </svg>
            <span>QR-Code erscheint hier</span>
        </div>
    `;
}

// ─── Smart Hints ──────────────────────────────────────────────────────────────

const VOWELS = 'aeiouAEIOUäöüÄÖÜ';

function countVowels(word) {
    return word.split('').filter(c => VOWELS.includes(c)).length;
}

function getWordCategory(word) {
    const w = word.toLowerCase();
    const categories = [
        { label: 'ein Tier 🐾',     words: ['hund','katze','vogel','fisch','pferd','maus','tiger','löwe','bär','fuchs','wolf','adler','hai','delfin','elefant','affe','giraffe','zebra','ente','hase'] },
        { label: 'ein Ort 📍',       words: ['schule','haus','stadt','land','wald','berg','fluss','meer','see','park','straße','markt','bahnhof','flughafen','museum','schloss','brücke','turm','insel'] },
        { label: 'eine Farbe 🎨',    words: ['rot','blau','grün','gelb','schwarz','weiß','lila','orange','rosa','grau','braun','türkis','gold','silber'] },
        { label: 'Technik 💻',       words: ['computer','handy','tablet','internet','programm','daten','code','passwort','schlüssel','verschlüsselung','software','server','netzwerk'] },
    ];
    for (const cat of categories) {
        if (cat.words.some(kw => w.includes(kw) || kw.includes(w))) return cat.label;
    }
    return null;
}

function getMethodHint(method) {
    const hints = {
        caesar:   'Jeder Buchstabe ist im Alphabet 3 Positionen nach vorne verschoben.',
        binary:   'Jedes Zeichen ist als 8-Bit Binärcode dargestellt (nur 0 und 1).',
        decimal:  'Jedes Zeichen ist als ASCII-Dezimalzahl (32–126) kodiert.',
        hex:      'Jedes Zeichen ist als hexadezimaler ASCII-Code (00–7E) dargestellt.',
        vigenere: 'Polyalphabetisch mit Schlüsselwort "GEHEIM" — verschiedene Shifts pro Buchstabe.',
    };
    return hints[method] || '';
}

function maskWord(word) {
    const letters = word.replace(/ /g, '').split('');
    if (letters.length <= 2) return letters.join(' _ ');
    return letters.map((c, i) => (i === 0 || i === letters.length - 1) ? c.toUpperCase() : '_').join(' ');
}

function getSyllableCount(word) {
    const m = word.toLowerCase().match(/[aeiouäöü]+/g);
    return m ? m.length : 1;
}

function getWordLengthCategory(n) {
    if (n <= 3) return 'sehr kurz (bis 3 Zeichen)';
    if (n <= 5) return 'kurz (4–5 Zeichen)';
    if (n <= 8) return 'mittel (6–8 Zeichen)';
    return 'lang (mehr als 8 Zeichen)';
}

function buildHints(original, method) {
    const word      = original.trim();
    const words     = word.split(/\s+/);
    const cleanWord = word.replace(/ /g, '');
    const firstLetter = word[0] ? word[0].toUpperCase() : '?';
    const vowelCount  = countVowels(word);
    const category    = getWordCategory(word);
    const syllables   = getSyllableCount(cleanWord);
    const lenCat      = getWordLengthCategory(cleanWord.length);
    const hints = [];

    if (words.length > 1) {
        hints.push(`Die Nachricht besteht aus ${words.length} Wörtern — das erste hat ${words[0].length} Zeichen`);
    } else if (category) {
        hints.push(`Das Wort bezeichnet ${category} — es ist ${lenCat}`);
    } else {
        hints.push(`Das Wort ist ${lenCat} und hat ${syllables} Silbe${syllables !== 1 ? 'n' : ''}`);
    }
    if (category && words.length === 1) {
        hints.push(`Es hat ${vowelCount} Vokal${vowelCount !== 1 ? 'e' : ''} — denk an ${category}`);
    } else {
        hints.push(`Es enthält ${vowelCount} Vokal${vowelCount !== 1 ? 'e' : ''} und "${firstLetter}" ist der erste Buchstabe`);
    }
    hints.push(`🔑 Entschlüsselungs-Tipp: ${getMethodHint(method)}`);
    hints.push(`Buchstabenmaske: ${maskWord(cleanWord)} (${cleanWord.length} Zeichen)`);
    const start2 = cleanWord.length >= 2 ? cleanWord.slice(0, 2).toUpperCase() : cleanWord.toUpperCase();
    const last1  = cleanWord[cleanWord.length - 1].toUpperCase();
    hints.push(`Die ersten 2 Zeichen sind "${start2}" — letztes Zeichen: "${last1}"`);
    return hints;
}

// ─── QR Modal ────────────────────────────────────────────────────────────────

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
    label.textContent = '🔐 Verschlüsselter Code:';
    label.style.cssText = 'color:#00d4ff;font-size:.85rem;margin:0 0 .5rem;text-transform:uppercase;letter-spacing:.05em;';
    const answer = document.createElement('p');
    answer.id = 'qr-modal-answer';
    answer.style.cssText = 'color:#fff;font-size:1.2rem;font-weight:700;margin:0;word-break:break-all;';
    const hint = document.createElement('p');
    hint.textContent = 'Tippen zum Schließen';
    hint.style.cssText = 'color:#555;font-size:.75rem;margin:.8rem 0 0;';
    box.append(closeBtn, label, answer, hint);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    const open  = text => { answer.textContent = text; overlay.style.display = 'flex'; };
    const close = ()   => { overlay.style.display = 'none'; };
    overlay.addEventListener('touchend', e => { if (e.target === overlay) { e.preventDefault(); close(); } }, { passive: false });
    closeBtn.addEventListener('touchend', e => { e.preventDefault(); close(); }, { passive: false });
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window._openQRModal = open;
})();

// ─── QR Code ─────────────────────────────────────────────────────────────────

let _lastEncryptedText = '';
let _lastOriginalText  = '';
let _lastMethod        = '';

function generateQRCode(text, originalText, method) {
    const container = document.getElementById('qr-code-container');
    container.innerHTML = '';
    _lastEncryptedText = text;
    _lastOriginalText  = originalText;
    _lastMethod        = method;

    if (!text || !text.trim()) { showQRPlaceholder(); return; }
    if (typeof QRCode === 'undefined') { container.textContent = 'QR-Bibliothek nicht geladen.'; return; }

    const qrUrl = 'https://it-encryption.vercel.app/?code=' + encodeURIComponent(text);
    try {
        new QRCode(container, { text: qrUrl, width: 200, height: 200, colorDark: '#000', colorLight: '#fff', correctLevel: QRCode.CorrectLevel.M });
    } catch (e) { container.textContent = 'QR-Fehler: ' + e.message; return; }

    document.getElementById('message-input').value = '';
    startChallenge(text, originalText, method);
}

// ─── Challenge (3 Minuten = 180 Sekunden) ────────────────────────────────────

let challengeTimer     = null;
let challengeSeconds   = 180;
let challengeHintsUsed = 0;
let challengeOriginal  = '';
let challengeEncrypted = '';
let challengeMethod    = '';

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function startChallenge(encrypted, original, method) {
    challengeOriginal  = original;
    challengeEncrypted = encrypted;
    challengeMethod    = method;
    challengeHintsUsed = 0;
    challengeSeconds   = 180;

    if (challengeTimer) clearInterval(challengeTimer);

    const box       = document.getElementById('challenge-box');
    const timerEl   = document.getElementById('challenge-timer');
    const hintsEl   = document.getElementById('challenge-hints');
    const resultEl  = document.getElementById('challenge-result');
    const inputEl   = document.getElementById('challenge-input');

    box.style.display     = 'block';
    hintsEl.innerHTML     = '';
    resultEl.textContent  = '';
    inputEl.value         = '';
    timerEl.textContent   = formatTime(challengeSeconds);
    timerEl.style.color   = '#f59e0b';

    document.getElementById('challenge-hint-btn').disabled  = false;
    document.getElementById('challenge-hint-btn').style.opacity = '1';
    document.getElementById('challenge-check').disabled     = false;
    inputEl.disabled = false;

    challengeTimer = setInterval(() => {
        challengeSeconds--;
        timerEl.textContent = formatTime(challengeSeconds);
        if (challengeSeconds <= 30) timerEl.style.color = '#f87171';
        if (challengeSeconds <= 0) {
            clearInterval(challengeTimer);
            timerEl.textContent  = '0:00';
            resultEl.textContent = `⏰ Zeit abgelaufen! Lösung: ${original}`;
            resultEl.style.color = '#f87171';
            document.getElementById('challenge-hint-btn').disabled = true;
            document.getElementById('challenge-check').disabled    = true;
            inputEl.disabled = true;
        }
    }, 1000);
}

document.getElementById('challenge-check').addEventListener('click', () => {
    if (challengeSeconds <= 0) return;
    const input   = document.getElementById('challenge-input').value.trim();
    const result  = document.getElementById('challenge-result');
    const correct = challengeOriginal.toLowerCase().replace(/\s+/g, ' ').trim();
    const given   = input.toLowerCase().replace(/\s+/g, ' ').trim();
    if (given === correct) {
        clearInterval(challengeTimer);
        const bonus = challengeSeconds > 120 ? '⚡ Superschnell!' : challengeSeconds > 60 ? '👍 Gut gemacht!' : '😅 Gerade noch!';
        result.textContent = `✅ Richtig! ${bonus} (${formatTime(challengeSeconds)} übrig)`;
        result.style.color = '#4ade80';
        document.getElementById('challenge-hint-btn').disabled = true;
        document.getElementById('challenge-check').disabled    = true;
        document.getElementById('challenge-input').disabled    = true;
    } else {
        result.textContent = '❌ Falsch — versuch nochmal!';
        result.style.color = '#f87171';
    }
});

document.getElementById('challenge-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('challenge-check').click();
});

document.getElementById('challenge-hint-btn').addEventListener('click', () => {
    if (challengeHintsUsed >= 5 || challengeSeconds <= 0) return;
    const hints   = buildHints(challengeOriginal, challengeMethod);
    const hintsEl = document.getElementById('challenge-hints');
    const hint    = document.createElement('div');
    hint.style.cssText = 'background:rgba(255,165,0,.1);border:1px solid #ffa500;border-radius:8px;padding:.4rem .8rem;font-size:.85rem;color:#ffa500;margin-bottom:.4rem;text-align:center;';
    hint.textContent   = `💡 Tipp ${challengeHintsUsed + 1}/5: ${hints[challengeHintsUsed]}`;
    hintsEl.appendChild(hint);
    challengeHintsUsed++;
    if (challengeHintsUsed >= 5) {
        document.getElementById('challenge-hint-btn').disabled = true;
        document.getElementById('challenge-hint-btn').style.opacity = '.4';
    }
    const penalty = challengeHintsUsed <= 2 ? 5 : 15;
    challengeSeconds = Math.max(0, challengeSeconds - penalty);
    document.getElementById('challenge-timer').textContent = formatTime(challengeSeconds);
});

// ─── Main Generate Button ─────────────────────────────────────────────────────

document.getElementById('generate-btn').addEventListener('click', () => {
    const text = document.getElementById('message-input').value.trim();
    if (!text) return;

    const hasLetters = /[a-zA-ZäöüÄÖÜ]/.test(text);
    const method = document.getElementById('method-select').value;

    if (!hasLetters && (method === 'caesar' || method === 'vigenere')) {
        const encrypted = encrypt(text, method);
        const warningDiv = document.getElementById('qr-code-container');
        warningDiv.innerHTML = `<div style="color:#f59e0b;font-size:.82rem;padding:.5rem;border:1px solid #f59e0b;border-radius:8px;margin-bottom:.5rem;">⚠️ Caesar / Vigenère verschlüsseln nur Buchstaben — Ziffern bleiben unverändert.</div>`;
        generateQRCode(encrypted, text, method);
        return;
    }

    const encrypted = encrypt(text, method);
    generateQRCode(encrypted, text, method);
});

// ─── Agent Mission: Decrypt Game ─────────────────────────────────────────────

(function initAgentMission() {
    const input     = document.getElementById('decrypt-input');
    const outputBox = document.getElementById('decrypted-output');
    const oldBtn    = document.getElementById('decrypt-btn');
    const methodSel = document.getElementById('decrypt-method');

    if (oldBtn)    oldBtn.style.display    = 'none';
    if (methodSel) methodSel.style.display = 'none';

    let attempts      = 0;
    let solved        = false;
    let lastText      = '';
    let failedMethods = new Set();

    const METHODS = [
        { id: 'caesar',   label: 'Caesar',          icon: '🔄', desc: 'Shift 3',   tooltip: 'Verschiebt jeden Buchstaben um 3 Stellen im Alphabet' },
        { id: 'binary',   label: 'Binary',           icon: '💾', desc: '0 & 1',     tooltip: 'Stellt Text als 8-Bit Binärzahlen dar (nur 0 und 1)' },
        { id: 'decimal',  label: 'Decimal',          icon: '🔢', desc: 'ASCII 0-9', tooltip: 'Kodiert als ASCII-Dezimalzahlen — z.B. A = 65' },
        { id: 'hex',      label: 'Hexadecimal',      icon: '🔡', desc: '0-9 A-F',   tooltip: 'Kodiert als Hex-ASCII-Codes — z.B. A = 41' },
        { id: 'vigenere', label: 'Polyalphabetisch', icon: '🔀', desc: 'Vigenère',  tooltip: 'Schlüsselwort "GEHEIM" — jeder Buchstabe anders verschoben' },
    ];

    const RANKS = [
        { max: 1,  icon: '🥇', title: 'Elite-Agent',    color: '#fbbf24' },
        { max: 2,  icon: '🥈', title: 'Senior-Agent',   color: '#94a3b8' },
        { max: 3,  icon: '🥉', title: 'Junior-Agent',   color: '#cd7c2f' },
        { max: 99, icon: '🎓', title: 'Auszubildender', color: '#64748b' },
    ];

    function getRank(n) { return RANKS.find(r => n <= r.max); }

    function normalizeText(str) {
        return (str || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function isValidDecryptedText(result) {
        if (!result || result.trim().length === 0) return false;
        if (typeof _lastOriginalText === 'string' && _lastOriginalText.trim().length > 0) {
            return normalizeText(result) === normalizeText(_lastOriginalText);
        }
        const clean = result.trim();
        const printable = clean.split('').filter(c => { const code = c.charCodeAt(0); return code >= 32 && code <= 126; }).length;
        if (printable / clean.length < 0.85) return false;
        const lettersOnly = clean.replace(/\s/g, '');
        if (lettersOnly.length === 0) return false;
        const letterCount = (lettersOnly.match(/[a-zA-ZäöüÄÖÜ]/g) || []).length;
        if (letterCount / lettersOnly.length < 0.4) return false;
        const vowelCount = (lettersOnly.match(/[aeiouäöüAEIOUÄÖÜ]/g) || []).length;
        if (vowelCount / letterCount < 0.1) return false;
        return true;
    }

    // ── Tooltip-Styles ────────────────────────────────────────────────────────
    if (!document.getElementById('agent-styles')) {
        const s = document.createElement('style');
        s.id = 'agent-styles';
        s.textContent = `
            .method-wrap { position: relative; }
            .method-tooltip {
                display: none;
                position: absolute;
                bottom: calc(100% + 10px);
                left: 50%;
                transform: translateX(-50%);
                background: #1e293b;
                border: 1px solid #00d4ff;
                color: #fff;
                font-size: .78rem;
                font-weight: 500;
                border-radius: 9px;
                padding: .45rem .85rem;
                white-space: nowrap;
                z-index: 99;
                pointer-events: none;
                box-shadow: 0 4px 18px rgba(0,212,255,.18);
                line-height: 1.4;
            }
            .method-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 5px solid transparent;
                border-top-color: #00d4ff;
            }
            .method-wrap:hover .method-tooltip { display: block; }
            @keyframes agentPop { from { transform: scale(.93); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `;
        document.head.appendChild(s);
    }

    // ── UI ────────────────────────────────────────────────────────────────────
    const gameWrap = document.createElement('div');
    gameWrap.id = 'agent-game-wrap';
    gameWrap.style.cssText = 'margin-top:1rem;';
    outputBox.parentNode.insertBefore(gameWrap, outputBox);
    outputBox.style.display = 'none';

    function renderIdle(highlightError) {
        gameWrap.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.8rem;">
                ${METHODS.map(m => {
                    const isFailed = failedMethods.has(m.id);
                    return `
                    <div class="method-wrap">
                        <button data-method="${m.id}" style="
                            width:100%;padding:.7rem .5rem;
                            border:2px solid ${isFailed ? '#f87171' : '#1e3a5f'};
                            border-radius:12px;
                            background:${isFailed ? 'rgba(248,113,113,.08)' : '#0f172a'};
                            color:${isFailed ? '#f87171' : '#fff'};
                            font-size:.85rem;font-weight:700;
                            cursor:pointer;transition:all .15s;text-align:center;line-height:1.4;">
                            ${m.icon} ${m.label}<br>
                            <span style="font-size:.7rem;color:${isFailed ? '#f87171' : '#94a3b8'};">${m.desc}</span>
                        </button>
                        <div class="method-tooltip">${m.tooltip}</div>
                    </div>`;
                }).join('')}
            </div>
            <div id="agent-feedback" style="text-align:center;font-size:.82rem;min-height:1.3rem;margin-bottom:.3rem;
                color:${highlightError ? '#f87171' : '#475569'};">
                ${highlightError
                    ? `❌ Falsche Methode — versuch eine andere! (${failedMethods.size} von 5 versucht)`
                    : 'Welche Methode wurde verwendet? Probiere alle 5 aus!'}
            </div>`;

        gameWrap.querySelectorAll('button[data-method]').forEach(btn => {
            const isFailed = failedMethods.has(btn.dataset.method);
            btn.addEventListener('mouseenter', () => {
                btn.style.borderColor = isFailed ? '#ff8888' : '#00d4ff';
                btn.style.background  = isFailed ? 'rgba(248,113,113,.15)' : 'rgba(0,212,255,.07)';
                btn.style.color       = '#fff';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.borderColor = isFailed ? '#f87171' : '#1e3a5f';
                btn.style.background  = isFailed ? 'rgba(248,113,113,.08)' : '#0f172a';
                btn.style.color       = isFailed ? '#f87171' : '#fff';
            });
            btn.addEventListener('click', () => tryMethod(btn.dataset.method));
        });
    }

    function tryMethod(method) {
        const text = input.value.trim();
        if (!text) { pulse(input); return; }

        if (text !== lastText) {
            attempts = 0;
            solved   = false;
            lastText = text;
            failedMethods.clear();
        }
        if (solved) return;

        attempts++;
        const result = decrypt(text, method);

        if (isValidDecryptedText(result)) {
            outputBox.style.display     = 'block';
            outputBox.textContent       = result;
            outputBox.style.borderColor = '#4ade80';
            outputBox.style.color       = '#4ade80';
            setTimeout(() => {
                outputBox.style.borderColor = '';
                outputBox.style.color       = '';
            }, 800);
            missionSuccess(method, result);
        } else {
            failedMethods.add(method);
            outputBox.style.display     = 'block';
            outputBox.textContent       = result;
            outputBox.style.borderColor = '#f87171';
            outputBox.style.color       = '#f87171';
            setTimeout(() => {
                outputBox.style.borderColor = '';
                outputBox.style.color       = '';
            }, 700);
            renderIdle(true);
        }
    }

    function missionSuccess(method, result) {
        solved = true;
        const rank  = getRank(attempts);
        const mdata = METHODS.find(m => m.id === method);

        gameWrap.innerHTML = `
            <div style="text-align:center;padding:1.3rem .5rem;background:rgba(0,212,255,.05);
                border:2px solid rgba(0,212,255,.18);border-radius:16px;animation:agentPop .4s ease;">
                <div style="font-size:2.4rem;margin-bottom:.2rem;">${rank.icon}</div>
                <div style="font-size:1.15rem;font-weight:800;color:${rank.color};margin-bottom:.15rem;">${rank.title}</div>
                <div style="color:#94a3b8;font-size:.8rem;margin-bottom:.75rem;">
                    Nachricht in <strong style="color:#fff;">${attempts}</strong> Versuch${attempts !== 1 ? 'en' : ''} geknackt
                </div>
                <div style="background:#0f172a;border-radius:10px;padding:.45rem 1rem;
                    font-size:.82rem;color:#00d4ff;display:inline-block;margin-bottom:.9rem;">
                    ${mdata.icon} Methode erkannt: ${mdata.label} (${mdata.desc})
                </div>
                <br>
                <button id="agent-reset" style="padding:.45rem 1.3rem;border:1px solid #1e3a5f;
                    border-radius:8px;background:none;color:#fff;font-size:.8rem;cursor:pointer;margin-top:.5rem;">
                    🔄 Neue Nachricht entschlüsseln
                </button>
            </div>`;

        document.getElementById('agent-reset').addEventListener('click', () => {
            input.value             = '';
            outputBox.style.display = 'none';
            outputBox.textContent   = 'Entschlüsselte Nachricht...';
            attempts = 0;
            solved   = false;
            lastText = '';
            failedMethods.clear();
            renderIdle(false);
        });
    }

    function pulse(el) {
        el.style.transition = 'box-shadow .15s';
        el.style.boxShadow  = '0 0 0 3px #f87171';
        setTimeout(() => el.style.boxShadow = '', 600);
    }

    renderIdle(false);
})();

// ─── Quiz ─────────────────────────────────────────────────────────────────────

const ALL_QUIZ_QUESTIONS = [
    { q: 'Bei Caesar Shift 3 wird A zu …',                           opts: ['B','C','D','Z'],                             correct: 2 },
    { q: 'Welche Maschine wurde im 2. Weltkrieg verwendet?',         opts: ['AES','Enigma','RSA','Skytale'],              correct: 1 },
    { q: 'Was bedeutet "Klartext"?',                                 opts: ['Verschlüsselte Nachricht','Geheimer Schlüssel','Ursprüngliche lesbare Nachricht','Passwort'], correct: 2 },
    { q: 'Was braucht man zum Entschlüsseln?',                       opts: ['Drucker','Schlüssel','Datenbank','Scanner'], correct: 1 },
    { q: 'Vigenère-Verschlüsselung nutzt …',                         opts: ['Mehrere Alphabete','Keinen Schlüssel','Bildverschlüsselung','Datenkomprimierung'], correct: 0 },
    { q: 'Wo begegnet uns Verschlüsselung heute?',                   opts: ['Online-Banking','Messenger-Apps','HTTPS-Webseiten','Alle davon'], correct: 3 },
    { q: 'Was schützt RSA?',                                         opts: ['Nur USB-Sticks','Analoge Briefe','Sicheren Datenaustausch im Web','Passwörter auf Papier'], correct: 2 },
    { q: 'Was ist ein "Public Key"?',                                opts: ['Geheimer Schlüssel','Öffentlicher Schlüssel','Passwort','Hash-Wert'], correct: 1 },
    { q: 'HTTPS schützt Daten mit …',                                opts: ['Base64','TLS/SSL','Caesar','Morse'],         correct: 1 },
    { q: '01000001 in ASCII ist …',                                  opts: ['B','A','C','Z'],                             correct: 1 },
    { q: 'Wie viele Bits hat ein ASCII-Zeichen?',                    opts: ['4','6','8','16'],                            correct: 2 },
    { q: 'Was ist ein Hash-Wert?',                                   opts: ['Verschlüsselter Text','Einweg-Fingerabdruck','Public Key','Passwort'], correct: 1 },
    { q: 'Wer knackte die Enigma?',                                  opts: ['Einstein','Alan Turing','Churchill','Morse'],correct: 1 },
    { q: 'Caesar ist eine … Verschlüsselung',                        opts: ['asymmetrische','Hash-','symmetrische','quantische'], correct: 2 },
    { q: 'RSA ist eine … Verschlüsselung',                           opts: ['symmetrische','Atbash-','asymmetrische','binäre'], correct: 2 },
    { q: 'Binary nutzt nur …',                                       opts: ['0–9','1–9','0 und 1','A und B'],             correct: 2 },
    { q: 'Decimal-Kodierung nutzt …',                                opts: ['Buchstaben A-F','Zahlen 0 und 1','ASCII-Dezimalzahlen','64 Zeichen'], correct: 2 },
    { q: 'Hexadezimal nutzt wie viele Zeichen?',                     opts: ['8','10','16','64'],                          correct: 2 },
    { q: 'Vigenère-Schlüssel in dieser App lautet …',                opts: ['SECRET','GEHEIM','CIPHER','SCHLÜSSEL'],     correct: 1 },
    { q: 'Bei Caesar Shift 3 wird Z zu …',                           opts: ['A','B','C','D'],                            correct: 2 },
];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const quizModal    = document.getElementById('quiz-modal');
const quizRoot     = document.getElementById('quiz-root');
const openQuizBtn  = document.getElementById('open-quiz-btn');
const closeQuizBtn = document.getElementById('close-quiz-btn');

openQuizBtn.addEventListener('click',  () => { quizModal.style.display = 'flex'; startQuiz(); });
closeQuizBtn.addEventListener('click', () => { quizModal.style.display = 'none'; });
quizModal.addEventListener('click', e => { if (e.target === quizModal) quizModal.style.display = 'none'; });

function startQuiz() {
    const questions = shuffleArray(ALL_QUIZ_QUESTIONS).slice(0, 7);
    const answered  = new Array(7).fill(null);

    function render() {
        const score = answered.filter((a, i) => a === questions[i].correct).length;
        const done  = answered.every(a => a !== null);
        quizRoot.innerHTML = `
            <div style="padding:1.2rem;">
                <div style="color:#f59e0b;font-size:1rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;text-align:center;margin-bottom:1.2rem;">🔐 Wissenstest</div>
                ${questions.map((q, i) => {
                    const isAnswered = answered[i] !== null;
                    const borderCol  = !isAnswered ? '#1e3a5f' : answered[i] === q.correct ? '#16a34a' : '#dc2626';
                    return `
                    <div style="background:#1e293b;border-radius:12px;padding:1rem 1.2rem;margin-bottom:.8rem;border:2px solid ${borderCol};">
                        <div style="font-size:.95rem;font-weight:600;margin-bottom:.7rem;color:#f1f5f9;">${i + 1}. ${q.q}</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;">
                            ${q.opts.map((opt, j) => {
                                let bg = '#0f172a', col = '#f1f5f9', border = '#1e3a5f';
                                if (isAnswered) {
                                    if (j === q.correct)        { bg = '#14532d'; col = '#bbf7d0'; border = '#16a34a'; }
                                    else if (j === answered[i]) { bg = '#450a0a'; col = '#fecaca'; border = '#dc2626'; }
                                }
                                return `<button data-qi="${i}" data-ai="${j}" ${isAnswered ? 'disabled' : ''} style="background:${bg};border:2px solid ${border};color:${col};border-radius:8px;padding:.5rem .7rem;font-size:.85rem;cursor:${isAnswered ? 'default' : 'pointer'};text-align:left;">${opt}</button>`;
                            }).join('')}
                        </div>
                    </div>`;
                }).join('')}
                ${done ? `
                <div style="text-align:center;margin-top:1rem;padding:.8rem;background:#1e293b;border-radius:12px;">
                    <div style="font-size:1.4rem;font-weight:800;color:${score >= 5 ? '#4ade80' : '#f87171'};">${score >= 5 ? '🏆' : '📚'} ${score} / 7</div>
                    <div style="color:#94a3b8;font-size:.85rem;margin:.4rem 0 .8rem;">${score >= 5 ? 'Ausgezeichnet!' : 'Weiter üben!'}</div>
                    <button id="quiz-restart" style="background:linear-gradient(135deg,#1d4ed8,#7c3aed);border:none;color:#fff;font-size:.95rem;font-weight:700;padding:.6rem 1.8rem;border-radius:10px;cursor:pointer;">Nochmal</button>
                </div>` : ''}
            </div>`;
        quizRoot.querySelectorAll('button[data-qi]').forEach(btn => {
            btn.addEventListener('click', () => {
                const qi = +btn.dataset.qi, ai = +btn.dataset.ai;
                if (answered[qi] !== null) return;
                answered[qi] = ai;
                render();
            });
        });
        const rb = document.getElementById('quiz-restart');
        if (rb) rb.addEventListener('click', startQuiz);
    }
    render();
}

// ─── URL code param (QR scan) ─────────────────────────────────────────────────

(function checkUrlCode() {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    if (code) {
        window.addEventListener('load', () => {
            setTimeout(() => window._openQRModal(decodeURIComponent(code)), 300);
        });
    }
})();

// ─── Jeopardy Game ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

    injectInfoStyles();
    showQRPlaceholder();
    injectEncoderInfo();
    injectDecryptorInfo();
    injectQuizInfo();
    injectGameInfo();

    const CATEGORIES = [
        {
            name: '🔐 Verschlüsselung',
            questions: [
                { pts: 100, q: 'Diese Methode verschiebt jeden Buchstaben um 3 Stellen im Alphabet.', a: 'Caesar' },
                { pts: 200, q: 'Diese Methode stellt Text als Folge aus 8-Bit Binärzahlen dar.', a: 'Binary' },
                { pts: 300, q: 'Diese Kodierung wandelt Text in ASCII-Dezimalzahlen um (z.B. A=65).', a: 'Decimal' },
                { pts: 400, q: 'Diese Kodierung nutzt Hexadezimalzahlen (0-9 und A-F) für ASCII-Codes.', a: 'Hexadecimal' },
                { pts: 500, q: 'Diese Methode nutzt das Schlüsselwort "GEHEIM" und verschiebt jeden Buchstaben unterschiedlich weit.', a: 'Vigenère' },
            ]
        },
        {
            name: '🕵️ Spionage',
            questions: [
                { pts: 100, q: 'Diese deutsche Verschlüsselungsmaschine wurde im 2. Weltkrieg verwendet.', a: 'Enigma' },
                { pts: 200, q: 'Dieser Mathematiker knackte die Enigma und gilt als Vater der Informatik.', a: 'Alan Turing' },
                { pts: 300, q: 'Dieser antike Verschlüsselungsstab rollte Papier um einen Stock.', a: 'Skytale' },
                { pts: 400, q: 'Dieser US-Dienst sammelt weltweit Geheimdienstinformationen.', a: 'CIA' },
                { pts: 500, q: 'Operation, bei der die Alliierten die Enigma-Dechiffrierung geheim hielten.', a: 'Ultra' },
            ]
        },
        {
            name: '💻 Sicherheit',
            questions: [
                { pts: 100, q: 'Dieses Protokoll schützt deine Daten auf HTTPS-Webseiten.', a: 'TLS' },
                { pts: 200, q: 'Bei dieser Methode gibt es einen öffentlichen und einen privaten Schlüssel.', a: 'Asymmetrisch' },
                { pts: 300, q: 'Diese Funktion erzeugt einen digitalen Fingerabdruck einer Datei.', a: 'Hash' },
                { pts: 400, q: 'Dieser asymmetrische Algorithmus basiert auf Primzahlen.', a: 'RSA' },
                { pts: 500, q: 'Dieser Angriff probiert alle möglichen Schlüssel systematisch durch.', a: 'Brute-Force' },
            ]
        },
        {
            name: '🔢 Codes',
            questions: [
                { pts: 100, q: 'Wie viele Bits braucht ein einzelnes ASCII-Zeichen?', a: '8' },
                { pts: 200, q: 'Was ergibt 01000001 in ASCII?', a: 'A' },
                { pts: 300, q: 'Welchen Dezimalwert hat der Buchstabe "A" in ASCII?', a: '65' },
                { pts: 400, q: 'Welchen Hex-Wert hat der Buchstabe "A" in ASCII?', a: '41' },
                { pts: 500, q: 'Bei Caesar Shift 3: Welcher Buchstabe entsteht aus X?', a: 'A' },
            ]
        },
        {
            name: '🎯 Auftrag',
            questions: [
                { pts: 100, q: 'Verschlüssele "HALLO" mit Caesar Shift 3.', a: 'KDOOR' },
                { pts: 200, q: 'Entschlüssele "KHOOR" mit Caesar Shift 3.', a: 'HELLO' },
                { pts: 300, q: 'Decimal: Was ergibt "72 101 108 108 111"?', a: 'Hello' },
                { pts: 400, q: 'Wie lautet "A" in 8-Bit Binär?', a: '01000001' },
                { pts: 500, q: 'Hex: Was ergibt "48 65 6C 6C 6F"?', a: 'Hello' },
            ]
        },
    ];

    var gameMode      = '1p';
    var p1Name        = 'Spieler 1';
    var p2Name        = 'Spieler 2';
    var scores        = [0, 0];
    var currentPlayer = 0;
    var answered      = {};
    var phase         = 'setup';
    var activeQ       = null;
    var playerInput   = '';
    var lastCorrect   = null;

    var PLAYER_COLORS = ['#3b82f6', '#f59e0b'];
    var PLAYER_ICONS  = ['🕵️', '🔍'];

    var gameModal    = document.getElementById('game-modal');
    var openGameBtn  = document.getElementById('open-game-btn');
    var closeGameBtn = document.getElementById('close-game-btn');

    if (!gameModal || !openGameBtn || !closeGameBtn) { console.error('[game.js] Required elements missing'); return; }

    openGameBtn.addEventListener('click', function () {
        scores = [0, 0]; answered = {}; phase = 'setup'; activeQ = null; currentPlayer = 0;
        gameModal.style.display = 'flex';
        render();
    });
    closeGameBtn.addEventListener('click', function () { gameModal.style.display = 'none'; });
    gameModal.addEventListener('click', function (e) { if (e.target === gameModal) gameModal.style.display = 'none'; });

    function render() {
        var root = document.getElementById('game-root');
        if (!root) return;
        if (phase === 'setup')    root.innerHTML = renderSetup();
        if (phase === 'board')    root.innerHTML = renderBoard();
        if (phase === 'question') root.innerHTML = renderQuestion();
        if (phase === 'answer')   root.innerHTML = renderAnswer();
        if (phase === 'end')      root.innerHTML = renderEnd();
        attachListeners();
    }

    function renderSetup() {
        return `<div style="padding:2rem 1.5rem;">
            <div style="text-align:center;margin-bottom:1.5rem;">
                <div style="font-size:1.1rem;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.3rem;">🕵️ Geheimauftrag</div>
                <div style="color:#475569;font-size:.85rem;">Wähle den Spielmodus</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-bottom:1.5rem;">
                <button id="btn-1p" style="padding:1.2rem .8rem;border:2px solid #1d4ed8;border-radius:14px;background:linear-gradient(135deg,rgba(29,78,216,.15),rgba(124,58,237,.15));color:#fff;cursor:pointer;text-align:center;">
                    <div style="font-size:1.8rem;margin-bottom:.3rem;">🕵️</div>
                    <div style="font-weight:700;font-size:.95rem;">1 Spieler</div>
                    <div style="color:#64748b;font-size:.75rem;margin-top:.2rem;">Alleine spielen</div>
                </button>
                <button id="btn-2p" style="padding:1.2rem .8rem;border:2px solid #1e3a5f;border-radius:14px;background:rgba(255,255,255,.03);color:#fff;cursor:pointer;text-align:center;">
                    <div style="font-size:1.8rem;margin-bottom:.3rem;">🕵️🔍</div>
                    <div style="font-weight:700;font-size:.95rem;">2 Spieler</div>
                    <div style="color:#64748b;font-size:.75rem;margin-top:.2rem;">Gegeneinander</div>
                </button>
            </div>
            <div id="player-names-wrap" style="display:none;margin-bottom:1.2rem;">
                <div style="background:#1e293b;border-radius:12px;padding:1rem;display:flex;flex-direction:column;gap:.6rem;">
                    <div style="font-size:.78rem;color:#475569;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.2rem;">Spielernamen (optional)</div>
                    <div style="display:flex;align-items:center;gap:.6rem;">
                        <span style="color:#3b82f6;font-size:1.1rem;">🕵️</span>
                        <input id="p1-name-input" type="text" placeholder="Spieler 1" maxlength="16" value="${p1Name}" style="flex:1;padding:.45rem .8rem;border:1px solid #1e3a5f;border-radius:8px;background:#0f172a;color:#fff;font-size:.9rem;">
                    </div>
                    <div style="display:flex;align-items:center;gap:.6rem;">
                        <span style="color:#f59e0b;font-size:1.1rem;">🔍</span>
                        <input id="p2-name-input" type="text" placeholder="Spieler 2" maxlength="16" value="${p2Name}" style="flex:1;padding:.45rem .8rem;border:1px solid #1e3a5f;border-radius:8px;background:#0f172a;color:#fff;font-size:.9rem;">
                    </div>
                </div>
            </div>
            <div style="background:#1e293b;border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.5rem;font-size:.83rem;color:#64748b;line-height:1.6;">
                <div style="color:#94a3b8;font-weight:700;margin-bottom:.4rem;">📋 Kurzregeln</div>
                <div>• 5 Kategorien × 5 Fragen (100–500 Punkte)</div>
                <div>• Wähle eine Frage → tippe die Antwort ein</div>
                <div>• Richtig = Punkte, Falsch = 0 Punkte</div>
                <div id="rule-2p-extra" style="display:none;">• Bei 2 Spielern wechselt nach jeder Frage der aktive Spieler</div>
            </div>
            <div style="text-align:center;">
                <button id="btn-start-game" style="padding:.75rem 2.5rem;border:none;border-radius:14px;background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;font-weight:800;font-size:1.05rem;cursor:pointer;">▶ Spiel starten</button>
            </div>
        </div>`;
    }

    function renderBoard() {
        var total = CATEGORIES.length * 5;
        var done  = Object.keys(answered).filter(k => !k.includes('_winner')).length;
        var pct   = Math.round(done / total * 100);
        var headerRow = CATEGORIES.map(c => '<th style="padding:.5rem .3rem;font-size:.7rem;color:#00d4ff;font-weight:700;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap;">' + c.name + '</th>').join('');
        var rows = [0,1,2,3,4].map(qi => {
            var cells = CATEGORIES.map((cat, ci) => {
                var key  = ci + '-' + qi;
                var pts  = cat.questions[qi].pts;
                var isDone = answered[key] !== undefined;
                var winner = answered[key + '_winner'];
                var wasCorrect = typeof answered[key] === 'boolean' ? answered[key] : false;
                var bg, col, border, label;
                if (isDone) {
                    bg = '#0a0e1a'; border = '#1e3a5f';
                    if (wasCorrect && gameMode === '2p') { col = winner === 0 ? '#3b82f6' : '#f59e0b'; label = winner === 0 ? (PLAYER_ICONS[0]+'✓') : (PLAYER_ICONS[1]+'✓'); }
                    else if (wasCorrect) { col = '#16a34a'; label = '✓'; }
                    else { col = '#4b5563'; label = '✕'; }
                } else { bg = 'linear-gradient(135deg,#1d4ed8,#7c3aed)'; col = '#fff'; border = '#1d4ed8'; label = pts; }
                return '<td style="padding:.25rem .2rem;"><button data-cat="' + ci + '" data-q="' + qi + '" ' + (isDone ? 'disabled' : '') + ' style="width:100%;padding:.55rem .2rem;border:2px solid ' + border + ';border-radius:10px;background:' + bg + ';color:' + col + ';font-size:.82rem;font-weight:700;cursor:' + (isDone ? 'default' : 'pointer') + ';">' + label + '</button></td>';
            }).join('');
            return '<tr>' + cells + '</tr>';
        }).join('');

        var scoreBar = gameMode === '2p'
            ? `<div style="display:flex;gap:.5rem;align-items:stretch;margin-bottom:.8rem;">
                <div style="flex:1;background:rgba(59,130,246,.12);border:2px solid ${currentPlayer===0?'#3b82f6':'#1e3a5f'};border-radius:12px;padding:.5rem .8rem;text-align:center;">
                    <div style="font-size:.78rem;color:#3b82f6;font-weight:700;">${PLAYER_ICONS[0]} ${p1Name}</div>
                    <div style="font-size:1.4rem;font-weight:900;color:#fff;">${scores[0]}</div>
                    ${currentPlayer===0?'<div style="font-size:.68rem;color:#3b82f6;">▶ Am Zug</div>':''}
                </div>
                <div style="flex:1;background:rgba(245,158,11,.12);border:2px solid ${currentPlayer===1?'#f59e0b':'#1e3a5f'};border-radius:12px;padding:.5rem .8rem;text-align:center;">
                    <div style="font-size:.78rem;color:#f59e0b;font-weight:700;">${PLAYER_ICONS[1]} ${p2Name}</div>
                    <div style="font-size:1.4rem;font-weight:900;color:#fff;">${scores[1]}</div>
                    ${currentPlayer===1?'<div style="font-size:.68rem;color:#f59e0b;">▶ Am Zug</div>':''}
                </div>
               </div>`
            : `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem;">
                <div style="font-size:1rem;font-weight:800;color:#f59e0b;text-transform:uppercase;">🕵️ Geheimauftrag</div>
                <span style="background:linear-gradient(90deg,#1d4ed8,#7c3aed);color:#fff;font-weight:800;font-size:.95rem;padding:.25rem .9rem;border-radius:20px;">⭐ ${scores[0]}</span>
               </div>`;

        var endBtn = done === total ? `<div style="text-align:center;margin-top:1rem;"><button id="game-end-btn" style="background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;color:#fff;font-weight:800;font-size:1rem;padding:.7rem 2rem;border-radius:12px;cursor:pointer;">🏆 Ergebnis anzeigen</button></div>` : '';

        return `<div style="padding:1.2rem 1rem;">
            ${scoreBar}
            <div style="background:#0f172a;border-radius:6px;height:5px;margin-bottom:1rem;overflow:hidden;">
                <div style="background:linear-gradient(90deg,#1d4ed8,#00d4ff);height:100%;width:${pct}%;transition:width .4s;border-radius:6px;"></div>
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:separate;border-spacing:3px;">
                    <thead><tr>${headerRow}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${endBtn}
        </div>`;
    }

    function renderQuestion() {
        var turnLabel = gameMode === '2p'
            ? `<div style="display:inline-block;background:rgba(0,0,0,.2);border:1px solid ${PLAYER_COLORS[currentPlayer]};border-radius:20px;padding:.25rem .9rem;font-size:.78rem;color:${PLAYER_COLORS[currentPlayer]};font-weight:700;margin-bottom:.8rem;">${PLAYER_ICONS[currentPlayer]} ${currentPlayer===0?p1Name:p2Name} ist am Zug</div>` : '';
        return `<div style="padding:2rem 1.5rem;text-align:center;">
            ${turnLabel}
            <div style="color:#f59e0b;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:.4rem;">${CATEGORIES[activeQ.catIdx].name}</div>
            <div style="background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;font-size:1.2rem;font-weight:800;padding:.35rem .9rem;border-radius:20px;display:inline-block;margin-bottom:1.2rem;">⭐ ${activeQ.pts}</div>
            <div style="background:#1e293b;border-radius:14px;padding:1.4rem;font-size:1.05rem;color:#f1f5f9;font-weight:600;line-height:1.5;margin-bottom:1.4rem;">${activeQ.q}</div>
            <div style="color:#64748b;font-size:.82rem;margin-bottom:.7rem;">Antwort eingeben:</div>
            <div style="display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;">
                <input id="game-answer-input" type="text" placeholder="Antwort…" autocomplete="off"
                    style="flex:1;min-width:180px;max-width:320px;padding:.65rem 1rem;border:2px solid ${PLAYER_COLORS[currentPlayer]};border-radius:12px;background:#0f172a;color:#fff;font-size:.95rem;">
                <button id="game-submit-btn" style="padding:.65rem 1.4rem;border:none;border-radius:12px;background:linear-gradient(135deg,${PLAYER_COLORS[currentPlayer]},#7c3aed);color:#fff;font-weight:700;font-size:.95rem;cursor:pointer;">Prüfen</button>
            </div>
            <div style="margin-top:.8rem;">
                <button id="game-skip-btn" style="background:none;border:1px solid #1e3a5f;color:#475569;padding:.35rem .9rem;border-radius:8px;cursor:pointer;font-size:.8rem;">⏭ Überspringen</button>
            </div>
        </div>`;
    }

    function renderAnswer() {
        var correct = lastCorrect;
        var icon = correct ? '✅' : '❌';
        var col  = correct ? '#4ade80' : '#f87171';
        var msg  = gameMode === '2p'
            ? (correct ? `${PLAYER_ICONS[currentPlayer]} ${currentPlayer===0?p1Name:p2Name}: Richtig! +${activeQ.pts} Punkte` : `${PLAYER_ICONS[currentPlayer]} ${currentPlayer===0?p1Name:p2Name}: Nicht ganz richtig!`)
            : (correct ? `Richtig! +${activeQ.pts} Punkte` : 'Nicht ganz richtig!');
        var wrongLine = (!correct && playerInput) ? `<div style="color:#94a3b8;font-size:.85rem;margin-bottom:.3rem;">Deine Antwort: <span style="color:#fbbf24;">${playerInput}</span></div>` : '';
        var scoreDisplay = gameMode === '2p'
            ? `<div style="display:flex;gap:.8rem;justify-content:center;font-size:.88rem;margin-bottom:1rem;"><span style="color:#3b82f6;">${PLAYER_ICONS[0]} ${scores[0]}</span><span style="color:#475569;">vs</span><span style="color:#f59e0b;">${PLAYER_ICONS[1]} ${scores[1]}</span></div>`
            : `<div style="color:#f59e0b;font-size:1rem;font-weight:700;margin-bottom:1rem;">⭐ Gesamt: ${scores[0]}</div>`;
        return `<div style="padding:2rem 1.5rem;text-align:center;">
            <div style="font-size:2.5rem;margin-bottom:.4rem;">${icon}</div>
            <div style="font-size:1.2rem;font-weight:800;color:${col};margin-bottom:.4rem;">${msg}</div>
            ${wrongLine}
            <div style="background:#1e293b;border-radius:12px;padding:.9rem;margin:1rem 0;">
                <div style="color:#64748b;font-size:.75rem;margin-bottom:.25rem;">Richtige Antwort:</div>
                <div style="color:#00d4ff;font-size:1.1rem;font-weight:700;">${activeQ.a}</div>
            </div>
            ${scoreDisplay}
            <button id="game-back-btn" style="padding:.65rem 1.8rem;border:none;border-radius:12px;background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;font-weight:700;font-size:.95rem;cursor:pointer;">← Zurück zum Board</button>
        </div>`;
    }

    function renderEnd() {
        var maxScore = CATEGORIES.reduce((s, c) => s + c.questions.reduce((ss, q) => ss + q.pts, 0), 0);
        if (gameMode === '2p') {
            var diff = scores[0] - scores[1];
            var isDraw = diff === 0;
            var right0 = Object.entries(answered).filter(e => e[1] === true && !e[0].includes('_winner') && answered[e[0]+'_winner'] === 0).length;
            var right1 = Object.entries(answered).filter(e => e[1] === true && !e[0].includes('_winner') && answered[e[0]+'_winner'] === 1).length;
            return `<div style="padding:2rem 1.5rem;text-align:center;">
                ${isDraw
                    ? `<div style="font-size:2.5rem;">🤝</div><div style="font-size:1.3rem;font-weight:800;color:#f59e0b;">Unentschieden!</div><div style="color:#64748b;font-size:.85rem;margin-bottom:1.5rem;">Beide: ${scores[0]} Punkte</div>`
                    : `<div style="font-size:2.5rem;">🏆</div><div style="font-size:1.3rem;font-weight:800;color:#f59e0b;">${diff>0?PLAYER_ICONS[0]+' '+p1Name:PLAYER_ICONS[1]+' '+p2Name} gewinnt!</div><div style="color:#64748b;font-size:.85rem;margin-bottom:1.5rem;">${diff>0?scores[0]:scores[1]} : ${diff>0?scores[1]:scores[0]} Punkte</div>`}
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-bottom:1.5rem;">
                    <div style="background:rgba(59,130,246,.1);border:2px solid ${diff>0?'#3b82f6':'#1e3a5f'};border-radius:14px;padding:1rem;">
                        <div style="color:#3b82f6;font-weight:700;font-size:.85rem;">${PLAYER_ICONS[0]} ${p1Name}</div>
                        <div style="font-size:2rem;font-weight:900;color:#fff;">${scores[0]}</div>
                        <div style="color:#475569;font-size:.75rem;">✅ ${right0} richtig</div>
                    </div>
                    <div style="background:rgba(245,158,11,.1);border:2px solid ${diff<0?'#f59e0b':'#1e3a5f'};border-radius:14px;padding:1rem;">
                        <div style="color:#f59e0b;font-weight:700;font-size:.85rem;">${PLAYER_ICONS[1]} ${p2Name}</div>
                        <div style="font-size:2rem;font-weight:900;color:#fff;">${scores[1]}</div>
                        <div style="color:#475569;font-size:.75rem;">✅ ${right1} richtig</div>
                    </div>
                </div>
                <button id="game-restart-btn" style="background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;color:#fff;font-weight:800;font-size:1rem;padding:.65rem 2rem;border-radius:12px;cursor:pointer;margin-right:.5rem;">🔄 Nochmal</button>
                <button id="game-newsetup-btn" style="background:none;border:1px solid #1e3a5f;color:#64748b;font-weight:700;font-size:.9rem;padding:.6rem 1.5rem;border-radius:12px;cursor:pointer;">⚙ Neues Spiel</button>
            </div>`;
        }
        var pct   = Math.round(scores[0] / maxScore * 100);
        var medal = pct >= 80 ? '🥇' : pct >= 50 ? '🥈' : '🥉';
        var msgEnd = pct >= 80 ? 'Ausgezeichneter Agent!' : pct >= 50 ? 'Guter Agent!' : 'Weiter trainieren!';
        var right = Object.values(answered).filter(v => v === true).length;
        var wrong = Object.keys(answered).filter(k => !k.includes('_winner')).length - right;
        return `<div style="padding:2rem 1.5rem;text-align:center;">
            <div style="font-size:3rem;">${medal}</div>
            <div style="font-size:1.4rem;font-weight:800;color:#f59e0b;">${msgEnd}</div>
            <div style="color:#64748b;margin-bottom:1.5rem;font-size:.85rem;">Mission abgeschlossen</div>
            <div style="background:#1e293b;border-radius:14px;padding:1.4rem;margin-bottom:1.4rem;">
                <div style="font-size:2.4rem;font-weight:900;color:#00d4ff;">${scores[0]}</div>
                <div style="color:#475569;font-size:.82rem;">von ${maxScore} Punkten (${pct}%)</div>
                <div style="background:#0f172a;border-radius:6px;height:7px;margin:.7rem 0;overflow:hidden;">
                    <div style="background:linear-gradient(90deg,#1d4ed8,#00d4ff);height:100%;width:${pct}%;border-radius:6px;"></div>
                </div>
                <div style="display:flex;justify-content:center;gap:1.5rem;font-size:.82rem;color:#64748b;">
                    <span>✅ ${right} richtig</span><span>❌ ${wrong} falsch</span>
                </div>
            </div>
            <button id="game-restart-btn" style="background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;color:#fff;font-weight:800;font-size:1rem;padding:.65rem 2rem;border-radius:12px;cursor:pointer;margin-right:.5rem;">🔄 Nochmal</button>
            <button id="game-newsetup-btn" style="background:none;border:1px solid #1e3a5f;color:#64748b;font-weight:700;font-size:.9rem;padding:.6rem 1.5rem;border-radius:12px;cursor:pointer;">⚙ Neues Spiel</button>
        </div>`;
    }

    function normalize(str) {
        return str.toLowerCase()
            .replace(/[äÄ]/g,'a').replace(/[öÖ]/g,'o').replace(/[üÜ]/g,'u').replace(/ß/g,'ss')
            .replace(/[^a-z0-9\/\+=\-]/g,'').trim();
    }

    function attachListeners() {
        var root = document.getElementById('game-root');
        if (!root) return;
        var btn1p = document.getElementById('btn-1p');
        var btn2p = document.getElementById('btn-2p');
        var namesWrap = document.getElementById('player-names-wrap');
        var rule2p    = document.getElementById('rule-2p-extra');
        if (btn1p) btn1p.addEventListener('click', function() {
            gameMode = '1p';
            btn1p.style.borderColor='#1d4ed8'; btn1p.style.background='linear-gradient(135deg,rgba(29,78,216,.15),rgba(124,58,237,.15))';
            btn2p.style.borderColor='#1e3a5f'; btn2p.style.background='rgba(255,255,255,.03)';
            if (namesWrap) namesWrap.style.display='none';
            if (rule2p)    rule2p.style.display='none';
        });
        if (btn2p) btn2p.addEventListener('click', function() {
            gameMode = '2p';
            btn2p.style.borderColor='#f59e0b'; btn2p.style.background='linear-gradient(135deg,rgba(245,158,11,.15),rgba(239,68,68,.1))';
            btn1p.style.borderColor='#1e3a5f'; btn1p.style.background='rgba(255,255,255,.03)';
            if (namesWrap) namesWrap.style.display='block';
            if (rule2p)    rule2p.style.display='block';
        });
        var startBtn = document.getElementById('btn-start-game');
        if (startBtn) startBtn.addEventListener('click', function() {
            var p1in = document.getElementById('p1-name-input');
            var p2in = document.getElementById('p2-name-input');
            if (p1in && p1in.value.trim()) p1Name = p1in.value.trim();
            if (p2in && p2in.value.trim()) p2Name = p2in.value.trim();
            scores = [0,0]; answered = {}; currentPlayer = 0; phase = 'board';
            render();
        });
        root.querySelectorAll('button[data-cat]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ci = parseInt(btn.dataset.cat);
                var qi = parseInt(btn.dataset.q);
                activeQ = Object.assign({ catIdx: ci, qIdx: qi }, CATEGORIES[ci].questions[qi]);
                phase = 'question'; render();
            });
        });
        var endBtn = document.getElementById('game-end-btn');
        if (endBtn) endBtn.addEventListener('click', function() { phase = 'end'; render(); });

        var submitBtn = document.getElementById('game-submit-btn');
        var inputEl   = document.getElementById('game-answer-input');
        function checkAnswer() {
            playerInput = inputEl ? inputEl.value.trim() : '';
            var correct = normalize(playerInput) === normalize(activeQ.a);
            lastCorrect = correct;
            var key = activeQ.catIdx + '-' + activeQ.qIdx;
            answered[key] = correct;
            if (correct) { scores[currentPlayer] += activeQ.pts; answered[key+'_winner'] = currentPlayer; }
            phase = 'answer'; render();
        }
        if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
        if (inputEl)   inputEl.addEventListener('keydown', function(e){ if(e.key==='Enter') checkAnswer(); });
        var skipBtn = document.getElementById('game-skip-btn');
        if (skipBtn) skipBtn.addEventListener('click', function() {
            playerInput = ''; lastCorrect = false;
            var key = activeQ.catIdx + '-' + activeQ.qIdx;
            answered[key] = false; phase = 'answer'; render();
        });
        var backBtn = document.getElementById('game-back-btn');
        if (backBtn) backBtn.addEventListener('click', function() {
            if (gameMode === '2p') currentPlayer = (currentPlayer + 1) % 2;
            phase = 'board'; render();
        });
        var restartBtn = document.getElementById('game-restart-btn');
        if (restartBtn) restartBtn.addEventListener('click', function() {
            scores=[0,0]; answered={}; phase='board'; activeQ=null; currentPlayer=0; render();
        });
        var newSetupBtn = document.getElementById('game-newsetup-btn');
        if (newSetupBtn) newSetupBtn.addEventListener('click', function() {
            scores=[0,0]; answered={}; phase='setup'; activeQ=null; currentPlayer=0; render();
        });
        if (inputEl) setTimeout(function(){ inputEl.focus(); }, 50);
    }
});