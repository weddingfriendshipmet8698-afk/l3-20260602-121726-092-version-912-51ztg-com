(function () {
  "use strict";

  var navButton = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (navButton && mobileNav) {
    navButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
  var currentSlide = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === currentSlide);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      setSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      setSlide(currentSlide + 1);
    }, 5200);
  }

  setSlide(0);

  var searchInput = document.querySelector("[data-movie-search]");
  var typeSelect = document.querySelector("[data-movie-type]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-row"));
  var empty = document.querySelector(".empty-message");

  function filterMovies() {
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var type = typeSelect ? typeSelect.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = (card.getAttribute("data-search") || "").toLowerCase();
      var cardType = card.getAttribute("data-type") || "";
      var matched = (!keyword || haystack.indexOf(keyword) !== -1) && (!type || cardType === type);
      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterMovies);
  }

  if (typeSelect) {
    typeSelect.addEventListener("change", filterMovies);
  }

  function initPlayer(source) {
    var video = document.getElementById("video-player");
    var overlay = document.querySelector(".player-overlay");
    var button = document.querySelector(".play-button");
    var status = document.querySelector(".player-status");
    var loaded = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function showMessage(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function attachSource() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage("视频加载失败，请稍后重试");
          }
        });
        return;
      }

      showMessage("视频加载失败，请稍后重试");
    }

    function startVideo() {
      attachSource();

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startVideo);
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        startVideo();
      });
    }

    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.MovieSite = {
    initPlayer: initPlayer
  };
})();
