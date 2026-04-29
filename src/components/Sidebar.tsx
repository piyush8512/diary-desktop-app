import { ArrowLeft, Menu, PenLine, X } from "lucide-react";
import { monthMoodItems, sidebarNavItems } from "../lib/sidebarData";

type SidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  activeView: "timeline" | "calendar";
  onNavigate: (view: "timeline" | "calendar") => void; // Added onNavigate
};

type SidebarLogoProps = {
  isCollapsed: boolean;
};

const SidebarLogo = ({ isCollapsed }: SidebarLogoProps) => (
  <div
    className={[
      "flex items-center px-6",
      isCollapsed ? "justify-center" : "gap-3",
    ].join(" ")}
  >
    {!isCollapsed && (
      <div className="leading-tight">
        <p className="font-[Georgia,serif] text-3xl font-semibold text-[#4d4338]">
          Diary
        </p>
      </div>
    )}
  </div>
);

const Sidebar = ({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
  activeView,
  onNavigate,
}: SidebarProps) => {
  return (
    <aside
      className={[
        "absolute inset-y-0 left-0 z-30 flex h-screen flex-col border-r border-[#e8e0d5] bg-[#f7f3ed] transition-all duration-300",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "w-72 lg:static lg:translate-x-0",
        isCollapsed ? "lg:w-24" : "lg:w-62",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden h-10 w-10 items-center justify-center rounded-full text-[#5e544a] transition hover:bg-[#ede5d8] lg:flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ArrowLeft className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#5e544a] transition hover:bg-[#ede5d8] lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="pt-2">
        <SidebarLogo isCollapsed={isCollapsed} />
      </div>

      <nav className="mt-8 px-4">
        <ul className="space-y-1">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            // Check if this item is the currently active view
            const isActive = activeView === item.id;

            return (
              <li key={item.id} className="my-3">
                <button
                  type="button"
                  onClick={() => {
                    // Only navigate if it's one of our supported views
                    if (item.id === "calendar" || item.id === "timeline") {
                      onNavigate(item.id as "timeline" | "calendar");
                    }
                  }}
                  className={[
                    "flex w-full items-center rounded-3xl px-4 py-2.5 text-sm font-semibold transition",
                    isCollapsed ? "justify-center" : "gap-3 text-left",
                    isActive
                      ? "bg-[#4e4338] text-[#f3ece1]" // Active styling
                      : "text-[#5e544a] hover:bg-[#ede5d8]", // Inactive styling
                  ].join(" ")}
                  title={item.label}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4">
        <button
          type="button"
          className={[
            "flex w-full items-center justify-center rounded-full bg-[#c99561] py-3 text-sm font-semibold text-[#fff8ef] shadow-sm transition hover:brightness-95",
            isCollapsed ? "px-0" : "gap-2 px-4",
          ].join(" ")}
          title="Write Entry"
        >
          <PenLine className="h-4 w-4" />
          {!isCollapsed && <span>Write Entry</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;