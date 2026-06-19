(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const menuPanel = document.querySelector('[data-menu-panel]');

    if (menuButton && menuPanel) {
        menuButton.addEventListener('click', function () {
            menuPanel.classList.toggle('open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === currentSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.dataset.heroDot || 0));
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    const searchInputs = Array.from(document.querySelectorAll('.js-search-input'));

    function normalizeText(value) {
        return String(value || '').toLowerCase().trim();
    }

    function getPathPrefix() {
        return window.location.pathname.includes('/movies/') ? '../' : './';
    }

    function renderSearchResults(input, panel, query) {
        const index = window.MOVIE_SEARCH_INDEX || [];
        const prefix = getPathPrefix();
        const term = normalizeText(query);

        if (!term) {
            panel.classList.remove('open');
            panel.innerHTML = '';
            return;
        }

        const results = index.filter(function (item) {
            return normalizeText(item.title + ' ' + item.year + ' ' + item.region + ' ' + item.type + ' ' + item.category + ' ' + item.tags).includes(term);
        }).slice(0, 14);

        if (!results.length) {
            panel.innerHTML = '<div class="search-result"><strong>没有找到匹配影片</strong></div>';
            panel.classList.add('open');
            return;
        }

        panel.innerHTML = results.map(function (item) {
            return [
                '<a class="search-result" href="' + prefix + item.url + '">',
                '    <img src="' + prefix + item.cover + '" alt="' + item.title + '">',
                '    <span>',
                '        <strong>' + item.title + '</strong>',
                '        <span>' + item.year + ' · ' + item.region + ' · ' + item.category + '</span>',
                '    </span>',
                '</a>'
            ].join('');
        }).join('');
        panel.classList.add('open');
    }

    searchInputs.forEach(function (input) {
        const panel = input.parentElement.querySelector('[data-search-panel]');
        if (!panel) {
            return;
        }
        input.addEventListener('input', function () {
            renderSearchResults(input, panel, input.value);
        });
        document.addEventListener('click', function (event) {
            if (!input.parentElement.contains(event.target)) {
                panel.classList.remove('open');
            }
        });
    });

    const localFilters = Array.from(document.querySelectorAll('.js-local-filter'));
    localFilters.forEach(function (input) {
        const section = input.closest('main');
        const cards = Array.from(section.querySelectorAll('.movie-card'));
        input.addEventListener('input', function () {
            const term = normalizeText(input.value);
            cards.forEach(function (card) {
                const haystack = normalizeText(card.dataset.title + ' ' + card.dataset.year + ' ' + card.dataset.region + ' ' + card.dataset.type + ' ' + card.dataset.category);
                card.classList.toggle('hidden-by-filter', term && !haystack.includes(term));
            });
        });
    });

    const sortableGrid = document.querySelector('[data-sortable-grid]');
    const sortButtons = Array.from(document.querySelectorAll('[data-sort]'));
    sortButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            if (!sortableGrid) {
                return;
            }
            const direction = button.dataset.sort === 'asc' ? 1 : -1;
            const cards = Array.from(sortableGrid.querySelectorAll('.movie-card'));
            cards.sort(function (a, b) {
                return (Number(a.dataset.year || 0) - Number(b.dataset.year || 0)) * direction;
            }).forEach(function (card) {
                sortableGrid.appendChild(card);
            });
        });
    });

    const categorySelect = document.querySelector('.js-category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', function () {
            const index = window.CATEGORY_URLS || {};
            if (categorySelect.value && index[categorySelect.value]) {
                window.location.href = getPathPrefix() + index[categorySelect.value];
            }
        });
    }
})();
