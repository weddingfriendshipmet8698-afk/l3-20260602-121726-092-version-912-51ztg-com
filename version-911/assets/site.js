(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileMenu = document.querySelector("[data-mobile-menu]");

        if (menuButton && mobileMenu) {
            menuButton.addEventListener("click", function () {
                mobileMenu.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        var active = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        function scheduleSlide() {
            if (timer) {
                window.clearInterval(timer);
            }

            if (slides.length > 1) {
                timer = window.setInterval(function () {
                    showSlide(active + 1);
                }, 5600);
            }
        }

        if (slides.length) {
            showSlide(0);
            scheduleSlide();

            if (prev) {
                prev.addEventListener("click", function () {
                    showSlide(active - 1);
                    scheduleSlide();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    showSlide(active + 1);
                    scheduleSlide();
                });
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                    scheduleSlide();
                });
            });
        }

        var searchInput = document.querySelector("[data-search-input]");
        var typeSelect = document.querySelector("[data-type-filter]");
        var regionSelect = document.querySelector("[data-region-filter]");
        var yearSelect = document.querySelector("[data-year-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
        var empty = document.querySelector("[data-search-empty]");

        function valueOf(element) {
            return element ? element.value.trim().toLowerCase() : "";
        }

        function filterCards() {
            if (!cards.length) {
                return;
            }

            var keyword = valueOf(searchInput);
            var typeValue = valueOf(typeSelect);
            var regionValue = valueOf(regionSelect);
            var yearValue = valueOf(yearSelect);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute("data-card-keywords") || "").toLowerCase();
                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (typeValue && haystack.indexOf(typeValue) === -1) {
                    matched = false;
                }

                if (regionValue && haystack.indexOf(regionValue) === -1) {
                    matched = false;
                }

                if (yearValue && haystack.indexOf(yearValue) === -1) {
                    matched = false;
                }

                card.style.display = matched ? "" : "none";

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [searchInput, typeSelect, regionSelect, yearSelect].forEach(function (element) {
            if (element) {
                element.addEventListener("input", filterCards);
                element.addEventListener("change", filterCards);
            }
        });

        if (cards.length) {
            filterCards();
        }

        var dynamicResults = document.querySelector("[data-dynamic-results]");

        if (dynamicResults && window.MOVIE_INDEX) {
            var dynamicInput = document.querySelector("[data-dynamic-search]");
            var dynamicType = document.querySelector("[data-dynamic-type]");
            var dynamicRegion = document.querySelector("[data-dynamic-region]");
            var dynamicYear = document.querySelector("[data-dynamic-year]");

            function renderDynamic() {
                var keyword = valueOf(dynamicInput);
                var typeValue = valueOf(dynamicType);
                var regionValue = valueOf(dynamicRegion);
                var yearValue = valueOf(dynamicYear);
                var list = window.MOVIE_INDEX.filter(function (item) {
                    var haystack = [item.title, item.genre, item.tags, item.region, item.year, item.type].join(" ").toLowerCase();

                    if (keyword && haystack.indexOf(keyword) === -1) {
                        return false;
                    }

                    if (typeValue && String(item.type).toLowerCase().indexOf(typeValue) === -1) {
                        return false;
                    }

                    if (regionValue && String(item.region).toLowerCase().indexOf(regionValue) === -1) {
                        return false;
                    }

                    if (yearValue && String(item.year).toLowerCase().indexOf(yearValue) === -1) {
                        return false;
                    }

                    return true;
                }).slice(0, 120);

                dynamicResults.innerHTML = list.map(function (item) {
                    return [
                        '<article class="movie-card">',
                        '<a class="poster-wrap" href="' + item.url + '">',
                        '<img src="' + item.poster + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
                        '<span class="poster-badge">' + escapeHtml(item.type) + '</span>',
                        '</a>',
                        '<div class="card-body">',
                        '<div class="card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>',
                        '<h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>',
                        '<p>' + escapeHtml(item.one_line) + '</p>',
                        '</div>',
                        '</article>'
                    ].join("");
                }).join("");

                if (!list.length) {
                    dynamicResults.innerHTML = '<div class="search-empty is-visible">没有找到匹配内容</div>';
                }
            }

            function escapeHtml(text) {
                return String(text)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }

            [dynamicInput, dynamicType, dynamicRegion, dynamicYear].forEach(function (element) {
                if (element) {
                    element.addEventListener("input", renderDynamic);
                    element.addEventListener("change", renderDynamic);
                }
            });

            renderDynamic();
        }
    });
})();
