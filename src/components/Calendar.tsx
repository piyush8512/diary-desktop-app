import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DiaryWriter from "./DiaryWriter";
import { getAllEntries, initDB, saveEntry } from "../lib/storage";
import type { CalendarEntry } from "../types/calendar";

export type { CalendarEntry };

type CalendarProps = {
  onDiaryModeChange?: (isOpen: boolean) => void;
};

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const calendarEntries: CalendarEntry[] = [
  {
    date: "2023-10-01",
    title: "Sunday Reset",
    description:
      "Prepared meals for the week and finished a slow evening walk.",
    accent: "border-[#c9c0ff] bg-[#faf8ff]",
    dayDot: "bg-[#b9d4ff]",
  },
  {
    date: "2023-10-03",
    title: "Deep Work",
    description:
      "Managed to get into a flow state today with no interruptions.",
    accent: "border-[#c9c0ff] bg-[#fffefe]",
    dayDot: "bg-[#c9c0ff]",
  },
  {
    date: "2023-10-05",
    title: "Morning Light",
    description: "Discovered a hidden gem on my way to coffee.",
    accent: "border-[#c9c0ff] bg-[#fffefe]",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=420&q=80",
    imageLabel: "Morning walk photo",
    dayDot: "bg-[#f4de6a]",
  },
  {
    date: "2023-10-07",
    title: "Slow morning",
    description: "Rainy day, perfect for some tea and a journal reset.",
    accent: "border-[#c9c0ff] bg-[#fffefe]",
    dayDot: "bg-[#b9d4ff]",
  },
  {
    date: "2023-10-10",
    title: "Tough day",
    description:
      "Had to let go of an old friend today. It was harder than expected.",
    accent: "border-[#c9c0ff] bg-[#fffefe]",
    dayDot: "bg-[#d6dde8]",
  },
  {
    date: "2023-10-12",
    title: "Planning Q4",
    description:
      "Mapped out the goals for the next three months with a fresh notebook.",
    accent: "border-[#c9c0ff] bg-[#fffefe]",
    dayDot: "bg-[#bfd2ff]",
  },
  {
    date: "2023-10-13",
    title: "Friday Night",
    description: "Beat my 5k personal record after work.",
    accent: "border-[#c9c0ff] bg-[#fffefe]",
    dayDot: "bg-[#f4a7a1]",
  },
  {
    date: "2023-10-14",
    title: "Park with friends",
    description: "Spent the whole afternoon throwing leaves and talking.",
    accent: "border-[#c9c0ff] bg-[#fffefe]",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=420&q=80",
    imageLabel: "Park photo",
    dayDot: "bg-[#f2d96b]",
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

const formatKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getDaysInMonthGrid = (year: number, monthIndex: number) => {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const startDate = new Date(year, monthIndex, 1 - startOffset);

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
};

const Calendar = ({ onDiaryModeChange }: CalendarProps) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(formatKey(today));
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [typedDate, setTypedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<CalendarEntry[]>(calendarEntries);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        await initDB();
        const storedEntries = await getAllEntries();
        setEntries(storedEntries.length > 0 ? storedEntries : calendarEntries);
      } catch (error) {
        console.error("Failed to load diary entries:", error);
        setEntries(calendarEntries);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  const gridDates = useMemo(
    () => getDaysInMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const selectedDate = useMemo(
    () => new Date(selectedDateKey),
    [selectedDateKey],
  );
  const selectedEntry = entries.find((entry) => entry.date === selectedDateKey);

  const goToMonth = (monthOffset: number) => {
    setViewMonth((currentMonth) => {
      const nextMonth = currentMonth + monthOffset;
      if (nextMonth < 0) {
        setViewYear((currentYear) => currentYear - 1);
        return 11;
      }
      if (nextMonth > 11) {
        setViewYear((currentYear) => currentYear + 1);
        return 0;
      }
      return nextMonth;
    });
  };

  const openDatePicker = () => {
    setTypedDate("");
    setIsDatePickerOpen(true);
  };

  const closeDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  const jumpToTypedDate = () => {
    const parsedDate = new Date(typedDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return;
    }

    setSelectedDateKey(formatKey(parsedDate));
    setViewYear(parsedDate.getFullYear());
    setViewMonth(parsedDate.getMonth());
    setIsDatePickerOpen(false);
  };

  const handleToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDateKey(formatKey(now));
    setIsEditorOpen(false);
    onDiaryModeChange?.(false);
  };

  const openDiary = (date: Date) => {
    setSelectedDateKey(formatKey(date));
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
    setIsEditorOpen(true);
    onDiaryModeChange?.(true);
  };

  const handleSave = async (draft: {
    title: string;
    description: string;
    moodDrawing?: string | null;
  }) => {
    const title = draft.title.trim();
    const description = draft.description.trim();

    if (!title && !description) {
      return;
    }

    const selectedBase = selectedEntry;
    const updatedEntry: CalendarEntry = {
      date: selectedDateKey,
      title: title || selectedBase?.title || "Untitled entry",
      description: description || selectedBase?.description || "",
      accent: selectedBase?.accent ?? "border-[#c9c0ff] bg-[#fffefe]",
      image: selectedBase?.image,
      imageLabel: selectedBase?.imageLabel,
      dayDot: selectedBase?.dayDot ?? "bg-[#b9d4ff]",
      moodDrawing: draft.moodDrawing || selectedBase?.moodDrawing,
    };

    try {
      await saveEntry(updatedEntry);
    } catch (error) {
      console.error("Failed to save diary entry:", error);
    }

    setEntries((currentEntries) => {
      const index = currentEntries.findIndex(
        (entry) => entry.date === selectedDateKey,
      );

      if (index >= 0) {
        const nextEntries = [...currentEntries];
        nextEntries[index] = updatedEntry;
        return nextEntries;
      }

      return [...currentEntries, updatedEntry];
    });
  };

  if (isEditorOpen) {
    return (
      <DiaryWriter
        selectedDate={selectedDate}
        selectedEntry={selectedEntry}
        onBack={() => {
          setIsEditorOpen(false);
          onDiaryModeChange?.(false);
        }}
        onSave={handleSave}
      />
    );
  }

  if (isLoading) {
    return (
      <section className="flex-1 h-full overflow-hidden bg-[#f2eee8] p-4 flex items-center justify-center">
        <div className="text-center text-[#8a7f72]">
          <p className="font-[Georgia,serif] text-lg">Loading your diary...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 h-full overflow-hidden bg-[#f2eee8] p-4">
      {isDatePickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
          onClick={closeDatePicker}
        >
          <div
            className="w-full max-w-md rounded-[1.75rem] border border-[#ddd1c2] bg-[#fffaf3] p-4 shadow-[0_30px_80px_rgba(77,67,56,0.22)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Jump to date"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b1a394]">
                  Jump to date
                </p>
                <h2 className="mt-1 font-[Georgia,serif] text-2xl font-semibold text-[#4d4338]">
                  Type a date to jump
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDatePicker}
                className="rounded-full border border-[#ddd1c2] bg-white p-2 text-[#6c6257] transition hover:bg-[#f6efe6]"
                aria-label="Close date picker"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#e7dbcd] bg-white p-3">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#b1a394]">
                Date input
              </label>
              <input
                type="date"
                value={typedDate}
                onChange={(event) => setTypedDate(event.target.value)}
                className="w-full rounded-xl border border-[#e3d6c7] bg-[#fffdf8] px-3 py-2 text-sm text-[#4d4338] outline-none transition focus:border-[#c7b7a6] focus:ring-2 focus:ring-[#e8dccd]"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const todayKey = formatKey(now);
                    setTypedDate(todayKey);
                    setSelectedDateKey(todayKey);
                    setViewYear(now.getFullYear());
                    setViewMonth(now.getMonth());
                    setIsDatePickerOpen(false);
                  }}
                  className="rounded-full border border-[#dac9ef] bg-[#fffafc] px-3 py-1.5 text-xs font-semibold text-[#5d544a] transition hover:bg-white"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={jumpToTypedDate}
                  disabled={!typedDate}
                  className="ml-auto rounded-full bg-[#4d4338] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3f372f] disabled:cursor-not-allowed disabled:bg-[#cfc4b7]"
                >
                  Go to date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex h-full w-full max-w-7xl min-h-0 flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="mt-2 font-[Georgia,serif] text-3xl font-semibold text-[#4d4338] md:text-4xl">
              {monthLabels[viewMonth]} {viewYear}
            </h1>
            <p className="mt-1 text-sm text-[#8a7f72] md:text-base">
              {selectedEntry?.description
                ? stripHtml(selectedEntry.description)
                : "Autumn leaves and cozy evenings."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openDatePicker}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ded3c6] bg-[#fffaf2] text-[#6c6257] shadow-[0_6px_18px_rgba(77,67,56,0.06)] transition hover:bg-[#f6efe6]"
              aria-label="Open date picker"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1 rounded-2xl border border-[#ddd1c2] bg-[#fffaf3] p-1 shadow-[0_6px_20px_rgba(77,67,56,0.06)]">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-[#5e544a] transition hover:border-[#dacfc0] hover:bg-[#f6efe6]"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="h-8 rounded-xl border border-[#dac9ef] bg-white px-3 text-xs font-semibold text-[#5d544a] transition hover:bg-[#faf7ff] md:text-sm"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => goToMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-[#5e544a] transition hover:border-[#dacfc0] hover:bg-[#f6efe6]"
                aria-label="Next month"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ded3c6] bg-[#fffaf2] text-[#6c6257] shadow-[0_6px_18px_rgba(77,67,56,0.06)]"
              aria-label="Profile"
            >
              <UserCircle2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-[#f2eee8] p-3 md:p-0">
          <div className="mb-2 grid grid-cols-7 gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#b1a394] md:text-[10px]">
            {weekdayLabels.map((day) => (
              <div key={day} className="px-1.5">
                {day}
              </div>
            ))}
          </div>

          {/* FIX: Changed auto-rows to grid-rows-5 to evenly divide the exact 35 days without scrolling */}
          <div className="grid flex-1 min-h-0 grid-cols-7 grid-rows-5 gap-1.5 overflow-y-auto p-1 md:gap-2">
            {gridDates.map((date) => {
              const key = formatKey(date);
              const isCurrentMonth = date.getMonth() === viewMonth;
              const isSelected = key === selectedDateKey;
              const entry = entries.find((item) => item.date === key);
              const isToday = key === formatKey(today);
              const entryPreview = entry ? stripHtml(entry.description) : "";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDateKey(formatKey(date))}
                  onDoubleClick={() => openDiary(date)}
                  className={[
                    // FIX: Reduced padding slightly (p-1.5 md:p-2) and adjusted border radius to fit better
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-1.5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(77,67,56,0.08)] md:p-2",
                    isCurrentMonth
                      ? "border-[#e3d6c7] text-[#4d4338]"
                      : "border-[#efe6db] text-[#c2b5a6] opacity-60",
                    isSelected
                      ? "ring-2 ring-[#6c5b4f] ring-offset-1 ring-offset-[#fffaf3]"
                      : "",
                  ].join(" ")}
                  aria-label={date.toDateString()}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#b3a69a] md:text-[10px]">
                        {
                          weekdayLabels[
                            date.getDay() === 0 ? 6 : date.getDay() - 1
                          ]
                        }
                      </p>
                      {/* FIX: Scaled down date text slightly */}
                      <p className="mt-0.5 font-[Georgia,serif] text-[14px] font-semibold leading-none md:text-[16px]">
                        {date.getDate()}
                      </p>
                    </div>

                    {entry?.dayDot && (
                      <span
                        className={[
                          "mt-1 h-3 w-3 shrink-0 rounded-full",
                          entry.dayDot,
                        ].join(" ")}
                      />
                    )}
                  </div>

                  {entry && (
                    <div
                      className={[
                        "mt-1.5 flex flex-1 flex-col overflow-hidden rounded-lg border p-1 shadow-[0_8px_18px_rgba(77,67,56,0.05)]",
                        entry.accent,
                      ].join(" ")}
                    >
                      {entry.image ? (
                        <img
                          src={entry.image}
                          alt={entry.imageLabel ?? entry.title}
                          // FIX: Scaled down image height (h-10 to h-14)
                          className="mb-1 h-10 w-full shrink-0 rounded-md object-cover md:h-14"
                        />
                      ) : null}
                      <p className="truncate text-[10px] font-bold text-[#4f453b] md:text-[11px]">
                        {entry.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[9px] leading-3 text-[#8d7f72] md:text-[10px]">
                        {entryPreview}
                      </p>
                    </div>
                  )}

                  {isToday && !entry && (
                    <div className="absolute right-2 top-2 rounded-full bg-[#e6f1ff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#5d7094]">
                      Today
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calendar;
