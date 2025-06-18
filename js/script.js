document.addEventListener('DOMContentLoaded', function () {
    // Плавное появление секций: Intersection Observer
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

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Навигация: подсветка активного пункта при скролле
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header#home');

    function onScrollNav() {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    window.addEventListener('scroll', onScrollNav);
    onScrollNav();

    // Navbar: добавить/убрать класс при прокрутке для эффекта фоновой заливки
    const navbarElement = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });

    // Плавный скролл при клике на navbar
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

    // Аудиоплеер: управление несколькими треками, прогресс-бар
    const playButtons = document.querySelectorAll('.play-btn');
    let currentAudio = null;
    let currentButton = null;

    playButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const audioId = this.getAttribute('data-audio-id');
            const audioEl = document.getElementById(audioId);
            if (!audioEl) return;

            // Если другой трек играет — остановим его
            if (currentAudio && currentAudio !== audioEl) {
                currentAudio.pause();
                if (currentButton) {
                    currentButton.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
                }
            }
            // Переключаем play/pause текущего
            if (audioEl.paused) {
                audioEl.play();
                this.innerHTML = '<i class="bi bi-pause-fill"></i> Пауза';
                currentAudio = audioEl;
                currentButton = this;
            } else {
                audioEl.pause();
                this.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
            }

            // Обработать окончание трека
            audioEl.onended = () => {
                if (this) this.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
                const prog = document.querySelector(`.audio-progress[data-audio-id="${audioId}"] .progress-bar`);
                if (prog) prog.style.width = '0%';
            };
        });
    });

    // Обновляем прогресс-бар
    document.querySelectorAll('audio').forEach(audioEl => {
        const audioId = audioEl.getAttribute('id');
        const progressContainer = document.querySelector(`.audio-progress[data-audio-id="${audioId}"]`);
        const progressBar = progressContainer ? progressContainer.querySelector('.progress-bar') : null;
        if (!progressBar) return;

        audioEl.addEventListener('timeupdate', () => {
            if (audioEl.duration) {
                const percent = (audioEl.currentTime / audioEl.duration) * 100;
                progressBar.style.width = percent + '%';
            }
        });
        // Клик по прогресс-бару: перемотка
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = (clickX / width) * audioEl.duration;
            audioEl.currentTime = newTime;
        });
    });

    // Модальное окно с видео: когда закрывают — остановить воспроизведение
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
