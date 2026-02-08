function switchView(pageId) {
            const views = document.querySelectorAll('.page-view');
            const links = document.querySelectorAll('.nav-link');
            
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === 'view-' + pageId) {
                    setTimeout(() => { 
                        view.classList.add('active'); 
                        reveal(); 
                    }, 50);
                }
            });

            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-page') === pageId);
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function toggleMobileMenu(force) {
            const menu = document.getElementById('mobile-menu');
            if (!menu) return;

            // if caller passes boolean, force show/hide
            if (typeof force === 'boolean') {
                if (force) {
                    menu.classList.remove('hidden');
                    menu.classList.add('open');
                    document.body.style.overflow = 'hidden';
                } else {
                    menu.classList.add('hidden');
                    menu.classList.remove('open');
                    document.body.style.overflow = 'auto';
                }
                return;
            }

            const isHidden = menu.classList.contains('hidden');
            menu.classList.toggle('hidden');
            menu.classList.toggle('open', isHidden);
            document.body.style.overflow = isHidden ? 'hidden' : 'auto';
        }
        window.toggleMobileMenu = toggleMobileMenu;

        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
        });

        function reveal() {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(el => {
                const isVisible = el.getBoundingClientRect().top < window.innerHeight - 50;
                if (isVisible) el.classList.add('active');
            });
        }
        window.addEventListener('scroll', reveal);
        window.addEventListener('load', reveal);

        // Initialize page-specific DOM bindings AFTER content is injected
        function initApp() {
          // contact form submit handler (only if form exists)
          const formEl = document.getElementById('contactForm');
          if (formEl) {
            const btn = document.getElementById('submitBtn');
            const errorEl = document.getElementById('errorMsg');
            const successEl = document.getElementById('successMsg');

            formEl.addEventListener('submit', async function(e) {
              e.preventDefault();

              const name = document.getElementById('form-name').value;
              const email = document.getElementById('form-email').value;
              const phone = document.getElementById('form-phone').value;
              const description = document.getElementById('form-message').value;

              const originalBtnText = btn ? btn.innerText : '';
              if (btn) {
                btn.innerText = '正在提交…';
                btn.disabled = true;
              }
              if (errorEl) errorEl.classList.add('hidden');

              // quick local-file guard
              if (location.protocol === 'file:') {
                if (errorEl) {
                  errorEl.innerText = '請啟動本機伺服器（例如：python3 -m http.server）以送出表單。';
                  errorEl.classList.remove('hidden');
                }
                if (btn) { btn.innerText = originalBtnText; btn.disabled = false; }
                return;
              }

              try {
                // use POST with JSON body (safer & better for CORS)
                const baseUrl = 'https://mysite-e425.onrender.com/submit_form';
                const payload = { name, email, phone, description };

                // timeout support
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                const response = await fetch(baseUrl, {
                  method: 'POST',
                  mode: 'cors',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payload),
                  signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                  formEl.classList.add('hidden');
                  if (successEl) successEl.classList.remove('hidden');
                } else {
                  // try to read error details from server
                  let text;
                  try { text = await response.text(); } catch (e) { /* ignore */ }
                  throw new Error(text || `伺服器錯誤: ${response.status}`);
                }
              } catch (error) {
                console.error('Submission Error:', error);
                if (error.name === 'AbortError') {
                  if (errorEl) errorEl.innerText = '伺服器回應逾時，請稍後再試或直接聯絡 LINE。';
                } else {
                  if (errorEl) errorEl.innerText = error.message || '連線發生錯誤。';
                }
                if (errorEl) errorEl.classList.remove('hidden');
                if (btn) { btn.innerText = originalBtnText; btn.disabled = false; }
              }
            });
          } // end if formEl

          // Re-run reveal() once to animate injected content
          reveal();
        }
        
async function fetchHtml(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.text();
}

async function inject(selector, path) {
  try {
    const html = await fetchHtml(path);
    document.querySelector(selector).innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

async function loadShellAndPage(page = "home") {
  // load shared partials
  await Promise.all([
    inject("#shared-navbar", "partials/navbar.html"),
    inject("#shared-mobile-menu", "partials/mobile-menu.html"),
    inject("#shared-footer", "partials/footer.html")
  ]);

  // load main page content
  await inject("#page-container", `pages/${page}.html`);

  // optionally re-run any init functions (event bindings)
  if (typeof initApp === "function") initApp();
}

// map location.pathname -> page name used by pages/<page>.html
function pathToPage(pathname) {
    let p = pathname.replace(/^\/+|\/+$/g, ''); // trim slashes
    if (!p || p === 'index.html') return 'home';
    if (p.endsWith('.html')) p = p.slice(0, -5);
    // whitelist pages
    const allowed = ['home', 'services', 'process', 'contact'];
    return allowed.includes(p) ? p : 'home';
}

async function navigateTo(page, push = true) {
  try {
    // close mobile menu if open
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "auto";
    }

    // set active nav-link
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-page") === page);
    });

    // load page content
    const html = await inject("#page-container", `pages/${page}.html`);
    if (html !== null) {
      // activate first .page-view inside container (if you use .page-view)
      const firstView = document.querySelector('#page-container .page-view');
      document.querySelectorAll('#page-container .page-view').forEach(v=>v.classList.remove('active'));
      if (firstView) firstView.classList.add('active');
    }

    // run page init
    if (typeof initApp === "function") initApp();

    // smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // update browser URL (clean path)
    if (push) {
      const url = page === 'home' ? '/' : `/${page}.html`;
      history.pushState({ page }, '', url);
    }
  } catch (err) {
    console.error("navigateTo error:", err);
  }
}
window.navigateTo = navigateTo;

// handle back/forward
window.addEventListener('popstate', (ev) => {
  const page = ev.state && ev.state.page ? ev.state.page : pathToPage(location.pathname);
  navigateTo(page, false);
});

// initial load: load shell and page based on URL
document.addEventListener("DOMContentLoaded", () => {
  const page = pathToPage(location.pathname);
  loadShellAndPage(page).catch(console.error);
});