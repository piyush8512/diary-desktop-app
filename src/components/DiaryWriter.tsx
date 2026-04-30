import {
  AlignCenter,
  AlignLeft,
  Bold,
  Image as ImageIcon,
  Italic,
  List,
  Plus,
  Sun,
  Type,
  Underline,
  Play,
  Maximize2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
} from "react";
import Sidebar from "./Sidebar";
import DrawingModal from "./DrawingModal";
import MoodScrapbook from "./MoodScrapbook";
import type { CalendarEntry } from "../types/calendar";
import type { ScrapbookItem } from "./MoodScrapbook";

type DiaryDraft = {
  title: string;
  description: string;
  tags: string;
};

type DiaryWriterProps = {
  selectedDate: Date;
  selectedEntry?: CalendarEntry;
  onBack: () => void;
  onSave: (
    draft: Pick<DiaryDraft, "title" | "description"> & {
      moodDrawing?: string | null;
    },
  ) => void | Promise<void>;
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

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const calculateStats = (html: string) => {
  const text = stripHtml(html);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    readingTime,
    characters: text.length,
  };
};

const isCommandActive = (command: string) => {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
};

// Available fonts for the user to choose
const FONTS = [
  { name: "Classic Serif", value: "Georgia, serif" },
  { name: "Clean Sans", value: "system-ui, sans-serif" },
  { name: "Typewriter", value: "'Courier New', Courier, monospace" },
  { name: "Handwritten", value: "'Comic Sans MS', cursive, sans-serif" },
];

