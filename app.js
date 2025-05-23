document.addEventListener('DOMContentLoaded', () => {
    // 粒子背景初始化
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particle-bg';
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.zIndex = '-1';
    document.body.appendChild(particleCanvas);
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    function createParticles() {
        particles = Array(80).fill().map(() => ({x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, size: Math.random()*2+1, speedX: Math.random()*1-0.5, speedY: Math.random()*1-0.5}));
    }
    function animateParticles() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if(p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
            if(p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;
            ctx.fillStyle = '#007bff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }
    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        createParticles();
    });
    createParticles();
    animateParticles();
    // 轮播图初始化函数
    function initSlider(sliderSelector, slideSelector, dotsSelector) {
        const slider = document.querySelector(sliderSelector);
        const slides = document.querySelectorAll(slideSelector);
        const dotsContainer = document.querySelector(dotsSelector);
        let currentSlide = 0;
        const slideInterval = 5000;
        let slideTimer;

        // 创建轮播点
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll(`${dotsSelector} .dot`);
        dots[0].classList.add('active');

        // 切换轮播图函数
        function goToSlide(index) {
            slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'flex' : 'none';
    });
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentSlide = index;
        }

        // 自动轮播函数
        function autoSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }

        // 启动自动轮播
        slideTimer = setInterval(autoSlide, slideInterval);
    }

    // 初始化单个新轮播图
    initSlider('.slider-1', '.slide-1', '.slider-dots-1');

    // 锚点导航平滑滚动
    document.querySelectorAll('.navbar .logo, .slider-dots .dot, .back-to-top').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href') || '#';
            const targetSection = targetId === '#' ? document.querySelector('body') : document.querySelector(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - 80, // 导航栏高度偏移
                behavior: 'smooth'
            });
        });
    });

    // 返回顶部按钮控制
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // 分批次加载（使用Intersection Observer）
    const observerOptions = {
        rootMargin: '0px 0px -100px 0px', // 距离底部100px时触发
        threshold: 0.1
    };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                // 可扩展加载逻辑（如图片懒加载），示例为技能进度条动画
                if (entry.target.id === 'skills') {
                    document.querySelectorAll('.skill-progress').forEach(progress => {
                        progress.style.width = progress.parentElement.dataset.progress || '0%';
                    });
                }
            }
        });
    }, observerOptions);

    // 监听所有内容板块
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('initial-hidden');
        sectionObserver.observe(section);
    });
    // 添加滚动动画样式
    const style = document.createElement('style');
    style.textContent = `
        .initial-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .animate-fade-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});