// Made by UneadKnight905

// Global State
const state = {
    mode: 'single', // 'single' or 'multi'
    selectedAI: null,
    activeAIs: [],
    aiModels: [], // Will load from local storage or config
    messages: [],
    currentTheme: 'purple',
    currentBackground: 'gradient1',
    backgroundImage: null,
    chatHistory: [], // Array of past chat sessions
    sessionStartTime: Date.now(),
    responseTimeAvg: 0,
    responseTimes: [],
    attachedImage: null
};

// UI Elements
let aiListEl;
let messagesContainerEl;
let messageInputEl;
let sendBtnEl;
let addAiBtnEl;
let statusBtnEl;
let modeButtonsEl;
let activeAisContainerEl;
let activeAiBadgesEl;
let aiFilePickerEl;
let backgroundImagePickerEl;
let burgerMenuBtnEl;
let burgerMenuPanelEl;
let closeMenuBtnEl;
let clearChatsBtnEl;
let exportChatsBtnEl;
let pastChatsListEl;
let uploadBgBtnEl;
let statusPanelEl;
let closeStatusBtnEl;
let attachImageBtnEl;
let chatImagePickerEl;

// Initialize
function init() {
    cacheElements();
    loadAIModels();
    loadTheme();
    loadBackground();
    loadChatHistory();
    setupEventListeners();
    renderAIList();
    renderPastChats();
}

// Cache DOM Elements
function cacheElements() {
    aiListEl = document.getElementById('aiList');
    messagesContainerEl = document.getElementById('messagesContainer');
    messageInputEl = document.getElementById('messageInput');
    sendBtnEl = document.getElementById('sendBtn');
    addAiBtnEl = document.getElementById('addAiBtn');
    statusBtnEl = document.getElementById('statusBtn');
    modeButtonsEl = document.querySelectorAll('.mode-btn');
    activeAisContainerEl = document.getElementById('activeAisContainer');
    activeAiBadgesEl = document.getElementById('activeAiBadges');
    aiFilePickerEl = document.getElementById('aiFilePicker');
    backgroundImagePickerEl = document.getElementById('backgroundImagePicker');
    burgerMenuBtnEl = document.getElementById('burgerMenuBtn');
    burgerMenuPanelEl = document.getElementById('burgerMenuPanel');
    closeMenuBtnEl = document.getElementById('closeMenuBtn');
    clearChatsBtnEl = document.getElementById('clearChatsBtn');
    exportChatsBtnEl = document.getElementById('exportChatsBtn');
    pastChatsListEl = document.getElementById('pastChatsList');
    uploadBgBtnEl = document.getElementById('uploadBgBtn');
    statusPanelEl = document.getElementById('statusPanel');
    closeStatusBtnEl = document.getElementById('closeStatusBtn');
    attachImageBtnEl = document.getElementById('attachImageBtn');
    chatImagePickerEl = document.getElementById('chatImagePicker');
}

// Load AI Models from Storage
function loadAIModels() {
    const saved = localStorage.getItem('aiModels');
    if (saved) {
        state.aiModels = JSON.parse(saved);
    }
}

// Save AI Models to Storage
function saveAIModels() {
    localStorage.setItem('aiModels', JSON.stringify(state.aiModels));
}

// Setup Event Listeners
function setupEventListeners() {
    addAiBtnEl.addEventListener('click', handleAddAI);
    statusBtnEl.addEventListener('click', toggleStatusPanel);
    sendBtnEl.addEventListener('click', handleSendMessage);
    aiFilePickerEl.addEventListener('change', handleFileSelected);
    backgroundImagePickerEl.addEventListener('change', handleBackgroundImageSelected);
    burgerMenuBtnEl.addEventListener('click', toggleBurgerMenu);
    closeMenuBtnEl.addEventListener('click', closeBurgerMenu);
    closeStatusBtnEl.addEventListener('click', closeStatusPanel);
    clearChatsBtnEl.addEventListener('click', handleClearChats);
    exportChatsBtnEl.addEventListener('click', handleExportChats);
    uploadBgBtnEl.addEventListener('click', () => backgroundImagePickerEl.click());
    attachImageBtnEl.addEventListener('click', () => chatImagePickerEl.click());
    chatImagePickerEl.addEventListener('change', handleChatImageSelected);
    messageInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            updateThemeButton();
        });
    });

    // Background preset buttons
    document.querySelectorAll('.bg-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const bg = btn.dataset.bg;
            if (bg) {
                applyBackground(bg);
                updateBackgroundButton();
            }
        });
    });

    modeButtonsEl.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeButtonsEl.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.mode = e.target.dataset.mode;
            updateActiveAIsDisplay();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.burger-menu-panel') && !e.target.closest('.burger-menu-btn')) {
            closeBurgerMenu();
        }
    });
}

