document.addEventListener('DOMContentLoaded', function () {
    // 1) Intersection Observer для анимаций появления
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-from-bottom, .animate-from-left, .animate-from-right, .animate-from-top')
      .forEach(el => {
        observer.observe(el);
    });

    // 2) Navbar: подсветка активного пункта при скролле
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header#home');

    function onScrollNav() {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        sections.forEach(section => {
            const id = section.getAttribute('id');
            if (!id) return;
            if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    window.addEventListener('scroll', onScrollNav);
    onScrollNav();

    // 3) Navbar фон при скролле
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });

    // 4) Плавный скролл при клике на navbar
    navLinks.forEach(link => {
        if (link.hash) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // 5) Parallax-эффект для видео-фона
    const videoBg = document.querySelector('.video-bg');
    window.addEventListener('scroll', () => {
        if (videoBg) {
            const scrollTop = window.scrollY;
            // смещаем фон видео чуть вниз по мере скролла
            videoBg.style.transform = `translate(-50%, -50%) translateY(${scrollTop * 0.2}px)`;
        }
    });

    // 6) Tooltip на иконках соцсетей
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(el => {
        new bootstrap.Tooltip(el);
    });

    // 7) Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 8) Custom cursor
    const customCursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', e => {
        customCursor.style.top = e.clientY + 'px';
        customCursor.style.left = e.clientX + 'px';
    });
    // Увеличение курсора при hover на интерактивных элементах
    const interactiveSelectors = ['a', 'button', '.btn', '.nav-link'];
    interactiveSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(2)';
                customCursor.style.backgroundColor = 'rgba(186,59,70,0.2)';
            });
            elem.addEventListener('mouseleave', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
                customCursor.style.backgroundColor = 'transparent';
            });
        });
    });

    // 9) Ripple effect на кнопках
    document.querySelectorAll('.btn-ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255,255,255,0.7)';
            ripple.style.transform = 'scale(0)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
            this.appendChild(ripple);
            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(1)';
                ripple.style.opacity = '0';
            });
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 10) Аудиоплеер с прогресс-баром и визуализатором
    const audioElements = document.querySelectorAll('audio');
    const playButtons = document.querySelectorAll('.play-btn');
    let currentAudio = null;
    let currentButton = null;

    // Для визуализатора: создаём AudioContext и Analyser при первом play
    const audioContextMap = new Map(); // key: audioEl, value: {context, source, analyser, dataArray, canvas, canvasCtx, animationId}

    playButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const audioId = this.getAttribute('data-audio-id');
            const audioEl = document.getElementById(audioId);
            if (!audioEl) return;

            // Если другой трек играет — остановим его и очистим визуализатор
            if (currentAudio && currentAudio !== audioEl) {
                stopAudio(currentAudio);
            }
            // Переключаем play/pause
            if (audioEl.paused) {
                playAudio(audioEl, this);
            } else {
                stopAudio(audioEl);
            }
        });
    });

    // Функция playAudio
    function playAudio(audioEl, btnElem) {
        audioEl.play();
        btnElem.innerHTML = '<i class="bi bi-pause-fill"></i> Пауза';
        currentAudio = audioEl;
        currentButton = btnElem;

        setupVisualizer(audioEl);
    }

    // Функция stopAudio
    function stopAudio(audioEl) {
        audioEl.pause();
        // Найдём кнопку для этого аудио:
        const btn = document.querySelector(`.play-btn[data-audio-id="${audioEl.id}"]`);
        if (btn) btn.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
        // Остановим визуализацию
        teardownVisualizer(audioEl);
        // Сброс прогресса (можно оставить на текущем месте, но обычно сбрасывают)
        //audioEl.currentTime = 0; // если нужно сбрасывать
    }

    // Прогресс-бар и клики по нему
    audioElements.forEach(audioEl => {
        const audioId = audioEl.getAttribute('id');
        const progressContainer = document.querySelector(`.audio-progress[data-audio-id="${audioId}"]`);
        const progressBar = progressContainer ? progressContainer.querySelector('.progress-bar') : null;
        if (!progressBar || !progressContainer) return;

        audioEl.addEventListener('timeupdate', () => {
            if (audioEl.duration) {
                const percent = (audioEl.currentTime / audioEl.duration) * 100;
                progressBar.style.width = percent + '%';
            }
        });
        audioEl.addEventListener('ended', () => {
            teardownVisualizer(audioEl);
            if (audioEl === currentAudio) {
                const btn = document.querySelector(`.play-btn[data-audio-id="${audioId}"]`);
                if (btn) btn.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
                currentAudio = null;
                currentButton = null;
            }
            // Сброс прогресса
            progressBar.style.width = '0%';
        });
        // Перемотка по клику
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = (clickX / width) * audioEl.duration;
            audioEl.currentTime = newTime;
        });
    });

    // Функция установки визуализатора
    function setupVisualizer(audioEl) {
        if (!window.AudioContext && !window.webkitAudioContext) {
            return;
        }
        if (audioContextMap.has(audioEl)) {
            // Уже создан, запустим отрисовку
            const obj = audioContextMap.get(audioEl);
            if (!obj.animationId) {
                drawVisualizer(obj);
            }
            return;
        }
        // Создаём новый AudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(audioEl);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        // Canvas для визуализации
        const canvas = document.querySelector(`.audio-visualizer[data-audio-id="${audioEl.id}"]`);
        if (!canvas) return;
        const canvasCtx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const obj = { audioCtx, source, analyser, dataArray, canvas, canvasCtx, animationId: null };
        audioContextMap.set(audioEl, obj);
        drawVisualizer(obj);
    }

    // Функция отрисовки визуализатора
    function drawVisualizer(obj) {
        const { analyser, dataArray, canvas, canvasCtx } = obj;
        const WIDTH = canvas.width = canvas.clientWidth;
        const HEIGHT = canvas.height = canvas.clientHeight;
        const bufferLength = analyser.frequencyBinCount;

        function draw() {
            obj.animationId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            const barWidth = (WIDTH / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * HEIGHT;
                canvasCtx.fillStyle = 'rgba(186,59,70,0.7)';
                canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }
        draw();
    }

    // Остановка визуализатора
    function teardownVisualizer(audioEl) {
        const obj = audioContextMap.get(audioEl);
        if (obj) {
            if (obj.animationId) {
                cancelAnimationFrame(obj.animationId);
                obj.animationId = null;
            }
            // Можно очистить canvas
            const { canvas, canvasCtx } = obj;
            if (canvasCtx) {
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            }
            // Не закрываем AudioContext, оставляем для дальнейшего reuse
        }
    }

    // 11) Остановка модального видео при закрытии
    const promoModal = document.getElementById('promoModal');
    if (promoModal) {
        promoModal.addEventListener('hidden.bs.modal', function () {
            const video = document.getElementById('promoModalVideo');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
});
