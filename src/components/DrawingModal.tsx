import {
  Eraser,
  X,
  RotateCcw,
  Download,
  Check,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DrawingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (drawingData: string) => void;
  initialDrawing?: string;
};

const DrawingModal = ({
  isOpen,
  onClose,
  onSave,
  initialDrawing,
}: DrawingModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#4d4338");
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  // Initialize canvas with stored drawing
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load existing drawing if available
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialDrawing;
    }
  }, [isOpen, initialDrawing]);

  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement>,
  ): [number, number] => {
    if (!canvasRef.current) return [0, 0];
    const rect = canvasRef.current.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const [x, y] = getCanvasCoords(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const [x, y] = getCanvasCoords(e);
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (tool === "eraser") {
      ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const drawingData = canvasRef.current.toDataURL("image/png");
      onSave(drawingData);
      onClose();
    }
  };

  const downloadDrawing = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = `mood-drawing-${new Date().toISOString().split("T")[0]}.png`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex max-h-[90vh] w-[90vw] max-w-4xl flex-col rounded-2xl border border-[#ddd3c7] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5dcd2] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#4d4338]">
            Mood Drawing Board
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#9b9286] hover:bg-[#f4efe7] hover:text-[#4d4338]"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 gap-4 overflow-hidden p-4">
          {/* Canvas */}
          <div className="flex-1 flex flex-col">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="flex-1 cursor-crosshair rounded-lg border border-[#eddccf] bg-white"
            />
          </div>

          {/* Tools Panel */}
          <div className="w-56 space-y-4 rounded-lg border border-[#eddccf] bg-[#fdfbf9] p-4">
            {/* Tool Selection */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-[#9b9286]">
                Tool
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTool("pen")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    tool === "pen"
                      ? "bg-[#c89868] text-white"
                      : "border border-[#e5dcd2] text-[#7b6a5b] hover:bg-white"
                  }`}
                  type="button"
                >
                  ✏️ Pen
                </button>
                <button
                  onClick={() => setTool("eraser")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    tool === "eraser"
                      ? "bg-[#c89868] text-white"
                      : "border border-[#e5dcd2] text-[#7b6a5b] hover:bg-white"
                  }`}
                  type="button"
                >
                  <Eraser className="inline h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Color Picker (only for pen) */}
            {tool === "pen" && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-[#9b9286]">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "#4d4338",
                    "#c89868",
                    "#d9534f",
                    "#5cb85c",
                    "#0275d8",
                    "#5e5e5e",
                    "#9b4d0c",
                    "#d7c5b0",
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-lg border-2 transition ${
                        color === c
                          ? "border-[#4d4338]"
                          : "border-transparent hover:border-[#ddd3c7]"
                      }`}
                      style={{ backgroundColor: c }}
                      type="button"
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Brush Size */}
            <div>
              <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase text-[#9b9286]">
                <span>Brush Size</span>
                <span className="rounded-full bg-[#c89868] px-2 py-1 text-white">
                  {brushSize}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-[#c89868]"
              />
            </div>

            {/* Clear Button */}
            <button
              onClick={clearCanvas}
              className="w-full rounded-lg border border-[#e5dcd2] bg-white px-4 py-2 text-xs font-medium text-[#7b6a5b] transition hover:bg-[#f4efe7]"
              type="button"
            >
              <RotateCcw className="mb-1 inline h-4 w-4" /> Clear
            </button>

            {/* Download Button */}
            <button
              onClick={downloadDrawing}
              className="w-full rounded-lg border border-[#e5dcd2] bg-white px-4 py-2 text-xs font-medium text-[#7b6a5b] transition hover:bg-[#f4efe7]"
              type="button"
            >
              <Download className="mb-1 inline h-4 w-4" /> Download
            </button>

            {/* Divider */}
            <div className="border-t border-[#e5dcd2]" />

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full rounded-lg bg-[#c89868] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#b0825a]"
              type="button"
            >
              <Check className="mb-1 inline h-4 w-4" /> Add to Diary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingModal;
