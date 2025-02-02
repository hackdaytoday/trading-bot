import React, { useEffect, useRef } from 'react';

export const HolographicGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Grid settings
    const gridSize = 50;
    let offset = 0;

    // Animation loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vertical lines
      for (let x = offset; x < canvas.width; x += gridSize) {
        const scale = Math.sin((x + offset) * 0.01) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(74, 222, 128, ${0.1 * scale})`;
        ctx.lineWidth = scale;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = offset; y < canvas.height; y += gridSize) {
        const scale = Math.sin((y + offset) * 0.01) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(74, 222, 128, ${0.1 * scale})`;
        ctx.lineWidth = scale;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw intersection points
      for (let x = offset; x < canvas.width; x += gridSize) {
        for (let y = offset; y < canvas.height; y += gridSize) {
          const scale = Math.sin((x + y + offset) * 0.01) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.fillStyle = `rgba(74, 222, 128, ${0.3 * scale})`;
          ctx.arc(x, y, 2 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update offset for animation
      offset = (offset + 0.5) % gridSize;
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20"
      style={{ zIndex: 0 }}
    />
  );
};