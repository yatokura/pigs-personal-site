(function () {
    'use strict';

    var canvas = document.getElementById('bg-particles');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var width = 0;
    var height = 0;
    var particles = [];
    var lastTime = 0;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function targetCount() {
        return Math.round(Math.min(170, Math.max(50, (width * height) / 13000)));
    }

    function spawn() {
        return {
            x: rand(0, width),
            y: rand(0, height),
            size: rand(0.8, 2.2),
            vx: rand(-0.12, 0.12),
            vy: 0,
            fall: rand(12, 34),
            sway: rand(0, Math.PI * 2),
            swaySpeed: rand(0.3, 0.9),
            swayAmp: rand(4, 14),
            alpha: rand(0.35, 0.9)
        };
    }

    function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var target = targetCount();
        while (particles.length < target) particles.push(spawn());
        if (particles.length > target) particles.length = target;
    }

    function update(dt) {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.sway += p.swaySpeed * dt;
            p.vy = Math.min(p.vy + 10 * dt, p.fall);
            p.x += p.vx * dt * 60 + Math.sin(p.sway) * p.swayAmp * dt;
            p.y += p.vy * dt;
            if (p.x < -10) p.x = width + 10;
            else if (p.x > width + 10) p.x = -10;
            if (p.y > height + 10) {
                p.y = -10;
                p.x = rand(0, width);
                p.vy = 0;
                p.sway = rand(0, Math.PI * 2);
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function frame(now) {
        var dt = Math.min((now - lastTime) / 1000, 0.05) || 0;
        lastTime = now;
        update(dt);
        draw();
        window.requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    resize();

    if (reduceMotion) {
        draw();
    } else {
        window.requestAnimationFrame(frame);
    }
})();
