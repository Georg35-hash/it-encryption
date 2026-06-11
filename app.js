// Encryption Methods
function caesarEncrypt(text, shift = 3) {
    return text.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        } else if (char.match(/[a-z]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}

function caesarDecrypt(text, shift = 3) {
    return text.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        } else if (char.match(/[a-z]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        }
        return char;
    }).join('');
}

function atbashEncrypt(text) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const reversed = alphabet.split('').reverse().join('');
    return text.split('').map(char => {
        const upper = char.toUpperCase();
        if (alphabet.includes(upper)) {
            const newIndex = alphabet.indexOf(upper);
            return char === char.toLowerCase() ? reversed[newIndex].toLowerCase() : reversed[newIndex];
        }
        return char;
    }).join('');
}

function atbashDecrypt(text) { return atbashEncrypt(text); }

function binaryEncode(text) {
    return text.split('').map(char => {
        if (char.match(/[A-Za-z]/)) return char.charCodeAt(0).toString(2).padStart(8, '0');
        return char === ' ' ? ' ' : char;
    }).join(' ');
}

function binaryDecode(text) {
    return text.split(' ').map(bin => bin.match(/^[01]+$/) ? String.fromCharCode(parseInt(bin, 2)) : bin).join('');
}

function base64Encrypt(text) { return btoa(text); }
function base64Decrypt(text) { try { return atob(text); } catch(e) { return 'Invalid Base64!'; } }

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

// QR Code Generation - stores encrypted text directly in QR
function generateQRCode(text, method) {
    const container = document.getElementById('qr-code-container');
    container.innerHTML = '';
    // QR contains the encrypted text + method for scanning
    const qrData = `DECRYPT:${method}:${text}`;
    const size = 200;
    const qrUrl = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(qrData)}&choe=UTF-8`;
    const img = document.createElement('img');
    img.src = qrUrl;
    img.alt = 'QR Code';
    img.style.maxWidth = '100%';
    container.appendChild(img);
}

// DOM Elements
const messageInput = document.getElementById('message-input');
const methodSelect = document.getElementById('method-select');
const encryptedOutput = document.getElementById('encrypted-output');
const decryptInput = document.getElementById('decrypt-input');
const decryptMethod = document.getElementById('decrypt-method');
const decryptedOutput = document.getElementById('decrypted-output');

// Event Listeners
document.getElementById('generate-btn').addEventListener('click', () => {
    const text = messageInput.value;
    if (text) {
        const method = methodSelect.value;
        const encrypted = encrypt(text, method);
        encryptedOutput.textContent = encrypted;
        generateQRCode(encrypted, method);
    }
});

document.getElementById('decrypt-btn').addEventListener('click', () => {
    const text = decryptInput.value;
    if (text) { decryptedOutput.textContent = decrypt(text, decryptMethod.value); }
});

document.getElementById('show-solution-btn').addEventListener('click', () => {
    if (messageInput.value) decryptedOutput.textContent = messageInput.value;
});

// Puzzle - encrypted word: GEHEIM (German)
const quizEncrypted = document.getElementById('quiz-encrypted');
const puzzleDecryptInput = document.getElementById('puzzle-decrypt-input');
const puzzleResult = document.getElementById('puzzle-result');
quizEncrypted.textContent = caesarEncrypt('GEHEIM', 3);

document.getElementById('check-puzzle').addEventListener('click', () => {
    if (puzzleDecryptInput.value.toUpperCase().trim() === 'GEHEIM') {
        puzzleResult.textContent = '✅ Richtig! Du bist ein echter Spion!';
        puzzleResult.style.color = '#4CAF50';
    } else {
        puzzleResult.textContent = '❌ Falsch! Versuche es nochmal!';
        puzzleResult.style.color = '#ff6b6b';
    }
});

document.getElementById('show-solution').addEventListener('click', () => {
    puzzleResult.textContent = 'Lösung: GEHEIM';
    puzzleResult.style.color = '#ffa500';
    puzzleDecryptInput.value = 'GEHEIM';
});

// Multi-choice quiz
document.getElementById('check-quiz').addEventListener('click', () => {
    const answers = { q1: 'C', q2: 'B', q3: 'C', q4: 'B', q5: 'A', q6: 'D', q7: 'C' };
    let score = 0;
    for (let i = 1; i <= 7; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === answers[`q${i}`]) score++;
    }
    const scoreElement = document.getElementById('quiz-score');
    scoreElement.textContent = `Deine Punkte: ${score} von 7`;
    scoreElement.style.color = score >= 5 ? '#4CAF50' : '#ff6b6b';
});

// Auto-decrypt from URL or QR code scanning
function autoDecryptFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let msg = urlParams.get('msg');
    let method = urlParams.get('method');
    
    // Check hash for QR data (format: #DECRYPT:method:text)
    if (!msg && window.location.hash) {
        const hashData = window.location.hash.substring(1);
        const parts = hashData.split(':');
        if (parts[0] === 'DECRYPT' && parts.length >= 3) {
            method = parts[1];
            msg = parts.slice(2).join(':'); // Handle colons in text
        }
    }
    
    if (msg && method) {
        const decrypted = decrypt(msg, method);
        const isGerman = window.location.pathname.includes('index.html');
        document.querySelector('.encoder-section').innerHTML = `
            <div class="container">
                <h2>${isGerman ? '🔓 Gescannte Nachricht' : '🔓 Отсканированное сообщение'}</h2>
                <div class="encoder-card">
                    <p>${isGerman ? 'Verschlüsselte Nachricht:' : 'Зашифрованное сообщение:'}</p>
                    <div class="result-box" style="background:#ff6b6b;">${msg}</div>
                    <p>${isGerman ? 'Entschlüsselte Nachricht:' : 'Расшифрованное сообщение:'}</p>
                    <div class="result-box" style="background:#4CAF50;font-size:1.3rem;">${decrypted}</div>
                    <button onclick="window.location.href='${window.location.pathname}'" class="btn-primary">${isGerman ? 'Neue Nachricht' : 'Новое сообщение'}</button>
                </div>
            </div>
        `;
    }
}

autoDecryptFromURL();