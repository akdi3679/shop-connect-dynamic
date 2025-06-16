
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void;
  onClose: () => void;
}

export const SignaturePad = ({ onSignatureChange, onClose }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Array<{x: number, y: number}>>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 300;
    canvas.height = 100;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, points: Array<{x: number, y: number}>) => {
    if (points.length < 3) {
      if (points.length > 0) {
        const b = points[0];
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1, 0, Math.PI * 2, true);
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

    ctx.quadraticCurveTo(
      points[points.length - 2].x,
      points[points.length - 2].y,
      points[points.length - 1].x,
      points[points.length - 1].y
    );

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    drawCurve(ctx, newPoints);
  };

  const stopDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    drawCurve(ctx, points);
    
    // Convert canvas to image data URL
    const imageData = canvas.toDataURL();
    onSignatureChange(imageData);
    setPoints([]);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-white/30">
      <div className="text-xs text-gray-600 mb-2 text-center">Draw your signature below</div>
      
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded bg-white touch-none w-full"
        style={{ height: '100px' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      />
      
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
