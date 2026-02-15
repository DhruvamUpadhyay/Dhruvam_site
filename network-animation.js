// The Neural Constellation - Final Galaxy Edition + Neural Genesis Intro
// Features: Nebula Background, Star Dust, Intelligent Mouse Interaction, Shooting Stars, Big Bang Intro

window.addEventListener('load', function () {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Mouse tracking
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    // Intro State
    let introState = 'gathering'; // gathering, exploding, done
    let explosionTime = 0;

    // Global function to trigger explosion (called from HTML script)
    window.triggerExplosion = function () {
        introState = 'exploding';
    };

    // Colors
    const colors = [
        { r: 56, g: 189, b: 248 }, // Sky 400 (Cyan)
        { r: 37, g: 99, b: 235 },  // Blue 600 (Deep Blue)
        { r: 139, g: 92, b: 246 }, // Violet 500
        { r: 236, g: 72, b: 153 }  // Pink 500
    ];

    // Configuration
    // Configuration
    const particleCount = 200; // Increased for denser galaxy effect
    const dustCount = 120;
    const particles = [];
    const dust = [];
    const nebulas = [];
    let shootingStar = null;

    // Nebula
    class Nebula {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = 300 + Math.random() * 300;
            this.vx = (Math.random() - 0.5) * 0.05;
            this.vy = (Math.random() - 0.5) * 0.05;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = 0;
            this.targetOpacity = 0.03 + Math.random() * 0.03;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.opacity < this.targetOpacity) this.opacity += 0.0002;

            if (this.x < -300 || this.x > width + 300) this.vx *= -1;
            if (this.y < -300 || this.y > height + 300) this.vy *= -1;
        }

        draw() {
            // Fade out during explosion flash? No, keep it subtle
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
            gradient.addColorStop(0.2, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
            gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Star Dust
    class StarDust {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5;
            this.alpha = Math.random() * 0.3;
            // Intro: Start Invisible
            this.visible = false;
            this.pulse = Math.random() * Math.PI * 2;
        }

        draw() {
            if (introState !== 'done' && introState !== 'exploding') return;
            // Delay visibility slightly during explosion
            if (!this.visible && introState === 'exploding' && Math.random() > 0.95) this.visible = true;

            if (this.visible || introState === 'done') {
                this.pulse += 0.05;
                const flicker = Math.sin(this.pulse) * 0.1;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.alpha + flicker)})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Shooting Star
    class ShootingStar {
        constructor() { this.reset(); this.wait = 200; } // Wait longer initially
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height * 0.5;
            this.len = 100 + Math.random() * 80;
            this.speed = 15 + Math.random() * 10;
            this.size = Math.random() * 1 + 0.5;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
            this.opacity = 0;
            this.state = 0;
            this.wait = Math.random() * 500;
        }
        update() {
            if (introState !== 'done') return; // Only after intro
            if (this.state === 0) {
                this.wait--;
                if (this.wait <= 0) this.state = 1;
                return;
            }
            if (this.state === 1) {
                this.opacity += 0.05;
                if (this.opacity >= 1) this.state = 2;
            }
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            if (this.x > width + 200 || this.y > height + 200) this.reset();
        }
        draw() {
            if (this.state === 0) return;
            const tailX = this.x - Math.cos(this.angle) * this.len;
            const tailY = this.y - Math.sin(this.angle) * this.len;
            const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = this.size;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();
        }
    }

    // Particle
    class Particle {
        constructor() {
            this.init();
        }

        init() {
            // Target Position (Home)
            this.targetPos = {
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random()
            };

            // Intro: Start at Center
            this.x = width / 2 + (Math.random() - 0.5) * 10;
            this.y = height / 2 + (Math.random() - 0.5) * 10;
            this.z = this.targetPos.z;

            this.size = 1.5 + Math.random() * 2;

            // Flow speeds (for after intro)
            const baseSpeed = 0.2 + this.z * 0.3;
            this.vx = 0;
            this.vy = 0;
            this.targetVx = baseSpeed + (Math.random() - 0.5) * 0.1;
            this.targetVy = -baseSpeed * 0.5 + (Math.random() - 0.5) * 0.1;

            this.color = colors[Math.floor(Math.random() * 2)];
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.03;

            // Explosion velocity
            const angle = Math.random() * Math.PI * 2;
            const force = 10 + Math.random() * 20;
            this.explodeVx = Math.cos(angle) * force;
            this.explodeVy = Math.sin(angle) * force;
        }

        resetToSpace() {
            // Just ensure they are within bounds
            if (this.x > width + 50) this.x = -50;
            if (this.x < -50) this.x = width + 50;
            if (this.y > height + 50) this.y = -50;
            if (this.y < -50) this.y = height + 50;
        }

        update() {
            if (introState === 'gathering') {
                // Swirl around center
                const cx = width / 2;
                const cy = height / 2;
                const dx = this.x - cx;
                const dy = this.y - cy;

                // Tight orbit
                const angle = Math.atan2(dy, dx) + 0.1; // Rotate
                const dist = Math.sqrt(dx * dx + dy * dy);
                const targetDist = 20 + Math.sin(Date.now() * 0.005) * 10; // Breathe

                const force = (targetDist - dist) * 0.1;

                this.x = cx + Math.cos(angle) * (dist + force);
                this.y = cy + Math.sin(angle) * (dist + force);

                // Add jitter
                this.x += (Math.random() - 0.5) * 2;
                this.y += (Math.random() - 0.5) * 2;
                return;
            }

            if (introState === 'exploding') {
                // Fly outwards
                this.x += this.explodeVx;
                this.y += this.explodeVy;
                this.explodeVx *= 0.92; // Friction
                this.explodeVy *= 0.92;

                // Transition to normal state when slow enough
                if (Math.abs(this.explodeVx) < 0.5 && Math.abs(this.explodeVy) < 0.5) {
                    // Start transitioning to flow
                    this.vx = this.explodeVx;
                    this.vy = this.explodeVy;
                    // We don't set introState='done' per particle, check globally or just flow
                }
            }

            // Normal Flow & Interaction (Active even during late explosion)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const interactionRadius = 220;

            if (dist < interactionRadius) {
                const force = (interactionRadius - dist) / interactionRadius;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force * 0.05;
                this.vy += Math.sin(angle) * force * 0.05;
            }

            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.96;
            this.vy *= 0.96;

            const baseSpeed = 0.2 + this.z * 0.3;
            // Lerp to target flow
            this.vx += (this.targetVx - this.vx) * 0.02;
            this.vy += (this.targetVy - this.vy) * 0.02;

            this.pulse += this.pulseSpeed;
            this.resetToSpace();
        }

        draw() {
            let baseAlpha = 0.2 + this.z * 0.5;

            if (introState === 'gathering') {
                baseAlpha = 0.8; // Bright in center
            }

            let alpha = Math.max(0.1, baseAlpha + Math.sin(this.pulse) * 0.2);

            if (introState === 'gathering') {
                // Intense glow
                const size = this.size * 2;
                ctx.shadowBlur = 20;
                ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
                ctx.fillStyle = `rgba(255, 255, 255, 1)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                return;
            }

            // Mouse Highlight
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) alpha += (1 - dist / 220) * 0.5;
            alpha = Math.min(1, alpha);

            const size = this.size * (0.5 + this.z * 1.0);

            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, size * 3
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            gradient.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.4})`);
            gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, size * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Init
    for (let i = 0; i < 4; i++) nebulas.push(new Nebula());
    for (let i = 0; i < dustCount; i++) dust.push(new StarDust());
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    shootingStar = new ShootingStar();

    function animate() {
        // Draw Background
        // If intro gathering, pure black
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        // Scroll Blur
        if (introState === 'done') {
            const scrollY = window.scrollY || window.pageYOffset;
            const blurStart = 100;
            const maxBlur = 8;
            let blurAmount = 0;
            if (scrollY > blurStart) {
                blurAmount = Math.min(maxBlur, (scrollY - blurStart) / 500 * maxBlur);
            }
            if (Math.abs(blurAmount - (parseFloat(canvas.style.filter?.replace('blur(', '').replace('px)', '')) || 0)) > 0.1) {
                canvas.style.filter = `blur(${blurAmount}px)`;
            }
        }

        // Update State
        if (introState === 'exploding') {
            explosionTime++;
            if (explosionTime > 100) introState = 'done';
        }

        // Mouse Update
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;

        // Draw Layers
        if (introState === 'done' || introState === 'exploding') {
            nebulas.forEach(n => { n.update(); n.draw(); });
            dust.forEach(d => d.draw());
        }

        if (shootingStar) {
            shootingStar.update();
            shootingStar.draw();
        }

        particles.sort((a, b) => a.z - b.z);
        particles.forEach(p => { p.update(); p.draw(); });

        // Connections (Only after intro)
        if (introState === 'done' || (introState === 'exploding' && explosionTime > 50)) {
            for (let i = 0; i < particles.length; i++) {
                if (particles[i].z < 0.5) continue;
                for (let j = i + 1; j < particles.length; j++) {
                    if (particles[j].z < 0.5) continue;
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        const alpha = (1 - dist / 110) * 0.2 * particles[i].z;
                        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Mouse Lines
        particles.forEach(p => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (false) { // Mouse lines disabled
                ctx.beginPath();
                const alpha = (1 - dist / 220) * 0.5;
                const grad = ctx.createLinearGradient(p.x, p.y, mouse.x, mouse.y);
                grad.addColorStop(0, `rgba(56, 189, 248, 0)`);
                grad.addColorStop(1, `rgba(56, 189, 248, ${alpha})`);
                ctx.strokeStyle = grad;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        });

        requestAnimationFrame(animate);
    }

    // Handlers
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    animate();
});
