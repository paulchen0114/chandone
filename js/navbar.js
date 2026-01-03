/**
 * ChanDone Studio 共享導覽列組件
 * 整合了導覽列 HTML 注入、手機版選單、捲軸特效及自動分頁標亮
 */

const navbarHTML = `
<nav id="navbar" class="fixed w-full z-50 glass-nav">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3 cursor-pointer group" onclick="window.location.href='index.html'">
            <img src="images/IMG_7919.PNG" alt="ChanDone Logo" class="logo-img rounded shadow-sm group-hover:scale-105 transition" onerror="this.src='https://ui-avatars.com/api/?name=CD&background=2563eb&color=fff'">
            <span class="text-lg sm:text-xl font-bold tracking-tight">ChanDone<span class="text-blue-600">.</span></span>
        </div>

        <!-- 桌面版導覽 -->
        <div class="hidden md:flex gap-8 lg:gap-10 font-medium text-slate-600">
            <a href="index.html" class="nav-link" data-page="index">首頁</a>
            <a href="services.html" class="nav-link" data-page="services">服務項目</a>
            <a href="process.html" class="nav-link" data-page="process">合作流程</a>
            <a href="gallery.html" class="nav-link" data-page="gallery">作品相簿</a>
            <a href="contact.html" class="nav-link" data-page="contact">聯絡諮詢</a>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
            <a href="contact.html" class="hidden sm:block bg-blue-600 text-white px-5 lg:px-7 py-2 rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 text-sm md:text-base">
                立即預約
            </a>
            <button onclick="toggleMobileMenu()" class="md:hidden text-slate-600 text-xl p-2 hover:bg-slate-100 rounded-full transition">
                <i class="fa-solid fa-bars-staggered"></i>
            </button>
        </div>
    </div>
</nav>

<!-- 手機版側邊選單 -->
<div id="mobile-menu" class="fixed inset-0 z-[60] bg-white flex flex-col md:hidden translate-x-full transition-transform duration-400 ease-in-out">
    <div class="flex justify-between items-center p-6 border-b border-slate-50">
        <div class="flex items-center gap-2">
            <img src="images/IMG_7919.PNG" alt="ChanDone Logo" class="h-8 rounded" onerror="this.src='https://ui-avatars.com/api/?name=CD&background=2563eb&color=fff'">
            <span class="font-bold text-xl">ChanDone</span>
        </div>
        <button onclick="toggleMobileMenu()" class="text-3xl text-slate-400 hover:text-slate-900">&times;</button>
    </div>
    <div class="flex flex-col p-8 gap-6 text-2xl font-bold text-slate-800">
        <a href="index.html" class="flex items-center justify-between">首頁 <i class="fa-solid fa-chevron-right text-sm text-slate-300"></i></a>
        <a href="services.html" class="flex items-center justify-between">服務項目 <i class="fa-solid fa-chevron-right text-sm text-slate-300"></i></a>
        <a href="process.html" class="flex items-center justify-between">合作流程 <i class="fa-solid fa-chevron-right text-sm text-slate-300"></i></a>
        <a href="gallery.html" class="flex items-center justify-between">作品相簿 <i class="fa-solid fa-chevron-right text-sm text-slate-300"></i></a>
        <a href="contact.html" class="flex items-center justify-between">聯絡諮詢 <i class="fa-solid fa-chevron-right text-sm text-slate-300"></i></a>
    </div>
    <div class="mt-auto p-8 bg-slate-50">
        <p class="text-sm text-slate-500 mb-4">有急件需求嗎？</p>
        <a href="https://line.me/ti/p/wyVWQa260A" class="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            <i class="fa-brands fa-line text-xl"></i> LINE 即時私訊
        </a>
    </div>
</div>
`;

// 初始化 Navbar
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('shared-navbar-container');
    if (header) {
        header.innerHTML = navbarHTML;
        highlightActiveLink();
        initScrollEffect();
    }
});

/**
 * 切換手機選單
 */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('translate-x-full');
        document.body.style.overflow = menu.classList.contains('translate-x-full') ? 'auto' : 'hidden';
    }
}

/**
 * 監聽捲軸改變 Navbar 樣式
 */
function initScrollEffect() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        }
    });
}

/**
 * 自動偵測當前網址並標亮選單
 */
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        // 如果網址包含 href 或者在首頁
        if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}