// 数据留存系统
const DATA_CONFIG = { version: '1.0', storageKey: 'longmai_data', maxRecords: 10000 };

function initDataTracking() {
    if (!localStorage.getItem(DATA_CONFIG.storageKey)) {
        localStorage.setItem(DATA_CONFIG.storageKey, JSON.stringify({ version: DATA_CONFIG.version, createdAt: new Date().toISOString(), records: [] }));
    }
    trackPageView({ type: 'page_load', url: window.location.href, title: document.title, timestamp: new Date().toISOString() });
}

function trackPageView(data) {
    const record = { id: Date.now().toString(36), type: 'page_view', userAgent: navigator.userAgent, screenSize: `${window.screen.width}x${window.screen.height}`, ...data, timestamp: new Date().toISOString() };
    saveRecord(record);
}

function trackUserAction(action, data = {}) {
    const record = { id: Date.now().toString(36), type: 'user_action', action: action, page: window.location.href, ...data, timestamp: new Date().toISOString() };
    saveRecord(record);
}

function trackRegistration(userData) {
    const record = { id: Date.now().toString(36), type: 'registration', phone: userData.phone, agreements: { userAgreement: userData.agreeUser, privacyPolicy: userData.agreePrivacy, disclaimer: userData.agreeDisclaimer, sensitiveInfo: userData.agreeSensitive }, timestamp: new Date().toISOString() };
    saveRecord(record);
}

function saveRecord(record) {
    try {
        const data = JSON.parse(localStorage.getItem(DATA_CONFIG.storageKey));
        data.records.push(record);
        if (data.records.length > DATA_CONFIG.maxRecords) data.records = data.records.slice(-DATA_CONFIG.maxRecords);
        localStorage.setItem(DATA_CONFIG.storageKey, JSON.stringify(data));
    } catch (error) { console.error('保存失败:', error); }
}

function getAllRecords() {
    try { return JSON.parse(localStorage.getItem(DATA_CONFIG.storageKey)).records; } catch (error) { return []; }
}

function exportData() {
    const data = getAllRecords();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `longmai_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', initDataTracking);

window.DataTracking = { trackPageView, trackUserAction, trackRegistration, getAllRecords, exportData };
