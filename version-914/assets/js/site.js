(function() {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, current) {
                slide.classList.toggle('active', current === index);
            });
            dots.forEach(function(dot, current) {
                dot.classList.toggle('active', current === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function() {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function() {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function() {
                show(index + 1);
                restart();
            });
        }

        restart();
    }

    var input = document.querySelector('[data-filter-input]');
    var sort = document.querySelector('[data-sort-select]');
    var container = document.querySelector('[data-sort-container]');
    var empty = document.querySelector('[data-empty-state]');

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function getCards() {
        return Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    }

    function filterCards() {
        var query = normalize(input ? input.value : '');
        var visible = 0;
        getCards().forEach(function(card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-tags')
            ].join(' '));
            var matched = !query || text.indexOf(query) !== -1;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle('show', visible === 0);
        }
    }

    function sortCards() {
        if (!container || !sort) {
            return;
        }
        var value = sort.value;
        var cards = getCards();
        cards.sort(function(a, b) {
            if (value === 'year-desc') {
                return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
            }
            if (value === 'heat-desc') {
                return Number(b.getAttribute('data-heat')) - Number(a.getAttribute('data-heat'));
            }
            if (value === 'title-asc') {
                return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-Hans-CN');
            }
            return 0;
        });
        cards.forEach(function(card) {
            container.appendChild(card);
        });
        filterCards();
    }

    if (input) {
        input.addEventListener('input', filterCards);
    }

    if (sort) {
        sort.addEventListener('change', sortCards);
    }
})();
