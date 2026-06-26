// ================= DATA & GLOBALS =================
let JAVA_DATA = [];
let TOPIC_DETAILS = {};

let javaState = JSON.parse(localStorage.getItem('java_master_state')) || { activeTab: 0, completed: {} };

// ================= INIT & FETCH =================
async function loadDataAndInit() {
    try {
        document.getElementById('headerTitle').innerText = "Loading Knowledge Base...";
        
        // 1. Force Fresh Data (Cache Busting)
        const t = Date.now();
        
        const [javaRes, detailsRes] = await Promise.all([
            fetch(`data/java.json?t=${t}`),
            fetch(`data/details.json?t=${t}`)
        ]);

        // 2. Debugging Helper Function
        const safeJsonParse = async (response, name) => {
            const text = await response.text(); 
            if (!text || text.trim() === "") {
                throw new Error(`${name} is EMPTY (0 bytes). Re-upload or check GitHub.`);
            }
            try {
                return JSON.parse(text);
            } catch (e) {
                throw new Error(`${name} has invalid JSON syntax.`);
            }
        };

        JAVA_DATA = await safeJsonParse(javaRes, "java.json");
        TOPIC_DETAILS = await safeJsonParse(detailsRes, "details.json");

        initDashboard();

    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById('headerTitle').innerText = "Load Failed";
        document.getElementById('headerSubtitle').innerText = error.message; 
        document.getElementById('headerSubtitle').style.color = "#ff4444";
    }
}

function getData() { return JAVA_DATA; }
function getState() { return javaState; }
function saveState() {
    localStorage.setItem('java_master_state', JSON.stringify(javaState));
}

// ================= DASHBOARD LOGIC =================
function initDashboard() {
    if (window.innerWidth <= 768) {
        document.querySelector('aside').classList.add('closed');
    }
    renderNav();
    renderContent();
}

function renderNav() {
    const nav = document.getElementById('navContainer');
    const data = getData();
    const state = getState();
    
    nav.innerHTML = '';
    
    if(!data) return;

    data.forEach((section, idx) => {
        const div = document.createElement('div');
        div.className = `nav-item ${state.activeTab === idx ? 'active' : ''}`;
        div.onclick = () => switchTab(idx);
        div.innerHTML = `<span>${section.title}</span><span class="progress-pill" id="pill-${idx}">0%</span>`;
        nav.appendChild(div);
    });
    updateStats(); 
}

function renderContent() {
    const state = getState();
    const data = getData();
    
    if(!data || !data[state.activeTab]) return;

    const idx = state.activeTab;
    const content = document.getElementById('contentArea');
    const section = data[idx];
    const searchVal = document.getElementById('searchInput').value.toLowerCase();

    document.getElementById('headerTitle').innerText = section.title;
    document.getElementById('headerSubtitle').innerText = section.subtitle;

    let html = '';
    let hasResults = false;

    section.groups.forEach(group => {
        const filteredTopics = group.topics.filter(item => {
            const title = (typeof item === 'object' ? item.title : item);
            return title.toLowerCase().includes(searchVal);
        });

        if (filteredTopics.length > 0) {
            hasResults = true;
            html += `<div class="group-section"><div class="group-title">${group.name}</div><div class="topic-grid">`;
            
            filteredTopics.forEach(item => {
                let title, priority, note;
                if (typeof item === 'object') {
                    title = item.title;
                    priority = item.priority || 'none';
                    note = item.note || '';
                } else {
                    title = item;
                    priority = 'none';
                    note = '';
                }
            
                const safeId = 'card-' + title.replace(/[^a-zA-Z0-9]/g, '');
                const isDone = state.completed[title];
            
                let starHtml = '';
                if (priority === 'high') {
                    starHtml = `<div class="star-badge high"><i class="fas fa-star"></i> <i class="fas fa-star"></i></div>`;
                } else if (priority === 'medium') {
                    starHtml = `<div class="star-badge medium"><i class="fas fa-star"></i></div>`;
                }
            
                const hasContent = TOPIC_DETAILS[title] && 
                                   TOPIC_DETAILS[title].blocks && 
                                   TOPIC_DETAILS[title].blocks.length > 0;
            
                let actionButtonHtml = '';
                if (hasContent) {
                    actionButtonHtml = `
                        <div class="card-actions">
                            <div class="btn-action" onclick="openModal(event, '${title}')" title="Read Notes">
                                <i class="fas fa-file-lines"></i>
                            </div>
                        </div>`;
                }
            
                let noteSection = '';
                if (note) {
                    noteSection = `
                    <div class="card-note-row">
                        <div class="topic-note">
                            <i class="fas fa-comment-dots" style="margin-top:3px; font-size: 0.7rem;"></i>
                            <span>${note}</span>
                        </div>
                    </div>`;
                }
            
                html += `
                <div id="${safeId}" class="topic-card ${isDone ? 'completed' : ''} prio-${priority}" onclick="handleTopicClick(event, '${title}', '${safeId}')">
                    ${starHtml}
                    <div class="card-top-row">
                        <div class="card-title-group">
                            <div class="checkbox"></div>
                            <span class="topic-text">${title}</span>
                        </div>
                        ${actionButtonHtml}
                    </div>
                    ${noteSection}
                </div>`;
            });
            html += `</div></div>`;
        }
    });

    if (!hasResults) html = `<div class="empty-state"><h3>No vibes found.</h3><p>Try searching for something else.</p></div>`;
    content.innerHTML = html;
}

