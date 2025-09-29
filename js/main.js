/**
 * チーム・エトワール株式会社 ランディングページ
 * メインJavaScript - インタラクション、アニメーション、フォーム処理
 */

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== メイン初期化関数 =====
function initializeApp() {
    setupScrollAnimations();
    setupNavigation();
    setupContactForm();
    setupParallaxEffects();
    setupIntersectionObserver();
    setupSmoothScrolling();
    setupMobileMenu();
    setupLogoScroll();
    addAccessibilityFeatures();
}

// ===== スクロールアニメーション =====
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // 一度アニメーションしたら監視を停止
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });
}

// ===== ナビゲーション機能 =====
function setupNavigation() {
    const header = document.getElementById('header');
    const headerText = document.getElementById('header-text');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    // ヘッダーのスクロール効果
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // ヘッダーの透明度調整とロゴサイズ変更
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // アクティブリンクの更新
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    // ナビゲーションクリック時のスムーススクロール
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                closeMobileMenu();
            }
        });
    });
}

// ===== アクティブナビゲーションリンク更新 =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== モバイルメニュー機能 =====
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');
    
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // モバイルメニューリンクのクリック時にメニューを閉じる
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

function openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = document.querySelector('#mobile-menu-btn i');
    
    mobileMenu.classList.remove('hidden');
    mobileMenuIcon.classList.remove('fa-bars');
    mobileMenuIcon.classList.add('fa-times');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = document.querySelector('#mobile-menu-btn i');
    
    mobileMenu.classList.add('hidden');
    mobileMenuIcon.classList.remove('fa-times');
    mobileMenuIcon.classList.add('fa-bars');
}

// ===== コンタクトフォーム処理 =====
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission(contactForm, successMessage);
    });
    
    // リアルタイムバリデーション
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => clearValidationError(input));
    });
}

function handleFormSubmission(form, successMessage) {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData);
    
    // バリデーション
    if (!validateForm(form)) {
        return;
    }
    
    // 送信ボタンを無効化
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>送信中...';
    
    // 実際の送信処理をシミュレート（2秒後に成功）
    setTimeout(() => {
        // フォームをリセット
        form.reset();
        
        // 成功メッセージを表示
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 送信ボタンを元に戻す
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // 5秒後に成功メッセージを非表示
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
        
        console.log('フォーム送信データ:', formObject);
    }, 2000);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let errorMessage = '';
    
    // 必須チェック
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'この項目は必須です';
    }
    
    // メールアドレスのフォーマットチェック
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = '有効なメールアドレスを入力してください';
        }
    }
    
    // エラー表示の更新
    updateValidationError(input, isValid, errorMessage);
    
    return isValid;
}

function updateValidationError(input, isValid, errorMessage) {
    const formGroup = input.closest('div');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!isValid) {
        // エラーを表示
        input.classList.add('border-red-500');
        input.classList.remove('border-gray-300');
        
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.className = 'error-message text-red-500 text-sm mt-1';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
    } else {
        // エラーをクリア
        clearValidationError(input);
    }
}

function clearValidationError(input) {
    const formGroup = input.closest('div');
    const errorElement = formGroup.querySelector('.error-message');
    
    input.classList.remove('border-red-500');
    input.classList.add('border-gray-300');
    
    if (errorElement) {
        errorElement.remove();
    }
}

// ===== パララックス効果 =====
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1); // 各要素で異なる速度
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    // スロットリングされたスクロールイベント
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ===== インターセクションオブザーバー（パフォーマンス最適化） =====
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // セクションがビューに入った時の処理
                entry.target.classList.add('in-view');
                
                // アニメーション遅延の追加
                const animatedChildren = entry.target.querySelectorAll('.card-hover, .team-member, .work-card');
                animatedChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // セクションを監視
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ===== スムーススクロール（フォールバック） =====
function setupSmoothScrolling() {
    // CSS scroll-behaviorをサポートしていないブラウザ用
    if (!('scrollBehavior' in document.documentElement.style)) {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    smoothScrollTo(targetElement.offsetTop, 800);
                }
            });
        });
    }
}

