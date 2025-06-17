
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void;
  onClose: () => void;
}

const DefaultSignatureIcon = () => (
  <svg viewBox="0 0 1024 1024" className="w-16 h-16 opacity-30" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#6B7280">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M827.733333 601.6C885.333333 529.066667 960 428.8 960 256c0-12.8-8.533333-21.333333-21.333333-21.333333s-21.333333 8.533333-21.333334 21.333333c0 142.933333-53.333333 228.266667-106.666666 296.533333-12.8-40.533333-21.333333-89.6-21.333334-147.2 0-10.666667-8.533333-21.333333-21.333333-21.333333-10.666667 0-21.333333 8.533333-21.333333 21.333333-2.133333 36.266667-12.8 76.8-21.333334 81.066667-8.533333 0-19.2-29.866667-21.333333-59.733333 0-10.666667-10.666667-19.2-21.333333-19.2s-21.333333 6.4-21.333334 19.2c-6.4 36.266667-23.466667 87.466667-42.666666 87.466666-8.533333 0-12.8-2.133333-14.933334-6.4-6.4-6.4-8.533333-21.333333-8.533333-34.133333 0-8.533333 2.133333-17.066667 2.133333-25.6 0-10.666667-8.533333-21.333333-19.2-21.333333s-21.333333 6.4-23.466666 17.066666c0 2.133333-2.133333 10.666667-2.133334 23.466667-4.266667 36.266667-17.066667 108.8-61.866666 108.8-14.933333 0-23.466667-4.266667-29.866667-14.933333-10.666667-17.066667-10.666667-44.8 0-70.4v-2.133334c2.133333-2.133333 2.133333-6.4 4.266667-8.533333 17.066667-34.133333 36.266667-53.333333 68.266666-53.333333 12.8 0 21.333333-8.533333 21.333334-21.333334s-8.533333-21.333333-21.333334-21.333333c-89.6 0-115.2 87.466667-140.8 170.666667-29.866667 102.4-57.6 170.666667-136.533333 170.666666-108.8 0-149.333333-140.8-149.333333-234.666666 0-183.466667 100.266667-298.666667 192-298.666667 61.866667 0 85.333333 49.066667 87.466666 51.2 4.266667 10.666667 17.066667 14.933333 27.733334 10.666667 10.666667-4.266667 14.933333-17.066667 10.666666-27.733334-2.133333-4.266667-36.266667-76.8-125.866666-76.8C183.466667 149.333333 64 277.333333 64 490.666667c0 219.733333 125.866667 277.333333 192 277.333333 108.8 0 145.066667-96 172.8-181.333333 14.933333 19.2 36.266667 32 61.866667 32 46.933333 0 74.666667-34.133333 89.6-76.8 10.666667 8.533333 23.466667 12.8 38.4 12.8 29.866667 0 51.2-25.6 64-51.2 8.533333 14.933333 23.466667 25.6 42.666666 25.6 12.8 0 23.466667-6.4 32-14.933334 6.4 29.866667 14.933333 57.6 21.333334 81.066667-29.866667 38.4-53.333333 70.4-53.333334 108.8 0 36.266667 27.733333 64 64 64 38.4 0 64-34.133333 64-64 0-27.733333-10.666667-57.6-23.466666-91.733333 0-4.266667-2.133333-6.4-2.133334-10.666667zM789.333333 725.333333c-14.933333 0-21.333333-10.666667-21.333333-21.333333 0-19.2 10.666667-38.4 27.733333-61.866667 8.533333 25.6 14.933333 44.8 14.933334 61.866667 0 6.4-6.4 21.333333-21.333334 21.333333z" fill="#6B7280"></path>
    </g>
  </svg>
);

export const SignaturePad = ({ onSignatureChange, onClose }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Array<{x: number, y: number}>>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width) / window.devicePixelRatio,
      y: (clientY - rect.top) * (canvas.height / rect.height) / window.devicePixelRatio
    };
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, points: Array<{x: number, y: number}>) => {
    if (points.length < 2) {
      if (points.length === 1) {
        const point = points[0];
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
      }
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 2; i++) {
      const c = (points[i].x + points[i + 1].x) / 2;
      const d = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }

    if (points.length > 2) {
      ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        points[points.length - 1].x,
        points[points.length - 1].y
      );
    } else {
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    }

    ctx.stroke();
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setIsDrawing(true);
    const pos = getPosition(event);
    setPoints([pos]);
    setHasDrawn(true);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getPosition(event);
    const newPoints = [...points, pos];
    setPoints(newPoints);

    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';

    drawCurve(ctx, newPoints);
  };

  const stopDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to image data URL
    const imageData = canvas.toDataURL('image/png');
    onSignatureChange(imageData);
    setPoints([]);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    setHasDrawn(false);
    setPoints([]);
    onSignatureChange(null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-white/30">
      <div className="relative">
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <DefaultSignatureIcon />
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="w-full h-24 bg-transparent cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearSignature}
          className="text-xs h-6 px-2"
        >
          Clear
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="text-xs h-6 px-2"
        >
          Done
        </Button>
      </div>
    </div>
  );
};
