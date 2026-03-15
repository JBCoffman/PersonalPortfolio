// JavaScript to drive the velocity-sensitive trail
const canvas = document.getElementById('glow-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let width, height;
let points = [];
let mouse = { x: 0, y: 0 };
let lastMouse = { x: 0, y: 0 };

// Configuration Variables
const PRIMARY_COLOR = '#C4A962'; 
const MAX_POINTS = 35; // Controls the absolute maximum length of the tail
const DECAY_RATE = 0.08; // Controls how fast the trail fades (higher = faster fade)

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Calculate velocity based on pixel distance moved between events
    const velocity = Math.hypot(mouse.x - lastMouse.x, mouse.y - lastMouse.y);

    points.push({
        x: mouse.x,
        y: mouse.y,
        life: 1.0, // Starts fully "alive" (100% baseline opacity)
        velocity: Math.min(velocity, 40) // Capped to prevent blowout on rapid flicks
    });

    if (points.length > MAX_POINTS) {
        points.shift();
    }
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    if (points.length > 0) {
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        for (let i = 0; i < points.length; i++) {
            const p = points[i];

            // Age the point
            p.life -= DECAY_RATE;

            if (p.life <= 0) {
                points.splice(i, 1);
                i--;
                continue;
            }

            // The core logic: Opacity relies on BOTH its age and how fast the mouse was moving when it was created.
            // A slow move has a low velocity factor, making it almost imperceptible.
            const velocityFactor = 0.15 + (p.velocity / 40) * 0.85; 
            const opacity = Math.max(0, p.life * velocityFactor);

            // Dynamically scale line width based on speed for the "sparkler flare"
            ctx.lineWidth = 1 + (p.velocity * 0.08); 
            ctx.strokeStyle = `rgba(196, 169, 98, ${opacity})`; // #C4A962 converted to RGB for alpha control
            
            // The Glow Effect
            ctx.shadowBlur = 12; // Keeps the glow tight and non-chaotic
            ctx.shadowColor = PRIMARY_COLOR;

            if (i === 0) {
                ctx.moveTo(p.x, p.y);
            } else {
                // Use quadratic curves to smooth the angles between raw mouse coordinates
                const prev = points[i - 1];
                const xc = (prev.x + p.x) / 2;
                const yc = (prev.y + p.y) / 2;
                ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
            }
        }
        ctx.stroke();
    }
    
    requestAnimationFrame(animate);
}

animate();