function switchTab(idx) {
    const state = getState();
    state.activeTab = idx;
    document.getElementById('searchInput').value = ''; 
    saveState();
    renderNav();
    renderContent(); 

    if (window.innerWidth <= 768) {
        document.querySelector('aside').classList.add('closed');
    }
}

function handleTopicClick(e, topicName, elementId) {
    const selection = window.getSelection();
    if(selection.toString().length > 0) return; 

    const state = getState();
    const wasCompleted = state.completed[topicName];
    state.completed[topicName] = !wasCompleted;
    saveState();

    const card = document.getElementById(elementId);
    if(card) card.classList.toggle('completed');
    
    if (wasCompleted) {
        updateStats();
        return;
    }

    const stats = updateStats();
    const data = getData();
    const currentSection = data[state.activeTab];
    
    const sectionTopics = currentSection.groups.flatMap(g => g.topics);
    const totalSectionTopics = sectionTopics.length;
    const finishedSectionTopics = sectionTopics.filter(t => {
        const title = (typeof t === 'object' ? t.title : t);
        return state.completed[title];
    }).length;

    if (stats.globalPercent === 100) {
        triggerExtremeCelebration();
    } 
    else if (finishedSectionTopics === totalSectionTopics) {
        triggerSectionComplete();
    } 
    else {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        triggerSmallConfetti(x, y);
    }
}

// ================= MODAL LOGIC =================
function openModal(e, key) {
    e.stopPropagation();

    const details = TOPIC_DETAILS[key];
    const modal = document.getElementById('noteModal');
    document.getElementById('modalTitle').innerText = key;
    const modalBody = document.getElementById('modalBody');
    
    if (!details || !details.blocks) {
        modalBody.innerHTML = `<p class="modal-text">No formatted notes available.</p>`;
    } else {
        let html = '';
        
        details.blocks.forEach((block, index) => {
            if (block.type === 'text') {
                html += `<div class="modal-text">${block.content}</div>`;
            } 
            else if (block.type === 'code') {
                const codeId = `code-${index}`;
                let coloredCode = safeSyntaxHighlight(block.content);

                html += `
                <div class="gemini-code-container">
                    <div class="code-header">
                        <span class="code-lang">${block.language}</span>
                        <button class="copy-btn" onclick="copyToClipboard('${codeId}')">
                            <i class="fas fa-copy"></i> Copy code
                        </button>
                    </div>
                    <div class="code-scroll">
                        <pre class="code-content" id="${codeId}">${coloredCode}</pre>
                        <textarea id="${codeId}-raw" style="display:none;">${block.content}</textarea>
                    </div>
                </div>`;
            } else if (block.type === 'gallery') {
                html += `<div class="modal-images">`;
                block.urls.forEach(url => {
                    html += `<img src="${url}" class="modal-img" alt="Topic Diagram" loading="lazy">`;
                });
                if (block.caption) {
                    html += `<p class="modal-text" style="text-align: center; font-size: 0.85rem; color: var(--text-secondary); margin-top: 5px;">${block.caption}</p>`;
                }
                html += `</div>`;
            }
        });
        modalBody.innerHTML = html;
    }
    modal.classList.add('active');
    modalBody.scrollTop = 0;
}

