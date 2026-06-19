(function () {
    function initPlayer(video, source, shell) {
        if (!video || !source) {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {
                    video.controls = true;
                });
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.addEventListener('loadedmetadata', function () {
                video.play().catch(function () {
                    video.controls = true;
                });
            }, { once: true });
        } else {
            video.src = source;
            video.play().catch(function () {
                video.controls = true;
            });
        }

        shell.classList.add('playing');
    }

    document.querySelectorAll('[data-play-button]').forEach(function (button) {
        button.addEventListener('click', function () {
            const shell = button.closest('.player-shell');
            const targetId = button.dataset.target;
            const video = document.getElementById(targetId);
            const source = shell ? shell.dataset.videoSource : '';
            initPlayer(video, source, shell);
        });
    });
})();
