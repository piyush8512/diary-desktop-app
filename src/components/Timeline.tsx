// src/components/Timeline.tsx
import { Heart, MessageCircle, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

type TimelineEntry = {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  monthGroup?: string; // Used to show month headers
  dotColor: string;
};

const timelineEntries: TimelineEntry[] = [
  {
    id: "1",
    date: "OCT 14",
    time: "4:30 PM",
    title: "Park with Buddy",
    description:
      "The weather today was absolutely perfect. A crisp autumn breeze with just enough sun to keep things warm. I decided to take Buddy to the large dog park across town...",
    image:
      "https://images.unsplash.com/photo-1602265261058-dd1629864273?auto=format&fit=crop&w=800&q=80",
    tags: ["#weekend", "#pets"],
    monthGroup: "October 2023",
    dotColor: "bg-[#f2d96b]",
  },
  {
    id: "2",
    date: "OCT 12",
    time: "9:00 AM",
    title: "Planning Q4",
    description:
      "Mapped out the goals for the next three months. Feeling prepared and aligned with the team. We are going to prioritize the new user onboarding flow finally.",
    tags: ["#work", "#planning"],
    dotColor: "bg-[#bfd2ff]",
  },
  {
    id: "3",
    date: "OCT 10",
    time: "8:15 PM",
    title: "Tough conversation",
    description:
      "Had to let go of an old friend today. It hurts but it is for the best. Sometimes paths diverge and trying to force them back together only causes more friction.",
    tags: ["#personal", "#reflections"],
    dotColor: "bg-[#d6dde8]",
  },
  {
    id: "4",
    date: "OCT 7",
    time: "10:00 AM",
    title: "Slow morning",
    description:
      "Rainy day outside, perfect for some tea and journaling by the window. I started reading that new fantasy novel everyone has been talking about.",
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    tags: ["#weekend", "#reading"],
    dotColor: "bg-[#b9d4ff]",
  },
  {
    id: "5",
    date: "SEP 28",
    time: "6:45 PM",
    title: "Completed the marathon!",
    description:
      "I cannot believe I actually did it. 6 months of training culminated in crossing that finish line today. My legs are completely dead but my spirit is soaring.",
    image:
      "https://images.unsplash.com/photo-1530143311094-34d807799e8f?auto=format&fit=crop&w=800&q=80",
    tags: ["#health", "#milestone"],
    monthGroup: "September 2023",
    dotColor: "bg-[#f4a7a1]",
  },
];

const Timeline = () => {
  const [activeFilter, setActiveFilter] = useState("All Entries");

  return (
    <section className="flex-1 h-full overflow-y-auto bg-[#f2eee8] p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-[Georgia,serif] text-3xl font-bold text-[#4d4338] md:text-4xl">
              Your Timeline
            </h1>
            <p className="mt-1 text-sm text-[#8a7f72] md:text-base">
              Scroll through your recent memories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-[#e8e0d5] p-1">
              {["All Entries", "Photos Only", "Favorites"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    activeFilter === filter
                      ? "bg-[#d3a17e] text-white shadow-sm"
                      : "text-[#6c6257] hover:bg-[#dfd5c8]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-[#a6998a]" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-40 rounded-full border border-[#ddd1c2] bg-white pl-9 pr-4 text-sm text-[#4d4338] placeholder-[#a6998a] outline-none transition focus:border-[#d3a17e] focus:ring-1 focus:ring-[#d3a17e]"
              />
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative ml-2 md:ml-4">
          {/* Vertical Line */}
          <div className="absolute bottom-0 left-[5px] top-2 w-[2px] bg-[#e4d9cc]" />

          {/* Entries */}
          <div className="flex flex-col gap-8">
            {timelineEntries.map((entry) => (
              <div key={entry.id} className="relative">
                {/* Month Group Label */}
                {entry.monthGroup && (
                  <div className="relative mb-6 ml-10 flex items-center">
                    <span className="rounded-full border border-[#d5c8b8] bg-[#fffaf3] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8a7f72]">
                      {entry.monthGroup}
                    </span>
                  </div>
                )}

                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-[#f2eee8] ${entry.dotColor}`}
                />

                {/* Entry Card */}
                <div className="ml-10">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-[#a6998a]">
                    <span>{entry.date}</span>
                    <span className="h-1 w-1 rounded-full bg-[#d5c8b8]" />
                    <span>{entry.time}</span>
                  </div>

                  <div className="rounded-2xl border border-[#e4d9cc] bg-[#fffaf3] p-5 shadow-[0_8px_30px_rgba(77,67,56,0.04)] transition hover:shadow-[0_12px_40px_rgba(77,67,56,0.06)]">
                    <h3 className="mb-3 font-[Georgia,serif] text-xl font-bold text-[#4d4338]">
                      {entry.title}
                    </h3>

                    {entry.image && (
                      <div className="mb-4 overflow-hidden rounded-xl border border-[#efe6db]">
                        <img
                          src={entry.image}
                          alt={entry.title}
                          className="h-[240px] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                        />
                      </div>
                    )}

                    <p className="mb-5 leading-relaxed text-[#6c6257]">
                      {entry.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#f0e6da] pt-4">
                      <div className="flex gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#f4ebd9] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#aa9175]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-[#a6998a]">
                        <button className="flex items-center gap-1.5 transition hover:text-[#d3a17e]">
                          <Heart className="h-4 w-4" />
                          <span className="text-xs font-semibold">0</span>
                        </button>
                        <button className="flex items-center gap-1.5 transition hover:text-[#d3a17e]">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs font-semibold">0</span>
                        </button>
                        <button className="transition hover:text-[#4d4338]">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;