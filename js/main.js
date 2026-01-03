
        function navigateTo(pageId) {
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

        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('open');
            document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : 'auto';
        }

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

        document.getElementById('contactForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = document.getElementById('submitBtn');
            const errorEl = document.getElementById('errorMsg');
            const successEl = document.getElementById('successMsg');
            const formEl = document.getElementById('contactForm');

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const phone = document.getElementById('form-phone').value;
            const description = document.getElementById('form-message').value;

            const originalBtnText = btn.innerText;
            btn.innerText = '正在提交至 ChanDone 伺服器...';
            btn.disabled = true;
            errorEl.classList.add('hidden');

            try {
                const baseUrl = 'https://mysite-e425.onrender.com/submit_form';
                const params = new URLSearchParams({
                    name: name,
                    email: email,
                    phone: phone,
                    description: description
                });
                
                const requestUrl = `${baseUrl}?${params.toString()}`;

                const response = await fetch(requestUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formEl.classList.add('hidden');
                    successEl.classList.remove('hidden');
                } else {
                    throw new Error('伺服器連線繁忙，請直接透過 LINE 與我聯繫。');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                errorEl.innerText = error.message || '連線發生錯誤。';
                errorEl.classList.remove('hidden');
                
                btn.innerText = originalBtnText;
                btn.disabled = false;
            }
        });