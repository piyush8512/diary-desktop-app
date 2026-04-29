import {
  AlignCenter,
  AlignLeft,
  Bold,
  ChevronDown,
  Image as ImageIcon,
  Italic,
  List,
  Plus,
  Sun,
  Type,
  Underline,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import type { CalendarEntry } from "./Calendar";

type DiaryDraft = {
  title: string;
  description: string;
  tags: string;
};

type DiaryWriterProps = {
  selectedDate: Date;
  selectedEntry?: CalendarEntry;
  onBack: () => void;
  onSave: (draft: Pick<DiaryDraft, "title" | "description">) => void;
};

const formatDateLabel = (date: Date) =>
  date
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

const formatDayLabel = (date: Date) =>
  date
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

const DiaryWriter = ({
  selectedDate,
  selectedEntry,
  onBack,
  onSave,
}: DiaryWriterProps) => {
  const [draft, setDraft] = useState<DiaryDraft>({
    title: "",
    description: "",
    tags: "#weekend, #pets",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft({
      title: selectedEntry?.title ?? "",
      description: selectedEntry?.description ?? "",
      tags: selectedEntry ? "#weekend, #pets" : "",
    });
  }, [selectedEntry, selectedDate]);

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [draft.description]);

  const handleSave = () => {
    onSave({
      title: draft.title,
      description: draft.description,
    });
  };

  return (
    <section className="flex-1 h-full overflow-hidden bg-[#fdfbf9]">
      <div className="flex h-full min-h-0">
        <Sidebar
          isCollapsed={false}
          isMobileOpen={true}
          onToggleCollapse={() => undefined}
          onCloseMobile={() => undefined}
          variant="diary"
          onBack={onBack}
        />

        <div className="flex-1 overflow-y-auto px-6 py-10 md:px-12">
          <div className="mx-auto max-w-200">
            {/* --- Top Header (Meta info & Actions) --- */}
            <header className="mb-10 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                {/* Date and Weather */}
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-[#9b9286]">
                  <span>{formatDateLabel(selectedDate)}</span>
                  <span className="h-1 w-1 rounded-full bg-[#d5c8b8]" />
                  <span>{formatDayLabel(selectedDate)}</span>
                  <span className="h-1 w-1 rounded-full bg-[#d5c8b8]" />
                  <span className="flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5" />
                    18°C, CLEAR
                  </span>
                </div>

                {/* Save Status & Done Button */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-[#9b9286]">
                    Saved just now
                  </span>
                  <button
                    onClick={handleSave}
                    className="rounded-full bg-[#463d34] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#342d26]"
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Mood and Tags */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 rounded-full border border-[#e5dcd2] bg-white px-3 py-1.5 shadow-sm transition hover:bg-[#f9f5f0]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#fae275]" />
                  <span className="text-xs font-semibold text-[#5a5148]">
                    Happy
                  </span>
                  <ChevronDown className="h-3 w-3 text-[#9b9286]" />
                </button>

                <button className="rounded-full border border-[#e5dcd2] bg-white px-3 py-1.5 text-xs font-semibold text-[#7d7367] shadow-sm transition hover:bg-[#f9f5f0]">
                  # weekend
                </button>
                <button className="rounded-full border border-[#e5dcd2] bg-white px-3 py-1.5 text-xs font-semibold text-[#7d7367] shadow-sm transition hover:bg-[#f9f5f0]">
                  # pets
                </button>

                <button className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-[#c5b8a9] text-[#9b9286] transition hover:border-[#7d7367] hover:text-[#7d7367]">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </header>

            {/* --- Floating Formatting Toolbar --- */}
            <div className="mx-auto mb-12 flex w-fit items-center gap-1 rounded-full border border-[#e5dcd2] bg-white p-1.5 shadow-sm">
              <div className="flex items-center gap-1 px-2">
                <button className="rounded-full p-1.5 text-[#9b9286] transition hover:bg-[#f4efe7] hover:text-[#4d4338]">
                  <Type className="h-4.5 w-4.5" />
                </button>
                <button className="rounded-full bg-[#c89868] p-1.5 text-white shadow-sm transition">
                  <Bold className="h-4.5 w-4.5" />
                </button>
                <button className="rounded-full p-1.5 text-[#9b9286] transition hover:bg-[#f4efe7] hover:text-[#4d4338]">
                  <Italic className="h-4.5 w-4.5" />
                </button>
                <button className="rounded-full p-1.5 text-[#9b9286] transition hover:bg-[#f4efe7] hover:text-[#4d4338]">
                  <Underline className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="h-4 w-px bg-[#e5dcd2]" />

              <div className="flex items-center gap-1 px-2">
                <button className="rounded-full bg-[#c89868] p-1.5 text-white shadow-sm transition">
                  <AlignLeft className="h-4.5 w-4.5" />
                </button>
                <button className="rounded-full p-1.5 text-[#9b9286] transition hover:bg-[#f4efe7] hover:text-[#4d4338]">
                  <AlignCenter className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="h-4 w-px bg-[#e5dcd2]" />

              <div className="flex items-center gap-1 px-2">
                <button className="rounded-full p-1.5 text-[#9b9286] transition hover:bg-[#f4efe7] hover:text-[#4d4338]">
                  <List className="h-4.5 w-4.5" />
                </button>
                <button className="rounded-full p-1.5 text-[#9b9286] transition hover:bg-[#f4efe7] hover:text-[#4d4338]">
                  <ImageIcon className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* --- Editor Content Area --- */}
            <article className="pb-24">
              <input
                type="text"
                value={draft.title}
                onChange={(e) =>
                  setDraft((curr) => ({ ...curr, title: e.target.value }))
                }
                placeholder="Entry Title"
                className="mb-8 w-full bg-transparent font-[Georgia,serif] text-5xl font-bold text-[#463d34] placeholder-[#c5b8a9] outline-none"
              />

              <div className="text-[#3b332b] leading-[1.8] text-[15px]">
                {/* Note: To match the image exactly, I've split the textarea 
              around an image block. In a real rich-text editor, this 
              would be mapped dynamically from a blocks array. 
            */}

                <textarea
                  ref={textareaRef}
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((curr) => ({
                      ...curr,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Start writing your day here..."
                  className="w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-[#c5b8a9]"
                  rows={3}
                />

                {/* Static Image block to match the screenshot provided */}
                {selectedEntry?.image ? (
                  <figure className="my-8">
                    <img
                      src={selectedEntry.image}
                      alt={selectedEntry.imageLabel ?? "Diary entry photo"}
                      className="h-auto max-h-100 w-full rounded-2xl object-cover shadow-sm"
                    />
                    <figcaption className="mt-3 text-center text-[13px] italic text-[#9b9286]">
                      {selectedEntry.imageLabel ??
                        "He finally caught the red frisbee mid-air!"}
                    </figcaption>
                  </figure>
                ) : (
                  <figure className="my-8">
                    <img
                      src="https://images.unsplash.com/photo-1602265261058-dd1629864273?auto=format&fit=crop&w=800&q=80"
                      alt="Dog catching frisbee"
                      className="w-full rounded-2xl object-cover shadow-sm"
                    />
                    <figcaption className="mt-3 text-center text-[13px] italic text-[#9b9286]">
                      He finally caught the red frisbee mid-air!
                    </figcaption>
                  </figure>
                )}

                <p className="mt-6">
                  We spent the whole afternoon there. He made a new friend—a
                  very energetic border collie. Watching them run through the
                  fallen leaves made me realize how much I needed this slow,
                  unplugged day.
                </p>

                <p className="mt-6">
                  On the way back, we stopped by the cafe and they gave him a
                  pup cup. He was asleep before we even pulled into the
                  driveway. Honestly, I might take a nap soon too.
                </p>
              </div>

              {/* Add Block Button */}
              <button className="mt-12 flex w-full items-center gap-4 text-[#9b9286] transition hover:text-[#7d7367]">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-[#c5b8a9]">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-[15px]">
                  Add image, quote, or block...
                </span>
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiaryWriter;