// Render AI List
function renderAIList() {
    if (state.aiModels.length === 0) {
        aiListEl.innerHTML = `
            <div class="empty-state-text" style="font-size: 12px; padding: 20px; text-align: center; color: #999;">
                No AIs added yet. Click "Add AI" to get started!
            </div>
        `;
        return;
    }

    aiListEl.innerHTML = state.aiModels.map(ai => `
        <div class="ai-item ${state.selectedAI?.id === ai.id ? 'active' : ''}" data-ai-id="${ai.id}">
            <div>
                <div class="ai-item-name">${ai.name}</div>
                <div class="ai-item-path" style="font-size: 11px; color: #999; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${ai.filePath ? ai.filePath.split('\\').pop() : 'No file'}
                </div>
            </div>
            <div class="ai-item-status"></div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.ai-item').forEach(item => {
        item.addEventListener('click', () => selectAI(item.dataset.aiId));
    });
}

// Select AI
function selectAI(aiId) {
    const ai = state.aiModels.find(a => a.id === aiId);
    if (ai) {
        state.selectedAI = ai;
        if (state.mode === 'single') {
            state.activeAIs = [ai];
        }
        renderAIList();
        updateActiveAIsDisplay();
        enableChat();
        clearMessages();
    }
}

// Update Active AIs Display
function updateActiveAIsDisplay() {
    if (state.mode === 'single') {
        if (state.selectedAI) {
            activeAiBadgesEl.innerHTML = `
                <div class="ai-badge">
                    ${state.selectedAI.name}
                    <button class="remove-btn" onclick="toggleAI('${state.selectedAI.id}')">×</button>
                </div>
            `;
            activeAisContainerEl.style.display = 'flex';
        } else {
            activeAisContainerEl.style.display = 'none';
        }
    } else {
        // Multi mode
        if (state.activeAIs.length > 0) {
            activeAiBadgesEl.innerHTML = state.activeAIs.map(ai => `
                <div class="ai-badge">
                    ${ai.name}
                    <button class="remove-btn" onclick="toggleAI('${ai.id}')">×</button>
                </div>
            `).join('');
            activeAisContainerEl.style.display = 'flex';
        } else {
            activeAisContainerEl.style.display = 'none';
        }
    }
}

// Toggle AI in Multi Mode
window.toggleAI = function(aiId) {
    const ai = state.aiModels.find(a => a.id === aiId);
    if (ai) {
        const index = state.activeAIs.findIndex(a => a.id === aiId);
        if (index > -1) {
            state.activeAIs.splice(index, 1);
        } else {
            state.activeAIs.push(ai);
        }
        updateActiveAIsDisplay();
        if (state.activeAIs.length === 0) {
            disableChat();
        } else {
            enableChat();
        }
    }
};

// Enable Chat
function enableChat() {
    messageInputEl.disabled = false;
    sendBtnEl.disabled = false;
}

// Disable Chat
function disableChat() {
    messageInputEl.disabled = true;
    sendBtnEl.disabled = true;
}

// Clear Messages
function clearMessages() {
    state.messages = [];
    messagesContainerEl.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">💬</div>
            <div class="empty-state-text">Start a conversation</div>
        </div>
    `;
}

// Add Message
function addMessage(text, sender, aiName = null, image = null) {
    const message = {
        id: Date.now(),
        text,
        sender,
        aiName,
        image,
        timestamp: new Date()
    };
    state.messages.push(message);
    renderMessages();
}

// Render Messages
function renderMessages() {
    if (state.messages.length === 0) {
        messagesContainerEl.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <div class="empty-state-text">Start a conversation</div>
            </div>
        `;
        return;
    }

    messagesContainerEl.innerHTML = state.messages.map(msg => `
        <div class="message ${msg.sender}">
            <div>
                <div class="message-avatar">${msg.sender === 'user' ? '👤' : '🤖'}</div>
            </div>
            <div>
                ${msg.image ? `<img src="${msg.image}" class="message-image" alt="Message image">` : ''}
                <div class="message-content">${escapeHtml(msg.text)}</div>
                ${msg.aiName ? `<div class="message-sender">${msg.aiName}</div>` : ''}
            </div>
        </div>
    `).join('');

    // Auto-scroll to bottom
    messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
}

// Handle Send Message
async function handleSendMessage() {
    const text = messageInputEl.value.trim();
    if (!text && !state.attachedImage) return;

    messageInputEl.value = '';
    addMessage(text, 'user', null, state.attachedImage);
    state.attachedImage = null;
    
    const startTime = performance.now();

    // Simulate AI responses
    setTimeout(() => {
        if (state.mode === 'single') {
            addMessage(`Response from ${state.selectedAI.name}: ${text.toUpperCase()}`, 'ai', state.selectedAI.name);
            const endTime = performance.now();
            state.responseTimes.push(endTime - startTime);
            saveChatSession();
        } else {
            // Multi mode - get responses from all active AIs
            state.activeAIs.forEach((ai, index) => {
                setTimeout(() => {
                    addMessage(`Response from ${ai.name}: ${text.toUpperCase()}`, 'ai', ai.name);
                    if (index === state.activeAIs.length - 1) {
                        const endTime = performance.now();
                        state.responseTimes.push(endTime - startTime);
                        saveChatSession();
                    }
                }, (index + 1) * 500);
            });
        }
    }, 300);
}

// Handle Chat Image Selected
function handleChatImageSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        state.attachedImage = e.target.result;
    };
    reader.readAsDataURL(file);
    chatImagePickerEl.value = '';
}

// Handle Add AI - Trigger File Picker
function handleAddAI() {
    aiFilePickerEl.click();
}

// Handle File Selected
function handleFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const filePath = file.webkitRelativePath || file.name;
    const fileSize = file.size;

    // Extract AI name from file name (remove extension)
    const aiName = fileName.split('.').slice(0, -1).join('.');

    const newAI = {
        id: Date.now().toString(),
        name: aiName || 'Unnamed AI',
        filePath: filePath,
        fileName: fileName,
        fileSize: fileSize,
        type: 'local',
        status: 'ready',
        addedDate: new Date().toISOString(),
        lastUsed: null
    };

    state.aiModels.push(newAI);
    saveAIModels();
    renderAIList();

    // Reset file picker
    aiFilePickerEl.value = '';
}

// Handle Settings (removed - replaced with status panel)

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== STATUS PANEL FUNCTIONS ==========

// Toggle Status Panel
function toggleStatusPanel() {
    if (statusPanelEl.classList.contains('show')) {
        closeStatusPanel();
    } else {
        openStatusPanel();
    }
}

// Open Status Panel
function openStatusPanel() {
    statusPanelEl.classList.add('show');
    updateStatusDisplay();
}

// Close Status Panel
function closeStatusPanel() {
    statusPanelEl.classList.remove('show');
}

// Update Status Display
function updateStatusDisplay() {
    // Update Statistics
    document.getElementById('aiCountStat').textContent = state.aiModels.length;
    document.getElementById('messageStat').textContent = state.messages.length;
    document.getElementById('chatSessionStat').textContent = state.chatHistory.length;
    
    // Calculate session time
    const sessionDuration = Math.floor((Date.now() - state.sessionStartTime) / 1000);
    const hours = Math.floor(sessionDuration / 3600);
    const minutes = Math.floor((sessionDuration % 3600) / 60);
    document.getElementById('sessionTimeStat').textContent = `${hours}:${String(minutes).padStart(2, '0')}`;

    // System Information
    document.getElementById('browserInfo').textContent = getBrowserInfo();
    document.getElementById('storageInfo').textContent = getStorageInfo();
    document.getElementById('themeInfo').textContent = state.currentTheme.charAt(0).toUpperCase() + state.currentTheme.slice(1);
    document.getElementById('modeInfo').textContent = state.mode === 'single' ? 'Single AI' : 'Super AI (Multi)';
    document.getElementById('activeAisInfo').textContent = state.activeAIs.length > 0 ? state.activeAIs.map(ai => ai.name).join(', ') : 'None';

    // Performance Stats
    const avgResponseTime = state.responseTimes.length > 0 
        ? (state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length).toFixed(0)
        : 0;
    document.getElementById('responseTimeInfo').textContent = avgResponseTime + 'ms';
    
    const messagesPerHour = state.messages.length > 0 
        ? (state.messages.length / Math.max(1, sessionDuration / 3600)).toFixed(1)
        : 0;
    document.getElementById('messagesPerHourInfo').textContent = messagesPerHour;

    // AI List
    updateAIListCompact();
}

// Get Browser Info
function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    return 'Unknown';
}

// Get Storage Info
function getStorageInfo() {
    try {
        let used = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                used += localStorage[key].length + key.length;
            }
        }
        const kb = (used / 1024).toFixed(2);
        return kb + ' KB';
    } catch (e) {
        return 'N/A';
    }
}

// Update AI List Compact
function updateAIListCompact() {
    const container = document.getElementById('aiListCompact');
    if (state.aiModels.length === 0) {
        container.innerHTML = '<div style="color: #999; font-size: 12px;">No AIs loaded</div>';
        return;
    }

    container.innerHTML = state.aiModels.map(ai => `
        <div class="ai-item-compact">
            <div>
                <div class="ai-name-compact">${ai.name}</div>
                <div style="font-size: 11px; color: #999;">${ai.fileName || 'Local Model'}</div>
            </div>
            <div class="ai-status-compact"></div>
        </div>
    `).join('');
}

// ========== BURGER MENU & THEME FUNCTIONS ==========

// Toggle Burger Menu
function toggleBurgerMenu() {
    burgerMenuPanelEl.classList.toggle('open');
}

// Close Burger Menu
function closeBurgerMenu() {
    burgerMenuPanelEl.classList.remove('open');
}

// Load Theme from Storage
function loadTheme() {
    const savedTheme = localStorage.getItem('uiTheme') || 'purple';
    state.currentTheme = savedTheme;
    applyTheme(savedTheme);
}

// Apply Theme
function applyTheme(theme) {
    const themes = {
        purple: { primary: '#667eea', secondary: '#764ba2' },
        blue: { primary: '#667eea', secondary: '#0084ff' },
        pink: { primary: '#f093fb', secondary: '#f5576c' },
        green: { primary: '#11998e', secondary: '#38ef7d' },
        orange: { primary: '#fa7e1e', secondary: '#fcb045' },
        dark: { primary: '#2d3436', secondary: '#636e72' }
    };

    const colors = themes[theme] || themes.purple;
    state.currentTheme = theme;

    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);

    // Update all gradient backgrounds
    const headerStyle = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
    
    document.querySelectorAll('.main-header, .sidebar-header, .menu-header').forEach(el => {
        el.style.background = headerStyle;
    });

    // Update buttons
    document.querySelectorAll('.btn-primary, .send-btn').forEach(el => {
        el.style.background = headerStyle;
    });

    // Save theme preference
    localStorage.setItem('uiTheme', theme);

    // Update active theme button
    updateThemeButton();
}

// Update Active Theme Button
function updateThemeButton() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${state.currentTheme}"]`).classList.add('active');
}

// ========== BACKGROUND FUNCTIONS ==========

// Load Background from Storage
function loadBackground() {
    const savedBg = localStorage.getItem('uiBackground') || 'gradient1';
    const savedBgImage = localStorage.getItem('uiBackgroundImage');
    
    state.currentBackground = savedBg;
    if (savedBgImage) {
        state.backgroundImage = savedBgImage;
        applyBackgroundImage(savedBgImage);
    } else {
        applyBackground(savedBg);
    }
}

// Apply Background
function applyBackground(bg) {
    // Remove all background classes
    document.body.className = '';
    
    const bgMappings = {
        gradient1: 'bg-gradient1',
        gradient2: 'bg-gradient2',
        gradient3: 'bg-gradient3',
        solid: 'bg-solid'
    };

    if (bgMappings[bg]) {
        document.body.classList.add(bgMappings[bg]);
        state.currentBackground = bg;
        state.backgroundImage = null;
        localStorage.setItem('uiBackground', bg);
        localStorage.removeItem('uiBackgroundImage');
        updateBackgroundButton();
    }
}

// Apply Background Image
function applyBackgroundImage(imageDataUrl) {
    document.body.classList.add('bg-custom');
    document.body.style.backgroundImage = `url('${imageDataUrl}')`;
    state.backgroundImage = imageDataUrl;
    state.currentBackground = 'custom';
    localStorage.setItem('uiBackgroundImage', imageDataUrl);
    updateBackgroundButton();
}

// Handle Background Image Selection
function handleBackgroundImageSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        applyBackgroundImage(imageDataUrl);
    };
    reader.readAsDataURL(file);

    // Reset file picker
    backgroundImagePickerEl.value = '';
}

