export function initParticles(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width, height, particles, mouse, animationId;
  const PARTICLE_COUNT = 120;
  const CONNECTION_DIST = 120;
  const MOUSE_RADIUS = 180;
  const MOUSE_REPEL = 60;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.4 + 0.3,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  mouse = { x: -1000, y: -1000, active: false, px: -1000, py: -1000 };

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.pulse += 0.02;
      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_REPEL) {
          const force = (MOUSE_REPEL - dist) / MOUSE_REPEL;
          p.vx += (dx / dist) * force * 0.8;
          p.vy += (dy / dist) * force * 0.8;
        } else if (dist < MOUSE_RADIUS && dist > MOUSE_REPEL) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx -= (dx / dist) * force * 0.15;
          p.vy -= (dy / dist) * force * 0.15;
        }
      }

      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20, 184, 166, ${pulseAlpha})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20, 184, 166, ${pulseAlpha * 0.08})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(20, 184, 166, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      if (mouse.active) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS) {
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.5;
          const speed = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
          const hue = Math.min(speed * 6, 60);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
          ctx.lineWidth = 0.6 + speed * 0.01;
          ctx.stroke();
        }
      }
    }

    if (mouse.active) {
      const speed = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80 + speed);
      gradient.addColorStop(0, "rgba(20, 184, 166, 0.06)");
      gradient.addColorStop(0.5, "rgba(20, 184, 166, 0.03)");
      gradient.addColorStop(1, "rgba(20, 184, 166, 0)");
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 80 + speed, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    mouse.px = mouse.x;
    mouse.py = mouse.y;

    animationId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  };

  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (touch) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      mouse.active = true;
    }
  });

  canvas.addEventListener("mouseleave", () => { mouse.active = false; });
  canvas.addEventListener("touchend", () => { mouse.active = false; });

  draw();

  return () => cancelAnimationFrame(animationId);
}
