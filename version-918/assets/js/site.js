(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobile = document.querySelector("[data-mobile-nav]");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        mobile.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero-slider]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dotsWrap = hero.querySelector(".hero-dots");
      var index = 0;
      var timer = null;
      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        if (dotsWrap) {
          Array.prototype.slice.call(dotsWrap.querySelectorAll("button")).forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === index);
          });
        }
      }
      function play() {
        clearInterval(timer);
        timer = setInterval(function () {
          show(index + 1);
        }, 5000);
      }
      if (dotsWrap) {
        slides.forEach(function (_, i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", "切换焦点影片" + (i + 1));
          dot.addEventListener("click", function () {
            show(i);
            play();
          });
          dotsWrap.appendChild(dot);
        });
      }
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          play();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          play();
        });
      }
      show(0);
      play();
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var yearSelect = document.querySelector("[data-year-select]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-title][data-year]"));
    function filterCards() {
      var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";
      cards.forEach(function (card) {
        var text = [card.dataset.title, card.dataset.region, card.dataset.genre].join(" ").toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) > -1;
        var matchYear = !year || card.dataset.year === year;
        card.style.display = matchKeyword && matchYear ? "" : "none";
      });
    }
    if (filterInput) {
      filterInput.addEventListener("input", filterCards);
    }
    if (yearSelect) {
      yearSelect.addEventListener("change", filterCards);
    }

    var player = document.querySelector("[data-video-url]");
    if (player) {
      var layer = document.querySelector("[data-play-layer]");
      var source = player.getAttribute("data-video-url");
      var attached = false;
      function attach() {
        if (attached || !source) {
          return;
        }
        attached = true;
        if (player.canPlayType("application/vnd.apple.mpegurl")) {
          player.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(player);
        } else {
          player.src = source;
        }
      }
      function start() {
        attach();
        if (layer) {
          layer.classList.add("is-hidden");
        }
        var attempt = player.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {});
        }
      }
      if (layer) {
        layer.addEventListener("click", start);
      }
      player.addEventListener("play", function () {
        if (layer) {
          layer.classList.add("is-hidden");
        }
      });
    }

    var searchInput = document.querySelector("[data-site-search]");
    var searchResults = document.querySelector("[data-search-results]");
    if (searchInput && searchResults && window.SEARCH_ITEMS) {
      function render(items) {
        if (!items.length) {
          searchResults.innerHTML = '<div class="empty-state">没有找到匹配影片</div>';
          return;
        }
        searchResults.innerHTML = items.slice(0, 80).map(function (item) {
          return '<a class="search-card" href="' + item.url + '">' +
            '<img src="' + item.image + '" alt="' + escapeHtml(item.title) + '">' +
            '<div><h2>' + escapeHtml(item.title) + '</h2>' +
            '<p>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.type) + '</p>' +
            '<p>' + escapeHtml(item.oneLine) + '</p></div></a>';
        }).join("");
      }
      function escapeHtml(value) {
        return String(value).replace(/[&<>"]/g, function (char) {
          return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char];
        });
      }
      function runSearch() {
        var keyword = searchInput.value.trim().toLowerCase();
        var items = window.SEARCH_ITEMS.filter(function (item) {
          var text = [item.title, item.year, item.region, item.type, item.category, item.genre, item.oneLine].join(" ").toLowerCase();
          return !keyword || text.indexOf(keyword) > -1;
        });
        render(items);
      }
      searchInput.addEventListener("input", runSearch);
      render(window.SEARCH_ITEMS.slice(0, 32));
    }
  });
})();
