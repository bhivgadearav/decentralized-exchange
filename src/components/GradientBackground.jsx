import { useEffect, useRef } from 'react';

export default function GradientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gradient lines
    const lines = [];
    const numLines = 8; // Increased number of lines

    const colors = [
      '#4F46E5', // Indigo
      '#7C3AED', // Purple
      '#EC4899', // Pink
      '#3B82F6', // Blue
      '#10B981', // Emerald
      '#6366F1', // Violet
      '#8B5CF6', // Purple
      '#F43F5E', // Rose
    ];

    for (let i = 0; i < numLines; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
        size: 150 + Math.random() * 200, // Increased size variation
        color: colors[i],
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        wobble: {
          amplitude: 0.5 + Math.random() * 0.5,
          frequency: 0.02 + Math.random() * 0.02,
          offset: Math.random() * Math.PI * 2
        }
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lines.forEach(line => {
        // Add wobble to movement
        const wobble = Math.sin(line.wobble.offset) * line.wobble.amplitude;
        line.wobble.offset += line.wobble.frequency;

        // Update position with wobble
        line.x += (Math.cos(line.angle) + wobble) * line.speed;
        line.y += (Math.sin(line.angle) + wobble) * line.speed;
        line.angle += line.rotationSpeed;

        // Bounce off edges
        if (line.x < 0 || line.x > canvas.width) line.angle = Math.PI - line.angle;
        if (line.y < 0 || line.y > canvas.height) line.angle = -line.angle;

        // Draw gradient
        const gradient = ctx.createRadialGradient(
          line.x, line.y, 0,
          line.x, line.y, line.size
        );
        gradient.addColorStop(0, `${line.color}33`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(line.x, line.y, line.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}