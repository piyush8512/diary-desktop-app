import {
  X,
  Plus,
  Trash2,
  Maximize2,
  RotateCw,
  Pin,
  Pen,
  Sticker,
  Star,
  CornerDownLeft,
  MapPin,
  Sun,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

export type PolaroidItem = {
  id: string;
  type: "polaroid";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  imageUrl: string;
  caption: string;
  tapeColor?: "pink" | "green" | "blue";
};

export type TextBubbleItem = {
  id: string;
  type: "textBubble";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  content: string;
  authorName: string;
  authorAvatarColor: string; // Tailwind color class, e.g., 'bg-sky-400'
};

export type StickerItem = {
  id: string;
  type: "sticker";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  content: string; // Emoji character
};

export type ScrapbookItem = PolaroidItem | TextBubbleItem | StickerItem;

type MoodScrapbookProps = {
  isOpen: boolean;
  onClose: () => void;
  moodName: string;
  moodEmoji: string;
  onSave: (items: ScrapbookItem[]) => void;
  initialItems?: ScrapbookItem[];
};

const DOTTED_GRID_SIZE = 24;

// --- User Presence Data (Mock) ---
const USERS = [
  { name: "Sam", avatarColor: "bg-[#d4e9d7]", textColor: "text-[#6c8270]" },
  { name: "Alex", avatarColor: "bg-[#fce7f3]", textColor: "text-[#f472b6]" },
  { name: "You", avatarColor: "bg-[#e5dcd2]", textColor: "text-[#8c7e6d]" },
];

const MoodScrapbook = ({
  isOpen,
  onClose,
  moodName,
  moodEmoji,
  onSave,
  initialItems = [],
}: MoodScrapbookProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<ScrapbookItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10); // Interaction states
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null); // Offsets and positions
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startRect, setStartRect] = useState({ width: 0, height: 0 });

  const updateItem = useCallback(
    (id: string, updates: Partial<ScrapbookItem>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? ({ ...item, ...updates } as ScrapbookItem) : item,
        ),
      );
    },
    [],
  );

  const bringToFront = (id: string) => {
    setMaxZIndex((prev) => prev + 1);
    updateItem(id, { zIndex: maxZIndex + 1 });
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  }; // --- Add Elements ---

  const addTextBubble = () => {
    const user = USERS[Math.floor(Math.random() * USERS.length)];
    const newItem: TextBubbleItem = {
      id: `textBubble-${Date.now()}`,
      type: "textBubble",
      x: 200,
      y: 150,
      width: 400,
      height: 120,
      rotation: Math.floor(Math.random() * 10) - 5,
      zIndex: maxZIndex + 1,
      content:
        "Start writing your story here... add thoughts, memories, or just doodle with words.",
      authorName: user.name,
      authorAvatarColor: user.avatarColor,
    };
    setMaxZIndex((prev) => prev + 1);
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const addTextBox = addTextBubble;

  const addPolaroid = () => {
    const imageUrl = window.prompt("Paste an image URL:");
    if (!imageUrl) return;

    const newItem: PolaroidItem = {
      id: `polaroid-${Date.now()}`,
      type: "polaroid",
      x: 300,
      y: 300,
      width: 220,
      height: 280,
      rotation: Math.floor(Math.random() * 20) - 10,
      zIndex: maxZIndex + 1,
      imageUrl: imageUrl,
      caption: "A cozy corner ✨",
      tapeColor: (["pink", "green", "blue"] as const)[
        Math.floor(Math.random() * 3)
      ],
    };
    setMaxZIndex((prev) => prev + 1);
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const addSticker = (emoji: string) => {
    const newItem: StickerItem = {
      id: `sticker-${Date.now()}`,
      type: "sticker",
      x: 400,
      y: 400,
      width: 100,
      height: 100,
      rotation: Math.floor(Math.random() * 30) - 15,
      zIndex: maxZIndex + 1,
      content: emoji,
    };
    setMaxZIndex((prev) => prev + 1);
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  }; // --- Mouse Handlers ---

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    setSelectedId(itemId);
    bringToFront(itemId);
    setDraggingId(itemId);
    setDragOffset({
      x: e.clientX - item.x,
      y: e.clientY - item.y,
    });
  };

  const handleResizeStart = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    setResizingId(itemId);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartRect({ width: item.width, height: item.height });
  };

  const handleRotateStart = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    setRotatingId(itemId);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggingId && canvasRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        updateItem(draggingId, { x: newX, y: newY });
      }

      if (resizingId) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        updateItem(resizingId, {
          width: Math.max(100, startRect.width + dx),
          height: Math.max(50, startRect.height + dy),
        });
      }

      if (rotatingId && canvasRef.current) {
        const item = items.find((i) => i.id === rotatingId);
        if (!item) return;
        const itemCenterX = item.x + item.width / 2;
        const itemCenterY = item.y + item.height / 2;
        const angle = Math.atan2(
          e.clientY - itemCenterY,
          e.clientX - itemCenterX,
        );
        const degrees = (angle * 180) / Math.PI;
        updateItem(rotatingId, { rotation: degrees + 90 }); // Offset by 90 for a vertical handle
      }
    },
    [
      draggingId,
      resizingId,
      rotatingId,
      dragOffset,
      startPos,
      startRect,
      items,
      updateItem,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setDraggingId(null);
    setResizingId(null);
    setRotatingId(null);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/40 p-4">
           {" "}
      <div className="relative flex h-full w-full max-w-350 flex-col overflow-hidden rounded-4xl border border-[#e5dcd2] bg-[#fbf9f6] shadow-2xl">
                        {/* Collaborative Presence Bar & Done Button */}
        <div className="absolute top-6 right-6 z-50 flex items-center gap-4 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full border border-white/50 shadow-sm">
          <div className="flex items-center -space-x-3">
            {USERS.map((user) => (
              <div
                key={user.name}
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 border-white ${user.avatarColor} shadow-sm`}
                title={user.name}
              >
                <span className={`text-xs font-bold ${user.textColor}`}>
                  {user.name[0]}
                </span>
              </div>
            ))}
            <div
              className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-white bg-neutral-100 shadow-sm"
              title="Saved just now"
            >
              <span className="text-[10px] font-medium text-[#9b9286]">
                just now
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#9b9286]">
            <Sun className="h-4 w-4" />
            Saved 1m ago
          </div>
          <div className="h-8 w-px bg-[#e5dcd2]"></div>           {" "}
          <button
            onClick={() => {
              onSave(items);
              onClose();
            }}
            className="rounded-full bg-[#4d4338] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#3f372f] shadow-sm"
          >
                          Done            {" "}
          </button>
                     {" "}
          <button
            onClick={onClose}
            className="rounded-full bg-white p-2 text-[#9b9286] hover:bg-neutral-100/50 hover:text-[#4d4338] border border-[#e5dcd2]"
          >
                          <X className="h-5 w-5" />           {" "}
          </button>
        </div>
                {/* Dotted Canvas Area */}       {" "}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => setSelectedId(null)}
          className="relative flex-1 h-full w-full overflow-hidden rounded-4xl bg-[#fdfcf9]"
          style={{
            backgroundImage: `radial-gradient(circle, #dacfc0 1px, transparent 1px)`,
            backgroundSize: `${DOTTED_GRID_SIZE}px ${DOTTED_GRID_SIZE}px`,
          }}
        >
                    {/* Fixed Title & Labels at top-left */}         {" "}
          <div className="absolute top-10 left-10 z-10 space-y-2 pointer-events-none">
            {/* Marker-like Highlight */}
            <div className="w-fit">
              <span className="block h-2 rounded bg-pink-100 mb-1"></span>     
                       {" "}
              <h1 className="text-3xl font-bold text-[#4d4338] font-serif">
                Cafe Hopping Sunday ☕
              </h1>
            </div>
                           {" "}
            <div className="flex items-center gap-2">
                               {" "}
              <span className="flex items-center gap-1 rounded-full bg-[#fff8f2] px-2 py-0.5 text-xs font-medium text-[#c89868] border border-[#f0e8df]">
                <Star className="h-3.5 w-3.5" />
                Cafe Hop
              </span>
                               {" "}
              <span className="flex items-center gap-1 rounded-full bg-[#fdf6f7] px-2 py-0.5 text-xs font-medium text-[#f472b6] border border-[#fdf0f0]">
                <MapPin className="h-3.5 w-3.5" />
                Weekend
              </span>
                             {" "}
            </div>
                     {" "}
          </div>
          {/* Right Sidebar Toolbar (Pill shape) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 rounded-full border border-[#f0e8df] bg-white p-2.5 shadow-lg">
            <button
              onClick={addTextBox}
              className="flex flex-col items-center justify-center h-12 w-12 rounded-full p-2 text-[#dacfc0] hover:bg-neutral-100/50 hover:text-[#4d4338] transition-all"
              title="Add Text Bubble"
            >
              <Pin className="h-5 w-5" />
            </button>
            <button
              onClick={addPolaroid}
              className="flex flex-col items-center justify-center h-12 w-12 rounded-full p-2 text-[#dacfc0] hover:bg-neutral-100/50 hover:text-[#4d4338] transition-all"
              title="Add Polaroid Image"
            >
              <Pen className="h-5 w-5" />
            </button>
            <div className="h-px w-8 bg-[#f0e8df] my-1"></div>
            <button
              onClick={() => addSticker("🌱")}
              className="flex flex-col items-center justify-center h-12 w-12 rounded-full p-2 text-[#dacfc0] hover:bg-neutral-100/50 hover:text-[#4d4338] transition-all"
              title="Add Zen Sprout Sticker"
            >
              <Sticker className="h-5 w-5" />
            </button>
            <button
              onClick={() => addSticker("✨")}
              className="flex flex-col items-center justify-center h-12 w-12 rounded-full p-2 text-[#dacfc0] hover:bg-neutral-100/50 hover:text-[#4d4338] transition-all"
              title="Add Sparkles Sticker"
            >
              <Star className="h-5 w-5" />
            </button>
          </div>
          {/* Floating Elements Loop */}         {" "}
          {items.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <div
                key={item.id}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
                style={{
                  position: "absolute",
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                  transform: `rotate(${item.rotation}deg) ${isSelected ? "scale(1.03)" : "scale(1)"}`,
                  cursor: draggingId === item.id ? "grabbing" : "grab",
                  zIndex: isSelected ? maxZIndex + 1 : item.zIndex,
                  transition:
                    resizingId || rotatingId
                      ? "none"
                      : "transform 100ms ease, box-shadow 150ms ease",
                }}
                className={`rounded-lg group ${
                  isSelected
                    ? "shadow-[0_8px_30px_rgba(206,177,152,0.12)] ring-2 ring-[#dacfc0] ring-offset-1"
                    : "hover:ring-1 hover:ring-[#dacfc0] hover:ring-offset-1"
                }`}
              >
                                  {/* TEXT BUBBLE (Matches image bubble) */}   
                             {" "}
                {item.type === "textBubble" && (
                  <div className="relative w-full h-full bg-white/95 backdrop-blur-sm px-6 py-5 rounded-[28px] shadow-[0_4px_18px_rgba(77,67,56,0.04)] border border-[#f0e8df]">
                    {/* Tags associated with bubble */}
                    <div className="absolute -top-3.5 left-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#f0e8df] text-sm text-[#4d4338] shadow-sm">
                      ☕
                    </div>
                    <div
                      className={`absolute -bottom-3 left-10 flex h-6 items-center justify-center gap-1 rounded-full px-2.5 text-[11px] font-medium ${item.authorAvatarColor} ${USERS.find((u) => u.name === item.authorName)?.textColor} shadow-sm border border-white/50`}
                    >
                      {item.authorName}
                    </div>
                    {/* Editable Content */}                   {" "}
                    <div
                      className="w-full h-full bg-transparent text-[15px] leading-[1.8] text-[#4d4338] outline-none font-medium"
                      style={{
                        fontFamily: "Georgia, serif",
                        caretColor: "#4d4338",
                      }}
                      contentEditable={isSelected}
                      suppressContentEditableWarning
                      onInput={(e) => {
                        updateItem(item.id, {
                          content: e.currentTarget.textContent || "",
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                                            {item.content}                 
                       {" "}
                    </div>
                  </div>
                )}
                                  {/* POLAROID (Matches image grouped style) */}
                                 {" "}
                {item.type === "polaroid" && (
                  <div className="relative w-full h-full p-3 pb-10 bg-white rounded-lg shadow-[0_6px_25px_rgba(77,67,56,0.06)] border border-[#f0e8df] flex flex-col gap-3 group">
                    {/* Polaroid Highlight/Tape */}
                    {item.tapeColor && (
                      <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 h-6 rounded-md w-1/3 shadow-inner ${
                          item.tapeColor === "pink"
                            ? "bg-[#fce7f3]"
                            : item.tapeColor === "green"
                              ? "bg-[#dce8df]"
                              : "bg-[#e0f2fe]"
                        }`}
                      ></div>
                    )}

                    {/* Image area */}
                    <div className="w-full h-full flex-1 overflow-hidden rounded bg-[#dacfc0]">
                      <img
                        src={item.imageUrl}
                        alt="Scrapbook Polaroid"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {/* Caption area */}
                    <div
                      className="text-center text-[13px] font-medium text-[#4d4338] outline-none min-h-[1.5em]"
                      contentEditable={isSelected}
                      suppressContentEditableWarning
                      style={{ fontFamily: "system-ui, sans-serif" }}
                      onInput={(e) => {
                        updateItem(item.id, {
                          caption: e.currentTarget.textContent || "",
                        });
                      }}
                    >
                      {item.caption || "Add a caption..."}🍵
                    </div>
                  </div>
                )}
                                 {" "}
                {/* STICKER (Matches Zen sprout / sparkles style) */}           
                     {" "}
                {item.type === "sticker" && (
                  <div
                    className={`w-full h-full flex items-center justify-center p-2 rounded-xl text-center font-bold text-6xl drop-shadow-md select-none`}
                    onClick={(e) => e.stopPropagation()}
                  >
                                          {item.content}                   {" "}
                  </div>
                )}
                {/* Selection controls (Delete, Resize, Rotate) */}
                {isSelected && (
                  <>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="absolute -top-3 -right-3 rounded-full bg-white p-1 border border-[#e5dcd2] text-red-500 shadow-md transition-all hover:bg-red-50 group z-20"
                      title="Delete Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onMouseDown={(e) => handleResizeStart(e, item.id)}
                      className="absolute -bottom-3 -right-3 rounded-full bg-white p-1 border border-[#e5dcd2] text-[#dacfc0] shadow-md transition-all hover:text-[#4d4338] z-20"
                      style={{ cursor: "nwse-resize" }}
                      title="Resize Item"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                    <button
                      onMouseDown={(e) => handleRotateStart(e, item.id)}
                      className="absolute -bottom-3 -left-3 rounded-full bg-white p-1 border border-[#e5dcd2] text-[#dacfc0] shadow-md transition-all hover:text-[#4d4338] z-20"
                      style={{ cursor: "ns-resize" }}
                      title="Rotate Item"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                  </>
                )}
                               {" "}
              </div>
            );
          })}
          {/* Thought/Quote input box placed centrally at the bottom */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg z-30">
            <div className="relative group">
              <input
                type="text"
                placeholder="Add a thought..."
                className="w-full px-6 py-3 rounded-full border border-[#f0e8df] bg-white shadow-[0_4px_12px_rgba(77,67,56,0.02)] font-medium text-[13px] text-[#4d4338] placeholder:text-[#dacfc0] outline-none transition-all group-focus-within:border-[#dacfc0] group-focus-within:shadow-[0_4px_18px_rgba(77,67,56,0.04)]"
              />
              <button className="absolute top-1/2 -translate-y-1/2 right-1.5 rounded-full bg-[#4d4338] p-2 text-[#dacfc0] hover:bg-[#3f372f]">
                <CornerDownLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
                   {" "}
        </div>
               {" "}
      </div>
           {" "}
    </div>
  );
};

export default MoodScrapbook;
