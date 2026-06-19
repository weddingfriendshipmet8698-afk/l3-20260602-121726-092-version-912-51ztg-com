(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function () {
        var video = document.querySelector("[data-player]");
        var cover = document.querySelector("[data-player-cover]");
        var playButton = document.querySelector("[data-play-button]");
        var streamUrl = window.__videoSrc || "";
        var hlsPlayer = null;
        var prepared = false;

        if (!video || !streamUrl) {
            return;
        }

        function prepare() {
            if (prepared) {
                return;
            }

            prepared = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsPlayer = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsPlayer.loadSource(streamUrl);
                hlsPlayer.attachMedia(video);
                return;
            }

            video.src = streamUrl;
        }

        function play() {
            prepare();

            if (cover) {
                cover.classList.add("is-hidden");
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        function toggle() {
            if (video.paused) {
                play();
                return;
            }

            video.pause();
        }

        if (playButton) {
            playButton.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                play();
            });
        }

        if (cover) {
            cover.addEventListener("click", play);
        }

        video.addEventListener("click", toggle);
        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsPlayer) {
                hlsPlayer.destroy();
            }
        });
    });
})();
