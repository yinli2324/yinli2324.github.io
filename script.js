// ============================================
// 🔐 本地资源配置
// ============================================
const LOCAL_RESOURCES = {
    'genshin61': { code: '2580', url: 'https://share.feijipan.com/s/HXPjCVKS' },
    'hsr37': { code: '2580', url: 'https://share.feijipan.com/s/sfPLWKFV' },
    'blue_archive': { code: '2580', url: 'https://share.feijipan.com/s/vNPLQ1lV' },
    'resources_share': { code: '1314', url: 'https://www.123912.com/s/I7DsTd-uahJ3' }
};

let currentResId = null;

// ============================================
// 🔧 设备检测和布局管理
// ============================================

// 设备检测函数
function detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    const screenWidth = window.innerWidth;
    
    // 双重检测：用户代理 + 屏幕宽度
    return (isMobile || screenWidth <= 768) ? 'mobile' : 'desktop';
}

// 布局切换函数
function switchLayout(deviceType) {
    const mobileLayout = document.getElementById('main-content-mobile');
    const desktopLayout = document.getElementById('main-content-desktop');
    
    if (deviceType === 'mobile') {
        mobileLayout.style.display = 'block';
        desktopLayout.style.display = 'none';
    } else {
        mobileLayout.style.display = 'none';
        desktopLayout.style.display = 'block';
    }
}

// ============================================
// ⏰ 时间显示功能
// ============================================
function showLocale(objD) {
    const days = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const year = objD.getFullYear();
    const month = String(objD.getMonth() + 1).padStart(2, '0');
    const day = String(objD.getDate()).padStart(2, '0');
    const hours = String(objD.getHours()).padStart(2, '0');
    const minutes = String(objD.getMinutes()).padStart(2, '0');
    const seconds = String(objD.getSeconds()).padStart(2, '0');
    const weekday = days[objD.getDay()];
    return `<font color="#ffffff">${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekday}</font>`;
}

function tick() {
    const el = document.getElementById("localtime");
    if(el) el.innerHTML = showLocale(new Date());
    setTimeout(tick, 1000);
}

// ============================================
// 🔒 安全防护功能
// ============================================
function showSecurityWarning() {
    const warning = document.getElementById('security-warning');
    if (warning) { 
        warning.style.display = 'flex'; 
        document.body.style.overflow = 'hidden'; 
    }
}

// ============================================
// 🔗 链接处理功能
// ============================================
function safeOpenLink(url) {
    if (url && url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// ============================================
// 🔐 密码验证功能 (本地模式)
// ============================================
function unlock(id) {
    const resource = LOCAL_RESOURCES[id];
    if (resource) {
        currentResId = id;
        document.getElementById('password-modal').classList.add('active');
        const input = document.getElementById('password-input');
        input.value = '';
        input.focus();
        document.getElementById('password-feedback').classList.remove('active');
    }
}

function verifyPassword() {
    const input = document.getElementById('password-input');
    const passwordValue = input.value;
    const resource = LOCAL_RESOURCES[currentResId];
    
    if (!resource) {
        showPasswordFeedback(false, '资源不存在');
        return;
    }
    
    if (passwordValue === resource.code) {
        // 密码正确
        showPasswordFeedback(true, resource.url);
    } else {
        // 密码错误
        showPasswordFeedback(false);
        input.value = '';
        input.focus();
    }
}

function showPasswordFeedback(isCorrect, link) {
    const feedback = document.getElementById('password-feedback');
    const icon = document.getElementById('feedback-icon');
    const text = document.getElementById('feedback-text');
    const desc = document.getElementById('feedback-desc');
    
    if (isCorrect) {
        feedback.classList.add('correct');
        feedback.classList.remove('incorrect');
        icon.className = 'feedback-icon correct fas fa-check-circle';
        text.textContent = '密码正确';
        desc.textContent = '正在为您跳转...';
    } else {
        feedback.classList.add('incorrect');
        feedback.classList.remove('correct');
        icon.className = 'feedback-icon incorrect fas fa-times-circle';
        text.textContent = '密码错误';
        desc.textContent = '请重新输入密码';
        
        // 添加输入框抖动效果
        const input = document.getElementById('password-input');
        input.classList.add('shake');
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
    }
    
    feedback.classList.add('active');
    
    // 自动关闭反馈
    setTimeout(() => {
        feedback.classList.remove('active');
        
        if (isCorrect && link) {
            safeOpenLink(link);
            document.getElementById('password-modal').classList.remove('active');
            document.getElementById('password-input').value = '';
        }
    }, isCorrect ? 1500 : 2000);
}

// ============================================
// 🚀 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // 设备检测和布局切换
    const deviceType = detectDeviceType();
    switchLayout(deviceType);
    
    // 背景视频修复
    const bgVideo = document.getElementById('bg-video');
    if(bgVideo) bgVideo.addEventListener('error', () => document.body.style.background = "#0a1929");
    
    // 时间显示
    tick();
    
    // 欢迎弹窗
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            document.getElementById('welcome-modal').classList.add('active');
            document.getElementById('read-confirm').onclick = () => {
                document.getElementById('welcome-modal').classList.remove('active');
                localStorage.setItem('hasVisited', 'true');
            };
        }, 500);
    }

    // 加载动画模拟
    if (sessionStorage.getItem('loaded')) {
        document.getElementById('loading-screen').style.display = 'none';
    } else {
        let p = 0;
        const t = setInterval(() => {
            p += 5;
            document.getElementById('loading-progress-bar').style.width = p + '%';
            document.getElementById('loading-percentage').innerText = p + '%';
            if (p >= 100) {
                clearInterval(t);
                document.getElementById('loading-screen').classList.add('hidden');
                sessionStorage.setItem('loaded', 'true');
            }
        }, 50);
    }

    // 导航栏逻辑
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            const cat = this.getAttribute('data-category');
            if (cat === 'all') {
                window.scrollTo({top:0, behavior:'smooth'});
            } else {
                const map = {'game':'游戏','software':'软件','online':'在线'};
                // 根据当前布局选择对应的元素
                const currentLayout = deviceType === 'mobile' ? 
                    document.querySelectorAll('.bc_box h3') : 
                    document.querySelectorAll('.category-title');
                    
                currentLayout.forEach(t => {
                    if(t.textContent.includes(map[cat])) {
                        t.scrollIntoView({behavior:'smooth', block:'start'});
                    }
                });
            }
        });
    });

    // 密码验证相关事件监听
    document.getElementById('password-submit').addEventListener('click', verifyPassword);
    document.getElementById('password-cancel').addEventListener('click', function() {
        document.getElementById('password-modal').classList.remove('active');
        document.getElementById('password-input').value = '';
    });
    
    document.getElementById('password-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });

    // 窗口大小变化时重新检测设备
    window.addEventListener('resize', function() {
        const newDeviceType = detectDeviceType();
        switchLayout(newDeviceType);
    });
});

// ============================================
// 🛡️ 安全事件监听
// ============================================
document.addEventListener('contextmenu', e => { 
    e.preventDefault(); 
    showSecurityWarning(); 
});

document.addEventListener('keydown', e => {
    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode))) {
        e.preventDefault(); 
        showSecurityWarning();
    }
});