function copyToClipboard(elementId) {
    const rawText = document.getElementById(elementId + '-raw').value;
    navigator.clipboard.writeText(rawText).then(() => {
        alert("Copied to clipboard!"); 
    });
}

function closeModal(e) {
    const modal = document.getElementById('noteModal');
    if (!e || e.target === modal || e.target.closest('.modal-close')) {
        modal.classList.remove('active');
    }
}

function safeSyntaxHighlight(code) {
    let clean = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const placeholders = [];
    const save = (content, type) => {
        placeholders.push(`<span class="code-${type}">${content}</span>`);
        return `###${placeholders.length - 1}###`;
    };

    clean = clean.replace(/"(.*?)"/g, (match) => save(match, 'string'));
    clean = clean.replace(/\/\/.*/g, (match) => save(match, 'comment'));

    clean = clean.replace(/\b(public|class|void|int|String|new|return|if|else|static|abstract|interface|extends|implements|super|this|final|try|catch|throws|boolean|enum)\b/g,
        '<span class="code-keyword">$1</span>');

    clean = clean.replace(/###(\d+)###/g, (_, index) => placeholders[index]);
    return clean;
}

// ================= UTILITIES =================
function updateStats() {
    const state = getState();
    const data = getData();
    
    if(!data) return { globalPercent: 0 };

    const allTopics = data.flatMap(s => s.groups.flatMap(g => g.topics));
    
    const totalDone = allTopics.filter(t => {
        const title = (typeof t === 'object' ? t.title : t);
        return state.completed[title];
    }).length;

    const globalPercent = Math.round((totalDone / allTopics.length) * 100) || 0;

    document.getElementById('masteryPercent').innerText = `${globalPercent}%`;
    document.getElementById('masteryBar').style.width = `${globalPercent}%`;

    data.forEach((section, idx) => {
        const sectionTopics = section.groups.flatMap(g => g.topics);
        
        const sDone = sectionTopics.filter(t => {
            const title = (typeof t === 'object' ? t.title : t);
            return state.completed[title];
        }).length;

        const sPer = Math.round((sDone / sectionTopics.length) * 100) || 0;
        const pill = document.getElementById(`pill-${idx}`);
        if(pill) pill.innerText = `${sPer}%`;
    });

    return { globalPercent };
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const icon = document.querySelector('.theme-toggle i');
    if(icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleSidebar() {
    const sidebar = document.querySelector('aside');
    sidebar.classList.toggle('closed');
}


// ================= BOOTSTRAP & CONFETTI =================
function triggerSmallConfetti(x, y) {
    const color = '#f97316';
    confetti({
        particleCount: 40, spread: 60, origin: { x: x, y: y },
        colors: [color, '#ffffff'], disableForReducedMotion: true, gravity: 1.2, scalar: 0.7
    });
}

function triggerSectionComplete() {
    const color = '#f97316';
    const end = Date.now() + 1000;

    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: [color, '#22c55e'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: [color, '#22c55e'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function triggerExtremeCelebration() {
    const duration = 8000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const color = '#f97316';

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        
        confetti({ particleCount: 10, angle: 60, spread: 80, origin: { x: 0 }, colors: [color, '#ffffff'] });
        confetti({ particleCount: 10, angle: 120, spread: 80, origin: { x: 1 }, colors: [color, '#ffffff'] });
    }, 250);
}

window.onload = loadDataAndInit;