import { ChevronUp, Plus } from "lucide-react";
import { useState } from "react";

type MoodBoardProps = {
  moodDrawing: string | null;
  onExpandClick: () => void;
  onRemove?: () => void;
};

const MoodBoard = ({
  moodDrawing,
  onExpandClick,
  onRemove,
}: MoodBoardProps) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative flex h-full w-56 flex-col rounded-2xl border border-[#eddccf] bg-linear-to-b from-[#fdfbf9] to-[#f9f5f0] p-4 shadow-sm"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#9b9286]">
          Mood Board
        </h3>
        <button
          onClick={onExpandClick}
          className="rounded-full p-1 text-[#9b9286] transition hover:bg-white hover:text-[#c89868]"
          type="button"
          title="Expand drawing board"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      {/* Drawing Preview or Empty State */}
      <div className="flex-1 rounded-lg border border-dashed border-[#ead9ca] bg-white/60 overflow-hidden flex flex-col items-center justify-center">
        {moodDrawing ? (
          <div className="relative w-full h-full">
            <img
              src={moodDrawing}
              alt="Mood drawing"
              className="w-full h-full object-cover rounded"
            />
            {hovering && onRemove && (
              <button
                onClick={onRemove}
                className="absolute top-1 right-1 rounded-full bg-red-500/80 p-1 text-white hover:bg-red-600 transition"
                type="button"
                title="Remove drawing"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="rounded-full bg-[#f5e7d7] p-3">
              <Plus className="h-5 w-5 text-[#9b9286]" />
            </div>
            <p className="text-xs text-[#9b9286]">
              Draw your mood, feeling, or inspiration
            </p>
          </div>
        )}
      </div>

      {/* Footer Button */}
      <button
        onClick={onExpandClick}
        className="mt-3 w-full rounded-lg bg-[#c89868] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#b0825a] active:scale-95"
        type="button"
      >
        {moodDrawing ? "Edit" : "Start"} Drawing
      </button>
    </div>
  );
};

export default MoodBoard;
