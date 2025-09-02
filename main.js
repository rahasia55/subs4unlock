let selectedActions = new Set();
let generatedUnlockUrl = '';

function debugLog(message, data = null) {
    console.log(`[Subs4Unlock] ${message}`, data || '');
}

function toggleAction(button, actionType) {
    debugLog('Toggle action called:', actionType);

    const inputElement = document.getElementById(actionType + '-input');
    const wasSelected = selectedActions.has(actionType);

    if (wasSelected) {
        selectedActions.delete(actionType);
        button.classList.remove('selected');
        if (inputElement) {
            inputElement.style.opacity = '0';
            inputElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                inputElement.style.display = 'none';
            }, 300);
        }
        debugLog('Deselected:', actionType);
    } else {
        selectedActions.add(actionType);
        button.classList.add('selected');
        if (inputElement) {
            inputElement.style.display = 'block';
            setTimeout(() => {
                inputElement.style.opacity = '1';
                inputElement.style.transform = 'translateY(0)';
            }, 10);
        }
        debugLog('Selected:', actionType);
    }

    debugLog('Current selections:', Array.from(selectedActions));
    updateUI();
}

function updateUI() {
    const generateBtn = document.querySelector('.generate-btn');
    const mainUrlInput = document.getElementById('main-url');

    if (selectedActions.size > 0 && mainUrlInput.value.trim()) {
        generateBtn.style.opacity = '1';
        generateBtn.style.cursor = 'pointer';
    } else {
        generateBtn.style.opacity = '0.7';
        generateBtn.style.cursor = 'not-allowed';
    }
}

function generateLink() {
    const mainUrl = document.getElementById('main-url').value;

    if (!mainUrl) {
        alert('Silakan masukkan URL untuk dikunci');
        return;
    }

    if (selectedActions.size === 0) {
        alert('Silakan pilih setidaknya satu aksi');
        return;
    }

    let allValid = true;
    let actionData = {};
    let actionIcons = {
        'subscribe': 'youtube-icon',
        'like': 'youtube-icon',
        'second': 'youtube-icon',
        'discord': 'discord-icon',
        'ig-follow': 'instagram-icon',
        'ig-like': 'instagram-icon',
        'fb-follow': 'facebook-icon',
        'telegram': 'telegram-icon',
        'website': 'globe-icon'
    };

    selectedActions.forEach(action => {
        const input = document.querySelector(`#${action}-input input`);
        if (input && !input.value) {
            allValid = false;
        } else if (input) {
            actionData[action] = {
                url: input.value,
                icon: actionIcons[action]
            };
        }
    });

    if (!allValid) {
        alert('Silakan isi semua kolom yang diperlukan untuk aksi yang dipilih');
        return;
    }

    const unlockId = Math.random().toString(36).substring(2, 10);
    generatedUnlockUrl = `https://skinminecr.blogspot.com/2025/09/subs4unlock-get.html?m=1${unlockId}`;

    const linkData = {
        id: unlockId,
        originalUrl: mainUrl,
        actions: Array.from(selectedActions),
        actionData: actionData,
        created: new Date().toISOString()
    };

    localStorage.setItem('unlock_' + unlockId, JSON.stringify(linkData));

    document.getElementById('generated-link').textContent = generatedUnlockUrl;
    document.getElementById('result-section').classList.add('show');

    document.getElementById('result-section').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function copyLink() {
    const linkText = document.getElementById('generated-link').textContent;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(linkText).then(() => {
            alert('✅ Tautan disalin ke papan klip!');
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = linkText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Tautan disalin ke papan klip!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    debugLog('Halaman utama dimuat dengan sukses');

    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const actionType = this.getAttribute('data-action');
            if (actionType) {
                toggleAction(this, actionType);
            }
        });

        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', function() {
            setTimeout(() => {
                if (!this.classList.contains('selected')) {
                    this.style.transform = '';
                }
            }, 100);
        });

        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });

        button.addEventListener('touchend', function() {
            setTimeout(() => {
                if (!this.classList.contains('selected')) {
                    this.style.transform = '';
                }
            }, 100);
        });
    });

    document.querySelector('.generate-btn').addEventListener('click', function(e) {
        e.preventDefault();
        generateLink();
    });

    document.getElementById('main-url').addEventListener('input', updateUI);

    debugLog('Semua event listener berhasil ditambahkan');
});
