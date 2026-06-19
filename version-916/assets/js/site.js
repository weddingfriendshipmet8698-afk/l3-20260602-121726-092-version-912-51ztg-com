(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            var open = panel.classList.toggle("open");
            document.body.classList.toggle("menu-open", open);
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
        panel.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                panel.classList.remove("open");
                document.body.classList.remove("menu-open");
                button.setAttribute("aria-expanded", "false");
            });
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        if (slides.length <= 1) {
            return;
        }
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        var current = 0;
        var timer;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        show(0);
        start();
    }

    function setupFilters() {
        document.querySelectorAll("[data-filter-area]").forEach(function (area) {
            var input = area.querySelector("[data-filter-input]");
            var year = area.querySelector("[data-filter-year]");
            var region = area.querySelector("[data-filter-region]");
            var cards = Array.prototype.slice.call(area.querySelectorAll(".movie-card"));
            if (!cards.length) {
                return;
            }

            function apply() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var yearValue = year ? year.value : "";
                var regionValue = region ? region.value : "";
                cards.forEach(function (card) {
                    var text = (card.textContent || "").toLowerCase();
                    var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchYear = !yearValue || card.getAttribute("data-year") === yearValue;
                    var cardRegion = card.getAttribute("data-region") || "";
                    var matchRegion = !regionValue || cardRegion.indexOf(regionValue) !== -1;
                    card.classList.toggle("is-hidden", !(matchKeyword && matchYear && matchRegion));
                });
            }

            [input, year, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    }

    window.MovieSitePlayer = function (stream) {
        var box = document.querySelector("[data-player]");
        if (!box || !stream) {
            return;
        }
        var video = box.querySelector("video");
        var cover = box.querySelector("[data-play-cover]");
        var button = box.querySelector("[data-play-button]");
        var hls = null;
        var started = false;

        function hideCover() {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        }

        function playVideo() {
            if (!video) {
                return;
            }
            hideCover();
            if (started) {
                video.play().catch(function () {});
                return;
            }
            started = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                video.addEventListener("loadedmetadata", function () {
                    video.play().catch(function () {});
                }, { once: true });
                video.play().catch(function () {});
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }
            video.src = stream;
            video.play().catch(function () {});
        }

        if (cover) {
            cover.addEventListener("click", playVideo);
        }
        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                playVideo();
            });
        }
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    playVideo();
                }
            });
            video.addEventListener("emptied", function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                    started = false;
                }
            });
        }
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
}());