// Update Active Background Button
function updateBackgroundButton() {
    document.querySelectorAll('.bg-preset-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (state.backgroundImage) {
        // Custom image is active, but no button to mark
    } else {
        const activeBtn = document.querySelector(`[data-bg="${state.currentBackground}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
}

// ========== CHAT HISTORY FUNCTIONS ==========

// Load Chat History from Storage
function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        state.chatHistory = JSON.parse(saved);
    }
}

// Save Chat History to Storage
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
}

// Save Current Chat Session
function saveChatSession() {
    if (state.messages.length === 0) return;

    const session = {
        id: Date.now().toString(),
        aiName: state.selectedAI ? state.selectedAI.name : 'Unknown AI',
        messageCount: state.messages.length,
        firstMessage: state.messages[0]?.text.substring(0, 50) + '...' || '',
        date: new Date().toLocaleString(),
        timestamp: Date.now(),
        messages: state.messages.map(m => ({
            text: m.text,
            sender: m.sender,
            aiName: m.aiName
        }))
    };

    state.chatHistory.unshift(session);
    
    // Keep only last 50 sessions
    if (state.chatHistory.length > 50) {
        state.chatHistory = state.chatHistory.slice(0, 50);
    }

    saveChatHistory();
    renderPastChats();
}

// Render Past Chats List
function renderPastChats() {
    if (state.chatHistory.length === 0) {
        pastChatsListEl.innerHTML = '<div class="no-chats-text">No past chats yet</div>';
        return;
    }

    pastChatsListEl.innerHTML = state.chatHistory.map(chat => `
        <div class="past-chat-item" onclick="loadPastChat('${chat.id}')">
            <div><strong>${chat.aiName}</strong></div>
            <div>${chat.firstMessage}</div>
            <div class="past-chat-date">${new Date(chat.timestamp).toLocaleDateString()}</div>
        </div>
    `).join('');
}

// Load Past Chat
window.loadPastChat = function(chatId) {
    const chat = state.chatHistory.find(c => c.id === chatId);
    if (!chat) return;

    state.messages = chat.messages;
    renderMessages();
    closeBurgerMenu();
};

// Handle Clear Chats
function handleClearChats() {
    if (confirm('Are you sure you want to delete all past chats? This cannot be undone.')) {
        state.chatHistory = [];
        saveChatHistory();
        renderPastChats();
    }
}

// Handle Export Chats
function handleExportChats() {
    if (state.chatHistory.length === 0) {
        alert('No chats to export!');
        return;
    }

    const exportData = {
        exportDate: new Date().toLocaleString(),
        totalSessions: state.chatHistory.length,
        sessions: state.chatHistory
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UltraAI_ChatExport_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