function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
}

// ===== アクセシビリティ機能 =====
function addAccessibilityFeatures() {
    // フォーカス管理
    const focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    // キーボードナビゲーション
    document.addEventListener('keydown', (e) => {
        // Escapeキーでモバイルメニューを閉じる
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Enterキーでボタンをクリック
        if (e.key === 'Enter' && e.target.classList.contains('clickable')) {
            e.target.click();
        }
    });
    
    // ARIA属性の動的更新
    const toggleButtons = document.querySelectorAll('[data-toggle]');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !expanded);
        });
    });
}

// ===== パフォーマンス最適化 =====
// 画像の遅延読み込み
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// デバウンス関数
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// スロットル関数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== エラーハンドリング =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // 本番環境では、エラーログを送信するサービスに送ることが推奨
});

// ===== ユーティリティ関数 =====
function getScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / scrollHeight) * 100;
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== アニメーション完了後の処理 =====
document.addEventListener('animationend', (e) => {
    // アニメーション完了後にwill-changeを削除してパフォーマンスを向上
    if (e.target.style.willChange) {
        e.target.style.willChange = 'auto';
    }
});

// ===== 動的ロゴ読み込み・無限ループスクロール機能 =====
function setupLogoScroll() {
    const logoContainer = document.getElementById('logo-container');
    const logoTrack = document.getElementById('logo-track');
    const prevBtn = document.getElementById('logo-prev');
    const nextBtn = document.getElementById('logo-next');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    
    if (!logoContainer || !logoTrack) return;
    
    // 企業ロゴデータ（images/clients/フォルダ内の画像を管理）
    const clientLogos = [
        {
            name: 'autobacs',
            file: 'autobacs.jpg',
            displayName: 'オートバックス',
            project: 'ウマ娘コラボ企画'
        },
        {
            name: 'coca-cola',
            file: 'coca-cola.jpg',
            displayName: 'コカ・コーラ',
            project: 'アニメコラボ企画'
        },
        {
            name: 'yamato',
            file: 'yamato.jpg',
            displayName: 'ヤマト運輸',
            project: '物流戦略サポート'
        },
        {
            name: 'studio-trigger',
            file: 'studio-trigger.jpg',
            displayName: 'スタジオトリガー',
            project: '制作パートナーシップ'
        },
        {
            name: 'yostar',
            file: 'yostar.jpg',
            displayName: 'Yostar',
            project: 'ゲームコンテンツ連携'
        },
        {
            name: 'kose',
            file: 'kose.jpg',
            displayName: 'コーセー',
            project: 'ビューティー企画'
        },
        {
            name: 'cygames',
            file: 'cygames.jpg',
            displayName: 'Cygames',
            project: 'クロスメディア展開'
        }
    ];
    
    // 動的にロゴアイテムを生成する関数
    function createLogoItem(logo) {
        const logoItem = document.createElement('div');
        logoItem.className = 'logo-item';
        
        logoItem.innerHTML = `
            <div class="logo-placeholder">
                <img src="images/clients/${logo.file}" alt="${logo.displayName}" class="logo-image" loading="lazy">
                <div class="logo-overlay">
                    <span>${logo.project}</span>
                </div>
            </div>
        `;
        
        return logoItem;
    }
    
    // ロゴトラックに全ロゴを動的に追加（無限ループ用に2セット）
    function generateLogoTrack() {
        // 最初のセット
        clientLogos.forEach(logo => {
            logoTrack.appendChild(createLogoItem(logo));
        });
        
        // 無限ループ用の複製セット
        clientLogos.forEach(logo => {
            logoTrack.appendChild(createLogoItem(logo));
        });
        
        console.log(`✅ ${clientLogos.length * 2}個のロゴアイテムを動的生成しました`);
    }
    
    let isUserInteracting = false;
    
    // CSSアニメーション制御
    function pauseAnimation() {
        isUserInteracting = true;
        logoTrack.classList.add('paused');
    }
    
    function resumeAnimation() {
        isUserInteracting = false;
        logoTrack.classList.remove('paused');
    }
    
    // タッチ/マウスドラッグ対応
    let isDragging = false;
    let startX = 0;
    let currentTransform = 0;
    
    function startDrag(clientX) {
        isDragging = true;
        startX = clientX;
        pauseAnimation();
        
        // 現在のtransform値を取得
        const style = window.getComputedStyle(logoTrack);
        const transform = style.transform;
        if (transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            currentTransform = matrix.m41; // translateXの値
        }
        
        logoTrack.style.animation = 'none';
        logoTrack.style.transform = `translateX(${currentTransform}px)`;
    }
    
    function updateDrag(clientX) {
        if (!isDragging) return;
        
        const deltaX = startX - clientX;
        const newTransform = currentTransform - deltaX;
        
        logoTrack.style.transform = `translateX(${newTransform}px)`;
    }
    
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        
        // アニメーションを再開
        logoTrack.style.animation = '';
        logoTrack.classList.remove('paused');
        
        setTimeout(() => {
            resumeAnimation();
        }, 1000);
    }
    
    // マウスイベント
    logoTrack.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startDrag(e.clientX);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateDrag(e.clientX);
        }
    });
    
    document.addEventListener('mouseup', endDrag);
    
    // タッチイベント
    logoTrack.addEventListener('touchstart', (e) => {
        startDrag(e.touches[0].clientX);
    }, { passive: true });
    
    logoTrack.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            updateDrag(e.touches[0].clientX);
        }
    });
    
    logoTrack.addEventListener('touchend', endDrag);
    
    // ホバーで一時停止
    logoContainer.addEventListener('mouseenter', pauseAnimation);
    logoContainer.addEventListener('mouseleave', () => {
        if (!isDragging) {
            resumeAnimation();
        }
    });
    
    // ナビゲーションボタン
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pauseAnimation();
            
            const itemWidth = 200 + 32; // 正方形サイズ + gap
            const style = window.getComputedStyle(logoTrack);
            const transform = style.transform;
            let currentX = 0;
            
            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                currentX = matrix.m41;
            }
            
            logoTrack.style.animation = 'none';
            logoTrack.style.transform = `translateX(${currentX + itemWidth}px)`;
            
            setTimeout(() => {
                logoTrack.style.animation = '';
                resumeAnimation();
            }, 500);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pauseAnimation();
            
            const itemWidth = 200 + 32; // 正方形サイズ + gap
            const style = window.getComputedStyle(logoTrack);
            const transform = style.transform;
            let currentX = 0;
            
            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                currentX = matrix.m41;
            }
            
            logoTrack.style.animation = 'none';
            logoTrack.style.transform = `translateX(${currentX - itemWidth}px)`;
            
            setTimeout(() => {
                logoTrack.style.animation = '';
                resumeAnimation();
            }, 500);
        });
    }
    
    // ドット表示更新
    function updateDots() {
        if (scrollDots.length === 0) return;
        
        const style = window.getComputedStyle(logoTrack);
        const transform = style.transform;
        let progress = 0;
        
        if (transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            const currentX = Math.abs(matrix.m41);
            const itemWidth = 200 + 32;
            const totalLogos = clientLogos.length;
            progress = (currentX / (itemWidth * totalLogos)) % 1;
        }
        
        const activeIndex = Math.floor(progress * scrollDots.length);
        
        scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    // 初期化: ロゴを動的生成してからスクロール機能をセットアップ
    generateLogoTrack();
    
    // 定期的にドット更新
    if (scrollDots.length > 0) {
        setInterval(updateDots, 1000);
        updateDots();
    }
    
    console.log('🎯 動的ロゴスクロール機能が初期化されました');
}

// ===== 開発用デバッグ関数 =====
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.debugTeamEtoiles = {
        getScrollProgress,
        isElementInViewport,
        validateForm: () => validateForm(document.getElementById('contact-form')),
        simulateFormSubmit: () => {
            const form = document.getElementById('contact-form');
            form.dispatchEvent(new Event('submit'));
        },
        logoScroll: () => document.getElementById('logo-container')
    };
}