document.addEventListener('DOMContentLoaded', function () {
    // Управление активной ссылкой navbar при скролле
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header#home');

    function onScroll() {
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
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Аудиоплеер: при клике на кнопку воспроизведения будет остановлен текущий трек и запущен новый
    const audioElements = document.querySelectorAll('audio');
    const playButtons = document.querySelectorAll('.play-btn');
    let currentAudio = null;

    playButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const src = this.getAttribute('data-src');
            // Остановить текущий, если играет
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
            }
            // Найти элемент audio по src
            const audioEl = Array.from(audioElements).find(a => {
                return a.querySelector('source') && a.querySelector('source').getAttribute('src') === src;
            });
            if (audioEl) {
                if (audioEl.paused) {
                    audioEl.play();
                    currentAudio = audioEl;
                    // Меняем иконку кнопки на паузу
                    this.innerHTML = '<i class="bi bi-pause-fill"></i> Пауза';
                } else {
                    audioEl.pause();
                    this.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
                }
                // Добавляем слушатель на окончание трека, чтобы вернуть кнопку
                audioEl.onended = () => {
                    this.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
                };
            }
        });
    });

    // Если нажали Play на одном, другие кнопки переключаем в состояние «Воспроизвести»
    audioElements.forEach(audioEl => {
        audioEl.addEventListener('play', () => {
            audioElements.forEach(other => {
                if (other !== audioEl) {
                    other.pause();
                }
            });
            // Обновить кнопки: 
            playButtons.forEach(btn => {
                const src = btn.getAttribute('data-src');
                const playingSrc = audioEl.querySelector('source').getAttribute('src');
                if (src !== playingSrc) {
                    btn.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
                }
            });
        });
    });

    // Плавная прокрутка при клике на navbar
    navLinks.forEach(link => {
        if (link.hash) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 70, // с учётом фиксированного navbar
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
});