const DiaryWriter = ({
  selectedDate,
  selectedEntry,
  onBack,
  onSave,
}: DiaryWriterProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<DiaryDraft>({
    title: "",
    description: "",
    tags: "#weekend, #pets",
  });

  // State for the selected font
  const [currentFont, setCurrentFont] = useState(FONTS[0].value);

  // State for mood drawing
  const [moodDrawing, setMoodDrawing] = useState<string | null>(null);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);

  // State for mood scrapbooks
  const [activeMood, setActiveMood] = useState<{
    name: string;
    emoji: string;
    color: string;
  } | null>(null);
  const [isMoodScrapbookOpen, setIsMoodScrapbookOpen] = useState(false);
  const [moodScrapbooks, setMoodScrapbooks] = useState<{
    [key: string]: ScrapbookItem[];
  }>({});

  const [isSaving, setIsSaving] = useState(false);
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left" as "left" | "center",
    list: false,
  });

  const stats = useMemo(
    () => calculateStats(draft.description),
    [draft.description],
  );

  useEffect(() => {
    const entryDescription = selectedEntry?.description ?? "";
    setDraft({
      title: selectedEntry?.title ?? "",
      description: entryDescription,
      tags: selectedEntry ? "#weekend, #pets" : "",
    });
    setMoodDrawing(selectedEntry?.moodDrawing ?? null);

    if (editorRef.current) {
      editorRef.current.innerHTML = entryDescription;
    }
  }, [selectedEntry, selectedDate]);

  const syncFormattingState = () => {
    setFormatting({
      bold: isCommandActive("bold"),
      italic: isCommandActive("italic"),
      underline: isCommandActive("underline"),
      align: document.queryCommandState("justifyCenter") ? "center" : "left",
      list:
        isCommandActive("insertUnorderedList") ||
        isCommandActive("insertOrderedList"),
    });
  };

  const handleEditorInput = () => {
    const html = editorRef.current?.innerHTML ?? "";
    setDraft((current) => ({
      ...current,
      description: html,
    }));
    syncFormattingState();
  };

  const applyCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
    syncFormattingState();
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    handleEditorInput();
  };

  const handleAddImage = () => {
    const imageUrl = window.prompt(
      "Paste an image URL to insert into the diary page.",
    );
    if (!imageUrl) {
      return;
    }

    editorRef.current?.focus();
    document.execCommand("insertImage", false, imageUrl);
    handleEditorInput();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title: draft.title,
        description: draft.description,
        moodDrawing,
      } as any);
    } finally {
      setIsSaving(false);
    }
  };

  const toolbarButtonClass = (active: boolean) =>
    [
      "rounded-xl p-2.5 transition flex items-center justify-center",
      active
        ? "bg-[#c89868] text-white shadow-sm"
        : "text-[#9b9286] hover:bg-[#f4efe7] hover:text-[#4d4338]",
    ].join(" ");

  return (
    <>
      <DrawingModal
        isOpen={isDrawingModalOpen}
        onClose={() => setIsDrawingModalOpen(false)}
        onSave={setMoodDrawing}
        initialDrawing={moodDrawing || undefined}
      />

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

          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10 relative">
            <div className="mx-auto max-w-[1200px]">
              {/* --- Header Content --- */}
              <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#9b9286]">
                    <span>{formatDateLabel(selectedDate)}</span>
                    <span className="h-1 w-1 rounded-full bg-[#d5c8b8]" />
                    <span>{formatDayLabel(selectedDate)}</span>
                    <span className="h-1 w-1 rounded-full bg-[#d5c8b8]" />
                    <span className="flex items-center gap-1.5">
                      <Sun className="h-3.5 w-3.5" />
                      18°C, CLEAR
                    </span>
                  </div>

                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Give today a title..."
                    style={{ fontFamily: currentFont }}
                    className="w-full bg-transparent text-3xl font-semibold text-[#4d4338] placeholder:text-[#c5b8a9] outline-none md:text-5xl"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <span className="text-xs font-medium text-[#9b9286]">
                    {isSaving ? "Saving..." : "Draft"}
                  </span>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-full bg-[#463d34] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#342d26] disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                  >
                    {isSaving ? "Saving..." : "Done"}
                  </button>
                </div>
              </header>

              <div className="mb-8 flex flex-wrap items-center gap-2">
                {["Travel", "Cozy", "Reflect", "Joy", "Dream", "Memory"].map(
                  (tag) => (
                    <button
                      key={tag}
                      className="rounded-full bg-[#f5e7d7] px-3 py-1.5 text-xs font-medium text-[#7b6a5b] transition hover:bg-[#ebdcc8]"
                      type="button"
                    >
                      {tag}
                    </button>
                  ),
                )}
              </div>

              {/* --- 3-Column Grid for Editor space --- */}
              <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
                {/* --- LEFT: Vertical Toolbar --- */}
                <div className="sticky top-6 flex flex-col items-center gap-2 rounded-[20px] border border-[#e5dcd2] bg-white p-2 shadow-sm shrink-0">
                  {/* Font Selector (Icon triggers hidden native select) */}
                  <div className="relative flex items-center justify-center h-10 w-10 text-[#9b9286] hover:bg-[#f4efe7] hover:text-[#4d4338] rounded-xl transition">
                    <span className="font-serif text-lg font-bold">Aa</span>
                    <select
                      value={currentFont}
                      onChange={(e) => setCurrentFont(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Change Font"
                    >
                      {FONTS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-6 h-px bg-[#e5dcd2] my-1" />

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => applyCommand("formatBlock", "p")}
                      className={toolbarButtonClass(false)}
                      title="Text"
                      type="button"
                    >
                      <Type className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => applyCommand("bold")}
                      className={toolbarButtonClass(formatting.bold)}
                      title="Bold (Ctrl+B)"
                      type="button"
                    >
                      <Bold className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => applyCommand("italic")}
                      className={toolbarButtonClass(formatting.italic)}
                      title="Italic (Ctrl+I)"
                      type="button"
                    >
                      <Italic className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => applyCommand("underline")}
                      className={toolbarButtonClass(formatting.underline)}
                      title="Underline (Ctrl+U)"
                      type="button"
                    >
                      <Underline className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="w-6 h-px bg-[#e5dcd2] my-1" />

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => applyCommand("justifyLeft")}
                      className={toolbarButtonClass(
                        formatting.align === "left",
                      )}
                      title="Align left"
                      type="button"
                    >
                      <AlignLeft className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => applyCommand("justifyCenter")}
                      className={toolbarButtonClass(
                        formatting.align === "center",
                      )}
                      title="Align center"
                      type="button"
                    >
                      <AlignCenter className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="w-6 h-px bg-[#e5dcd2] my-1" />

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => applyCommand("insertUnorderedList")}
                      className={toolbarButtonClass(formatting.list)}
                      title="Bullet list"
                      type="button"
                    >
                      <List className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={handleAddImage}
                      className="rounded-xl p-2.5 text-[#9b9286] transition hover:bg-[#f4efe7] hover:text-[#4d4338] flex items-center justify-center"
                      title="Add image"
                      type="button"
                    >
                      <ImageIcon className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* --- CENTER: Editor Content --- */}
                <article className="flex-1 rounded-4xl border border-[#eddccf] bg-[#fffdfb] p-4 shadow-[0_25px_70px_rgba(206,177,152,0.14)] md:p-8 w-full max-w-full overflow-hidden">
                  <div className="rounded-[1.6rem] border border-dashed border-[#ead9ca] bg-white/60 p-4 md:p-8">
                    <div className="relative rounded-[1.25rem] bg-[linear-gradient(to_bottom,#fffefc_0%,#fffefc_100%)] p-2">
                      {!draft.description && (
                        <div className="pointer-events-none absolute left-2 top-2 text-[15px] italic text-[#c5b8a9] z-20">
                          Remember how the rain looked against the neon lights?
                          Start writing your memory...
                        </div>
                      )}

                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleEditorInput}
                        onKeyUp={syncFormattingState}
                        onMouseUp={syncFormattingState}
                        onBlur={syncFormattingState}
                        onPaste={handlePaste}
                        className="relative z-10 min-h-[300px] whitespace-pre-wrap break-words bg-transparent text-[15px] leading-9.5 text-[#3b332b] outline-none"
                        style={{
                          fontFamily: currentFont,
                          caretColor: "#c89868",
                          backgroundImage:
                            "repeating-linear-gradient(transparent, transparent 37px, #ead9ca 37px, #ead9ca 38px)",
                          backgroundSize: "100% 38px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    {selectedEntry?.image ? (
                      <figure className="max-w-[16rem]">
                        <img
                          src={selectedEntry.image}
                          alt={selectedEntry.imageLabel ?? "Diary entry photo"}
                          className="h-auto w-full rounded-2xl object-cover shadow-sm"
                        />
                        <figcaption className="mt-3 text-center text-[13px] italic text-[#9b9286]">
                          {selectedEntry.imageLabel ??
                            "A captured moment from the day"}
                        </figcaption>
                      </figure>
                    ) : (
                      <div className="rounded-2xl border border-[#eddccf] bg-[#fff8f0] px-4 py-3 text-sm text-[#8a7f72] max-w-[20rem]">
                        Add an image block from the toolbar to make this page
                        feel more like a real diary spread.
                      </div>
                    )}

                    <div className="text-right text-xs font-semibold uppercase tracking-widest text-[#9b9286]">
                      <div>{stats.words} words</div>
                      <div className="mt-1">{stats.readingTime} min read</div>
                      <div className="mt-1">{stats.characters} chars</div>
                    </div>
                  </div>

                  <button
                    className="mt-8 flex w-full items-center gap-4 text-[#9b9286] transition hover:text-[#7d7367]"
                    type="button"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-[#c5b8a9]">
                      <Plus className="h-4 w-4" />
                    </div>
                    <span className="text-[15px]">
                      Add image, quote, or block...
                    </span>
                  </button>
                </article>

                {/* --- RIGHT: Side Widgets --- */}
                <aside className="hidden xl:flex w-[280px] shrink-0 flex-col gap-5 sticky top-6">
                  {/* Mood Scrapbook Modal */}
                  <MoodScrapbook
                    isOpen={isMoodScrapbookOpen}
                    onClose={() => setIsMoodScrapbookOpen(false)}
                    moodName={activeMood?.name || "Mood"}
                    moodEmoji={activeMood?.emoji || "😊"}
                    moodColor={activeMood?.color || "#fce7f3"}
                    initialItems={
                      activeMood ? moodScrapbooks[activeMood.name] || [] : []
                    }
                    onSave={(items) => {
                      if (activeMood) {
                        setMoodScrapbooks({
                          ...moodScrapbooks,
                          [activeMood.name]: items,
                        });
                      }
                    }}
                  />

                  {/* Memory Widget */}
                  <div className="rounded-[24px] border border-[#fdf2f8] bg-gradient-to-b from-[#fff5f8] to-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-[15px] font-medium text-[#f472b6]">
                        On This Day
                      </h3>
                      <span className="rounded-full bg-[#fce7f3] px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#db2777]">
                        1 YEAR AGO
                      </span>
                    </div>
                    <div className="group relative flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded-[16px] bg-[#111827] transition-all hover:shadow-lg">
                      {/* Abstract glow effect behind text */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-40">
                        <div className="w-[150%] h-[30px] bg-blue-500 blur-2xl rotate-12 mix-blend-screen" />
                      </div>
                      <span className="relative z-10 text-[15px] font-medium text-white/90 drop-shadow-md transition-colors group-hover:text-white">
                        View Memory
                      </span>
                    </div>
                  </div>

                  {/* Mood Blobs Widget */}
                  <div className="rounded-[24px] border border-[#e2f1e6] bg-[#f9fdfa] p-5 shadow-sm">
                    <div className="mb-6">
                      <h3 className="text-[15px] font-medium text-[#4b5563]">
                        Our Mood Blobs
                      </h3>
                      <p className="text-[12px] text-[#9ca3af]">
                        Daily vibes check-in
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                      {[
                        {
                          name: "Soft",
                          emoji: "😊",
                          color: "#fce7f3",
                          textColor: "#f472b6",
                        },
                        {
                          name: "Zen",
                          emoji: "🌱",
                          color: "#d1e7dd",
                          textColor: "#4b5563",
                        },
                      ].map((mood) => (
                        <div
                          key={mood.name}
                          className="flex flex-col items-center gap-2 relative group"
                        >
                          <div
                            className="flex h-[72px] w-[72px] cursor-pointer items-center justify-center text-2xl transition-transform hover:scale-105 shadow-sm relative"
                            style={{
                              borderRadius:
                                mood.name === "Soft"
                                  ? "40% 60% 70% 30%"
                                  : "50% 50% 30% 70%",
                              backgroundColor: mood.color,
                            }}
                          >
                            {mood.emoji}
                            <button
                              onClick={() => {
                                setActiveMood(mood);
                                setIsMoodScrapbookOpen(true);
                              }}
                              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#c89868] text-white shadow-md opacity-0 transition-opacity group-hover:opacity-100"
                              type="button"
                              title="Open scrapbook"
                            >
                              <Maximize2 className="h-3 w-3" />
                            </button>
                          </div>
                          <span
                            className="text-[13px] font-bold"
                            style={{ color: mood.textColor }}
                          >
                            {mood.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Music Widget */}
                  <div className="rounded-[24px] border border-[#d1e7dd] bg-[#e8f7ea] p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[12px] bg-gray-800 shadow-sm">
                        <img
                          src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop"
                          alt="Album cover"
                          className="h-full w-full object-cover opacity-90"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="truncate text-[14px] font-bold text-[#1f2937]">
                          Strawberry Skies
                        </h4>
                        <p className="truncate text-[12px] text-[#6b7280]">
                          The Pastel Clouds
                        </p>
                      </div>
                      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#10b981] bg-transparent text-[#10b981] transition hover:bg-[#10b981] hover:text-white">
                        <Play className="ml-0.5 h-4 w-4 fill-current" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-[#6b7280]">
                        1:12
                      </span>
                      <div className="relative h-1.5 flex-1 rounded-full bg-[#d1e7dd] overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-[35%] rounded-full bg-[#10b981]" />
                      </div>
                      <span className="text-[10px] font-medium text-[#6b7280]">
                        3:45
                      </span>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DiaryWriter;
